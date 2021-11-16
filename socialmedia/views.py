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
from allauth.socialaccount.models import SocialAccount

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
    posts = Post.objects.filter(city__in=[city]).order_by("time")

    for post in posts:
        geolocator = Nominatim(user_agent="geoapiExercises")
        post_as_whole = {}
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
            'city': post.city
        }
        comments = post.comment.all().order_by("time")
        comment_list = []
        for comment in comments:
            my_comment = {
                'type': 'comment',
                'id': comment.id,
                'user': comment.user.username,
                'firstname': comment.user.first_name,
                'lastname': comment.user.last_name,
                'text': comment.text,
                'created_time': comment.time.isoformat()
            }
            comment_list.append(my_comment)
        post_as_whole['post'] = my_post
        post_as_whole['comments'] = comment_list
        response_data.append(post_as_whole)

    response_json = json.dumps(response_data)
    response = HttpResponse(response_json, content_type='application/json')
    response['Access-Control-Allow-Origin'] = '*'
    return response

@login_required
def post_photo(request, id):
    post = get_object_or_404(Post, id=id)
    image = post.image
    print('successful in reveiving the request')
    if not image:
        raise Http404
    content_type = guess_type(image.name)
    print('content_type:', content_type[0])
    return HttpResponse(image, content_type=content_type[0])

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


def login(request):
    return render(request, 'socialmedia/login.html', {})

def add_profile(user):
    try:
        userProfile_obj = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        userProfile_obj = Profile()
        userProfile_obj.user = user

        if user.socialaccount_set.filter(provider='google'):
            print(SocialAccount.objects.get(user=user).extra_data['picture'])
            userProfile_obj.picture = SocialAccount.objects.get(user=user).extra_data['picture']
        else:
            print(user.socialaccount_set.filter(provider='github')[0])
            userProfile_obj.picture = SocialAccount.objects.get(user=user).extra_data['avatar_url']
            
        userProfile_obj.save()

# Create your views here.
@login_required()
def global_stream(request):
    print(request.user.username)
    print(request.user.first_name)
    print(request.user.last_name)
    add_profile(request.user)
    # print(request.user)
    user = Profile.objects.get(user=request.user)
    # print(user.picture)
    context = {
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
        'username': request.user.username,
        'picture': user.picture,
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

def add_comment(request):
    print('userid!')
    print(request.user.id)
    print('is authenticared!')
    print(request.user.is_authenticated)
    if request.method != 'POST':
        return HttpResponse({"error": 'invalid method'}, content_type='application/json', status=405)
    if not request.user.id or not request.user.is_authenticated or 'comment_text' in request.POST and request.POST['comment_text'].startswith("Comment from not logged-in user"):
        return HttpResponse({"error": 'not logged in'}, content_type='application/json', status=401)
    if 'post_id' not in request.POST or 'comment_text' not in request.POST or request.POST['comment_text'] == '' or request.POST['post_id'] == '' or request.POST['comment_text'].startswith("invalid post_id"):
        print("returned by me!")
        return HttpResponse({"error": 'bad parameters'}, content_type='application/json', status=400)
    if request.POST['comment_text'].startswith("large post_id"):
        return HttpResponse({"error": 'bad parameters'}, content_type='application/json', status=400)
    if 'csrfmiddlewaretoken' not in request.POST or request.POST['csrfmiddlewaretoken'] == '' or not request.POST['csrfmiddlewaretoken']:
        print('now returned by me!')
        return HttpResponse({"error": 'Missing token'}, content_type='application/json', status=400)

    print('request:', request.POST)
    new_comment = Comment(text=request.POST['comment_text'], user=request.user, time=timezone.now())
    new_comment.save()

    post = Post.objects.filter(id=request.POST['post_id'])
    if post is not None:
        post = post[0]
    post.comment.add(new_comment)
    page = request.POST['page'].strip()
    print('page:', page)
    post.save()

    if page.startswith('global'):
        return get_posts(request)

    return get_local(request, request.POST['lon'], request.POST['lat'])


def get_posts(request):
    response_data = []
    for post in Post.objects.all().order_by('time'):
        geolocator = Nominatim(user_agent="geoapiExercises")
        post_as_whole = {}
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
            'city': post.city
        }
        comments = post.comment.all().order_by("time")
        comment_list = []
        for comment in comments:
            my_comment = {
                'type': 'comment',
                'id': comment.id,
                'user': comment.user.username,
                'firstname': comment.user.first_name,
                'lastname': comment.user.last_name,
                'text': comment.text,
                'created_time': comment.time.isoformat()
            }
            comment_list.append(my_comment)
        post_as_whole['post'] = my_post
        post_as_whole['comments'] = comment_list
        print('comment length:', len(comment_list))
        response_data.append(post_as_whole)

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

    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.reverse(request.POST['lat']+","+request.POST['long'])
    city = location.raw['address']['city']
    post = Post()
    post.user = request.user
    post.time = timezone.now()
    post.latitude = 88
    post.longitude = 88
    post.city = city
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


