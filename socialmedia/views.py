from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.utils import timezone
from socialmedia.models import *
import json
from geopy.geocoders import Nominatim
from django.http import HttpResponse, Http404
from mimetypes import guess_type

def get_local(request, longitude, latitude):
    response_data = []
    user = request.user
    longitude = int(float(longitude) / 10000)
    latitude = int(float(latitude) / 10000)
    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.reverse(latitude+","+longitude)
    city = location.raw['address']['city']
    posts = Post.objects.filter(city__in=[city]).order_by("-time")
    
    for post in posts:
        my_post = {
            'user_id': post.user.id,
            'post_id': post.id,
            'text': post.text,
            'content_type': post.content_type,
            'font': post.font,
            'time': post.time.strftime("%m/%d/%Y %I:%M %p"),
            'city': post.city
        }

        comments = post.comment.order_by('-time')
        my_comments = []
        for comment in comments:
            my_comment = {
                'user_id': comment.user.id,
                'id': comment.id,
                'text': comment.text,
                'time': comment.time.strftime("%m/%d/%Y %I:%M %p")  
            }
            my_comments.append(my_comment)

        my_post = {
            'post': my_post,
            'comments': my_comments
        }
        response_data.append(my_post)

    response_json = json.dumps(response_data)
    response = HttpResponse(response_json, content_type='application/json')
    response['Access-Control-Allow-Origin'] = '*'
    return response

@login_required
def photo(request, id):
    post = get_object_or_404(Post, id=id)
    image = post.image
    if not image:
        raise Http404
    content_type = guess_type(image.name)
    print('content_type:', content_type[0])
    return HttpResponse(image, content_type=content_type[0])

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
    # print(request.user.username)
    # print(request.user.first_name)
    # print(request.user.last_name)
    # print(request.user)
    user = Profile.objects.get(user=request.user)
    # print(user.picture)
    context = {
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
        'username': request.user.username,
        'picture_link': user.picture,
    }
    return render(request, 'socialmedia/index.html', context=context)

@login_required()
def local_stream(request):
    context = {}
    user = request.user
    profile = Profile.objects.get(user=request.user)
    context = {
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
        'username': request.user.username,
        'picture_link': profile.picture,
    }

    if request.method == 'GET':
        return render(request, 'socialmedia/index.html', context=context)
    
    post = Post()
    post.user = request.user
    post.text = request.POST['text']
    post.time = timezone.now()
    post.latitude = request.POST['lat']
    post.longitude = request.POST['long']
    print(post.longitude)
    print(post.latitude)
    post.save()

    return render(request, 'socialmedia/index.html', context=context)   

def login_action(request):
    return render(request, 'socialmedia/login.html')


def post_action(request):
    if request.method == "POST":
        post = Post()
        post.user = request.user
        post.text = request.POST['text']
        post.time = timezone.now()
        post.latitude = request.POST['lat']
        post.longitude = request.POST['long']
        print(post.longitude)
        print(post.latitude)

        geolocator = Nominatim(user_agent="geoapiExercises")
        location = geolocator.reverse(post.latitude+","+post.longitude)
        city = location.raw['address']['city']
        post.city = city
        post.save()

    return redirect(reverse('global_stream'))