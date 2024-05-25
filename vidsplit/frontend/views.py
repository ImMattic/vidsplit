from django.shortcuts import render


# Create your views here.
def index(request, *args, **kwargs):
    return render(request, "frontend/index.html")


def handle_video(request):
    video_id = request.GET.get('v')
    if video_id:
        return render(request, "frontend/index.html")
    else:
        # Handle the case where 'v' is not provided
        return render(request, 'error_page.html', {'error': 'No video ID provided'})
