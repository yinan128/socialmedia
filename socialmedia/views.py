from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from socialmedia.models import *

def update_user_social_data(strategy, *args, **kwargs):
    try:
        response = kwargs['response']
        backend = kwargs['backend']
        user = kwargs['user']
        print("HAHAHAHAHAHAHA")
        print(response)

        if response['picture']:
            url = response['picture']
            print("I really go here")
            print(url)
            try:
                userProfile_obj = Profile.objects.get(user=user)
            except Profile.DoesNotExist:
                userProfile_obj = Profile()
                userProfile_obj.user = user
                userProfile_obj.picture = url
                userProfile_obj.save()
    except:
        pass

# Create your views here.
@login_required()
def global_stream(request):
    print(request.user.username)
    print(request.user.first_name)
    print(request.user.last_name)
    print(request.user)
    user = Profile.objects.get(user=request.user)
    print(user.picture)
    context = {
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
        'username': request.user.username,
        'picture_link': user.picture,
    }
    return render(request, 'socialmedia/index.html', context=context)

def login_action(request):
    return render(request, 'socialmedia/login.html')
