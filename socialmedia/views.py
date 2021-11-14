from django.http import HttpResponse, Http404
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.utils import timezone
from socialmedia.models import *
import json
from geopy.geocoders import Nominatim
from mimetypes import guess_type
from socialmedia.forms import *
from newsapi import NewsApiClient

def get_local(request, longitude, latitude):
    response_data = []
    user = request.user
    print('longitude:', longitude, 'latitude:', latitude)
    longitude = str(float(longitude) / 10000)
    latitude = str(float(latitude) / 10000)
    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.reverse(latitude+","+longitude)
    city = location.raw['address']['city']
    print('city:', city)
    posts = Post.objects.filter(city__in=[city]).order_by("-time")

    for post in posts:
        geolocator = Nominatim(user_agent="geoapiExercises")
        location = geolocator.reverse(str(post.latitude) + "," + str(post.longitude))
        city = location.raw['address']['city']
        my_post = {
            'type': 'post',
            'id': post.id,
            'user': post.user.username,
            'firstname': post.user.first_name,
            'lastname': post.user.last_name,
            'text': post.text,
            'created_time': post.time.isoformat(),
            'longitude': post.longitude,
            'latitude': post.latitude,
            'city': city
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
        'stream': "global"
    }
    context['form'] = PostForm()
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
        'stream': "local"
    }
    print('before get')

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
    if request.method != 'POST':
        return _my_json_error_response("You must use a POST request for this operation", status=405)

    if not request.user.id:
        return _my_json_error_response("You must be logged in to do this operation", status=401)

    if not 'csrfmiddlewaretoken' in request.POST or not request.POST['csrfmiddlewaretoken']:
        return _my_json_error_response("You must have valid csrftoken.", status=400)

    if not 'text' in request.POST or not request.POST['text']:
        return _my_json_error_response("Invalid post.", status=400)

    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.reverse(request.POST['lat']+","+request.POST['long'])
    city = location.raw['address']['city']

    post = Post(
        user=request.user,
        text=request.POST['text'],
        time=timezone.now(),
        latitude=request.POST['lat'],
        longitude=request.POST['long'],
        city=city
    )
    print(post.longitude)
    print(post.latitude)
    post.save()

    return get_posts(request)


def get_posts(request):
    response_data = []
    for post in Post.objects.all().order_by('time'):
        geolocator = Nominatim(user_agent="geoapiExercises")
        location = geolocator.reverse(str(post.latitude) + "," + str(post.longitude))
        city = location.raw['address']['city']
        my_post = {
            'type': 'post',
            'id': post.id,
            'user': post.user.username,
            'firstname': post.user.first_name,
            'lastname': post.user.last_name,
            'text': post.text,
            'created_time': post.time.isoformat(),
            'longitude': post.longitude,
            'latitude': post.latitude,
            'city': city
        }
        response_data.append(my_post)

    response_json = json.dumps(response_data)
    response = HttpResponse(response_json, content_type='application/json')
    response['Access-Control-Allow-Origin'] = '*'
    return response


# todo: error handling.
def get_news(request):
    response_data = []
    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.reverse(str(request.POST['lat']) + "," + str(request.POST['long']))
    city = location.raw['address']['city']
    i = 0
    for title, publish, description, url in getNewsFromCity(city):
        response_data.append({
            "title": title,
            "publish": publish,
            "description": description,
            "url": url
        })
        i += 1
        if i == 10: break

    response_json = json.dumps(response_data)
    response = HttpResponse(response_json, content_type='application/json')
    response['Access-Control-Allow-Origin'] = '*'
    return response

def addPost(request):
    context = {}
    if request.method == "GET":
        context['posts'] = Post.objects.all()

        context['form'] = PostForm()
        return render(request, 'socialmedia/addTemplate.html', context)
    post = Post()
    post.user = request.user
    post.time = timezone.now()
    post.latitude = 88
    post.longitude = 88
    post_form = PostForm(request.POST, instance=post)
    post_form.save()
    return redirect(reverse('global_stream'))


def _my_json_error_response(message, status=200):
    # You can create your JSON by constructing the string representation yourself (or just use json.dumps)
    response_json = '{ "error": "' + message + '" }'
    return HttpResponse(response_json, content_type='application/json', status=status)

############# Helpers ################
def getNewsFromCity(city):
    newsapi = NewsApiClient(api_key='908bae16c1a84c37b739cc24cd7314a9')

    all_articles = newsapi.get_everything(
        qintitle=city,
        language='en',
        sort_by='publishedAt'
    )

    for article in all_articles['articles']:
        yield article['title'], article['publishedAt'], article['description'], article['url']
