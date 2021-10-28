from django.shortcuts import render

# Create your views here.
def global_stream(request):
    return render(request, 'socialmedia/index.html')
