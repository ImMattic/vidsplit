from rest_framework import generics, status
from .serializers import VideoSerializer
from .models import Video
from rest_framework.response import Response
import requests
import isodate
import re


# Function to process timestamps to a format that can be used by youtube-dl
def process_timestamps(timestamp_dict):
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


# Endpoint for initializing the video content and session
class Initialize(generics.ListAPIView):
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
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


# Endpoint for generating the video content
class Generate(generics.ListAPIView):
    http_method_names = ["put"]

    def put(self, request, *args, **kwargs):
        session_id = request.data.get("session_id")
        timestamps = request.data.get("timestamps")
        converted_timestamps = []
        for timestamp in timestamps:
            converted_timestamps.append(process_timestamps(timestamp))
        video = Video.objects.get(session_id=session_id)
        video.timestamps = converted_timestamps
        video.save()
        return Response({"message": "Video content generated successfully"}, status=status.HTTP_200_OK)


# Endpoint for downloading the video
class Download(generics.ListAPIView):
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        video_id = self.kwargs.get("video_id")
        video = Video.objects.get(
            video_id=video_id, session_id=request.session.session_key
        )
        serializer = VideoSerializer(video)
        return Response(serializer.data)


# Endpoint for gathering information about the session
class Session(generics.ListAPIView):
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        session_id = request.GET.get("session_id")
        if session_id is None:
            return Response(
                {"error": "session_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        video = Video.objects.filter(session_id=session_id)
        serializer = VideoSerializer(video, many=True)
        return Response(serializer.data)
