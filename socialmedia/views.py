from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required(login_url='login')
def global_stream(request):
    print("here???")
    return render(request, 'socialmedia/index.html')

def login_action(request):
    return render(request, 'socialmedia/login.html')
