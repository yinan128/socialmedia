from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.utils import timezone
from socialmedia.models import *
from socialmedia.forms import *
from geopy.geocoders import Nominatim
from newsapi import NewsApiClient

import json


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
    }
    context['form'] = PostForm()
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

    post = Post(
        user=request.user,
        text=request.POST['text'],
        time=timezone.now(),
        latitude=request.POST['lat'],
        longitude=request.POST['long']
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


def get_nearbyPosts(request):
    response_data = []
    # # add the request info at the beginning of the response json.
    # response_data.append({
    #     'type': 'request',
    #     'id': -1,
    #     'user': request.user.username,
    #     'firstname': request.user.first_name,
    #     'lastname': request.user.last_name,
    #     'text': "",
    #     'created_time': timezone.now().isoformat(),
    #     'longitude': request.POST["long"],
    #     'latitude': request.POST["lat"],
    #     'city': ""
    # })

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
            'text': cleanText(post.text),
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

def cleanText(text):
    return text.replace("<p>","").replace("</p>","")\
        .replace("&nbsp;","<br>")\
        .replace("<strong>","<b>").replace("</strong>","</b>")\
        .replace("<h2>","").replace("</h2>","")\
        .replace("<h3>","").replace("</h3>","<br>")\
        .replace("<h3>","").replace("</h3>","<br>")


# todo: error handling.
def get_news(request):
    response_data = []
    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.reverse(str(request.POST['lat']) + "," + str(request.POST['long']))
    city = location.raw['address']['city']
    i = 0
    for title, author, publish, description, url, imageUrl in getNewsFromCity(city):
        response_data.append({
            "title": title,
            "author": author,
            "publish": publish,
            "description": description,
            "url": url,
            "imageUrl": imageUrl
        })
        i += 1
        if i == 20: break

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
        yield article['title'], article['source']['name'], article['publishedAt'], article['description'], article['url'], article['urlToImage']


