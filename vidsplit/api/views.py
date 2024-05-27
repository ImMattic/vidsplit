from rest_framework import generics, status
from .serializers import VideoSerializer
from .models import Video
from rest_framework.response import Response
import requests
import isodate
import re
import yt_dlp
from moviepy.editor import VideoFileClip, concatenate_videoclips
from django.http import FileResponse, JsonResponse
import os
import shutil
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator


# Function to process timestamps to a format that can be used by youtube-dl
def process_timestamps(timestamp_dict):
    try:
        start_time = timestamp_dict["start"]
        end_time = timestamp_dict["end"]
        hour_regex = "(?<=T)\d{2}"
        mins_regex = "(?<=:)\d{2}"
        secs_regex = "(?<=:\d{2}:)\d{2}"

        st_hours_to_secs = (int(re.search(hour_regex, start_time).group()) - 5) * 3600
        st_mins_to_secs = int(re.search(mins_regex, start_time).group(0)) * 60
        st_secs = int(re.search(secs_regex, start_time).group())

        et_hours_to_secs = (int(re.search(hour_regex, end_time).group()) - 5) * 3600
        et_mins_to_secs = int(re.search(mins_regex, end_time).group(0)) * 60
        et_secs = int(re.search(secs_regex, end_time).group())

        return [(st_hours_to_secs + st_mins_to_secs + st_secs), (et_hours_to_secs + et_mins_to_secs + et_secs)]
    except:
        return JsonResponse(
            {"error": "An error occurred while trying to process the timestamps. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# Endpoint for initializing the video content and session
class Initialize(generics.ListAPIView):
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        try:
            initial_request = request.data
            video_id = initial_request.get("video_id")
            # Read in Youtube API key
            with open("./secrets/youtube_api_key.txt", "r") as file:
                yt_api_key = file.read().strip()
            yt_api_url = f"https://www.googleapis.com/youtube/v3/videos?key={yt_api_key}&id={video_id}&part=snippet&part=contentDetails"
            yt_api_response = requests.get(yt_api_url)
            thumbnail = yt_api_response.json()["items"][0]["snippet"]["thumbnails"][
                "maxres"
            ]["url"]
            title = yt_api_response.json()["items"][0]["snippet"]["title"]
            length = isodate.parse_duration(
                yt_api_response.json()["items"][0]["contentDetails"]["duration"]
            ).total_seconds()
            serializer = VideoSerializer(
                data={
                    "session_id": initial_request.get("session_id"),
                    "video_id": initial_request.get("video_id"),
                    "video_title": title,
                    "video_length": length,
                    "video_thumbnail": thumbnail,
                }
            )
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return JsonResponse(
                {"error": "An error occurred while trying to initialize the video content. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# Endpoint for generating the video content
class Generate(generics.ListAPIView):
        http_method_names = ["put"]

        def put(self, request, *args, **kwargs):
            try:
                session_id = request.data.get("session_id")
                timestamps = request.data.get("timestamps")
                converted_timestamps = []
                for timestamp in timestamps:
                    converted_timestamps.append(process_timestamps(timestamp))
                video = Video.objects.get(session_id=session_id)
                video.timestamps = converted_timestamps
                # Loop through timestamps and check if any exceed the length of the video
                for start, end in video.timestamps:
                    if end > video.video_length or start > video.video_length:
                        return JsonResponse(
                            {"error": "One or more timestamps exceeds video length. Please adjust timestamps and try again."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                # Loop through timestamps and check if any are empty or invalid
                for start, end in video.timestamps:
                    if start >= end:
                        return JsonResponse(
                            {"error": "One or more timestamps are invalid. Does one of the timestamps have a start time greater than or equal to the end time?"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                video.save()
                ydl_opts = {
                    'format': 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best',
                    'outtmpl': f'./temp/{video.session_id}/{video.video_id}.%(ext)s',
                    'verbose': False,
                }
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([f"https://www.youtube.com/watch?v={video.video_id}"])

                clip = VideoFileClip(f"./temp/{video.session_id}/{video.video_id}.mp4")
                clips = []

                for start, end in video.timestamps:
                    subclip = clip.subclip(start, end)
                    clips.append(subclip)
                
                final_clip = concatenate_videoclips(clips)

                final_clip.write_videofile(f"./temp/{video.session_id}/{video.video_id}_trimmed.mp4")

                # Close any open files
                final_clip.close()
                clip.close()
                # (
                #     ffmpeg
                #     .input(f"./temp/{video.session_id}/{video.video_id}.mp4", ss=video.timestamps[0][0], to=video.timestamps[0][1])
                #     .output(f"./temp/{video.session_id}/{video.video_id}_trimmed.mp4")
                #     .run()
                # )
                return Response({"message": "Video content generated successfully"}, status=status.HTTP_200_OK)
            except:
                return JsonResponse(
                    {"error": "An error occurred while trying to generate the video content. Please try again."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )


# Endpoint for downloading the video
class Download(generics.ListAPIView):
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        try:
            session_id = request.GET.get("session_id")
            video_id = request.GET.get("video_id")

            if session_id is None or video_id is None:
                return Response(
                    {"error": "session_id and video_id parameters are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            file_path = f"./temp/{session_id}/{video_id}_trimmed.mp4"

            if not os.path.exists(file_path):
                return Response(
                    {"error": "File not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            f = open(file_path, 'rb')
            response = FileResponse(f)
            response['Content-Disposition'] = f'attachment; filename="{video_id}_trimmed.mp4"'

            return response
        except:
            return JsonResponse(
                {"error": "An error occurred while trying to download the video. Please try again."},
                status=status.HTTP_400_BAD_REQUEST,
            )


# Endpoint for deleting the session
class Delete(generics.ListAPIView):
    http_method_names = ["delete"]

    def delete(self, request, *args, **kwargs):
        try:
            session_id = request.data.get("session_id")
            shutil.rmtree(f"./temp/{session_id}")
            return Response({"message": "Session deleted successfully"}, status=status.HTTP_200_OK)
        except:
            return JsonResponse(
                {"error": "An error occurred while trying to delete the session. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# Endpoint for gathering information about the session
class Session(generics.ListAPIView):
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        try:
            session_id = request.GET.get("session_id")
            if session_id is None:
                return Response(
                    {"error": "session_id parameter is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            video = Video.objects.filter(session_id=session_id)
            serializer = VideoSerializer(video, many=True)
            return Response(serializer.data)
        except:
            return JsonResponse(
                {"error": "An error occurred while trying to gather information about the session. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
