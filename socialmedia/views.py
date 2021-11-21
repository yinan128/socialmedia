from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.utils import timezone
from socialmedia.models import *
from socialmedia.forms import *
from geopy.geocoders import Nominatim
from geopy.point import Point
from newsapi import NewsApiClient
from allauth.socialaccount.models import SocialAccount

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


def login_action(request):
    return render(request, 'socialmedia/login.html')


def get_users_stat(request):
    print(SocialAccount.objects.filter(provider='github'))
    github_users_count = SocialAccount.objects.filter(provider='github').count()
    google_users_count = SocialAccount.objects.filter(provider='google').count()
    users_dis = {
        'github': github_users_count,
        'google': google_users_count,
    }
    return users_dis

def get_posts_stat():
    posts = list(Post.objects.all())
    posts_stat = {}
    posts_date = {}
    for post in posts:
        locator = Nominatim(user_agent="google")
        location = locator.reverse(Point(post.latitude, post.longitude))
        address = location.raw["address"]
        combined_addr = f"{address['road']}, {address['neighbourhood']}, {address['city']}"
        print(combined_addr)
        if combined_addr in posts_stat:
            posts_stat[combined_addr] += 1
        else:
            posts_stat[combined_addr] = 1

        time = post.time.date()
        if time in posts_date:
            posts_date[time] += 1
        else:
            posts_date[time] = 1
        
    posts_stat = {k: v for k, v in sorted(posts_stat.items(), key=lambda item: item[1], reverse=True)}
    return posts_stat, posts_date

def get_stat(request):
    users_dis = get_users_stat(request)
    user = Profile.objects.get(user=request.user)
    posts_stat, posts_date = get_posts_stat()
    posts_dis = []
    for key, value in posts_stat.items():
        posts_dis.append({'value': value, 'name': key})
        if len(posts_dis) >= 8:
            break
    date = []
    num = []
    for key, value in posts_date.items():
        tmp = str(key).split('-')
        date.append(int(''.join(tmp)))
        num.append(value)
        if len(date) >= 8:
            break
    context = {
        "users_dis": users_dis,
        "posts_dis": json.dumps(posts_dis),
        "date": date,
        "num": num,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'username': request.user.username,
        'picture': user.picture,
    }
    response_json = json.dumps(context)
    response = HttpResponse(response_json, content_type='application/json')
    response['Access-Control-Allow-Origin'] = '*'
    return response


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
        city = city,
        visibility = request.POST['visibility'],
    )
    print(post.longitude)
    print(post.latitude)
    post.save()

    return get_posts(request)

def add_comment(request):
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

    new_comment = Comment(text=request.POST['comment_text'], user=request.user, time=timezone.now())
    new_comment.save()

    post = Post.objects.filter(id=request.POST['post_id'])
    if post is not None:
        post = post[0]
    post.comment.add(new_comment)
    page = request.POST['page'].strip()
    post.save()

    if page.startswith('global'):
        return get_posts(request)

    return get_local(request, request.POST['lon'], request.POST['lat'])




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
            'city': city,
            'mine': (post.user == request.user),
        }
        # Check post visibility
        if( post.visibility == "Public" or my_post['mine']):
            response_data.append(my_post)

        elif( post.visibility == "Private" and post.user == request.user):
            response_data.append(my_post)

        elif( post.visibility == "Group" ) :
            found = False
            for group in post.hide_groups.all():
                if request.user in group.users.all():
                    found = True
            if not found:
                response_data.append(my_post)



    response_json = json.dumps(response_data)
    response = HttpResponse(response_json, content_type='application/json')
    response['Access-Control-Allow-Origin'] = '*'
    return response

# given the longitude and latitude, return the posts (excluding comments) in the same city.
def get_nearbyPosts(request, longitude, latitude):
    if request.method == 'POST':
        return HttpResponse({"error": 'invalid method'}, content_type='application/json', status=405)
    if not request.user.id or not request.user.is_authenticated:
        return HttpResponse({"error": 'not logged in'}, content_type='application/json', status=401)

    response_data = []
    longitude = str(float(longitude) / 10000)
    latitude = str(float(latitude) / 10000)
    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.reverse(latitude + "," + longitude)
    city = location.raw['address']['city']
    posts = Post.objects.filter(city__in=[city])

    for post in posts:
        my_post = {
            'firstname': post.user.first_name,
            'lastname': post.user.last_name,
            'text': cleanText(post.text),
            'created_time': post.time.isoformat(),
            'longitude': post.longitude,
            'latitude': post.latitude,
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
def get_news(request, longitude, latitude):
    if request.method == 'POST':
        return HttpResponse({"error": 'invalid method'}, content_type='application/json', status=405)
    if not request.user.id or not request.user.is_authenticated:
        return HttpResponse({"error": 'not logged in'}, content_type='application/json', status=401)

    response_data = []
    longitude = str(float(longitude) / 10000)
    latitude = str(float(latitude) / 10000)
    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.reverse(latitude + "," + longitude)
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

def get_local(request, longitude, latitude):
    response_data = []
    longitude = str(float(longitude) / 10000)
    latitude = str(float(latitude) / 10000)
    geolocator = Nominatim(user_agent="geoapiExercises")
    location = geolocator.reverse(latitude+","+longitude)
    city = location.raw['address']['city']
    posts = Post.objects.filter(city__in=[city]).order_by("time")

    for post in posts:
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


# Set post visibility (post_id and visibility given in request)
def set_post_visibility(request):
    print("inside set_post_visibility")
    for key,value in request.POST.items():
        print("{} {}".format(key,value))
    pid = request.POST['post_id']
    post = get_object_or_404(Post, id=pid)

    # Private
    if(request.POST['post_vis_option'] == "private"):
        print("-----PRIVATE-----")
        post.visibility = "Private"
        for grp in Group.objects.all():
            post.hide_groups.add(get_object_or_404(Group, id=grp.id))
        post.save()
        return redirect(reverse('global_stream'))

    # Public
    if(request.POST['post_vis_option'] == "public"):
        print("-----Public-----")
        post.visibility = "Public"
        for grp in post.hide_groups.all():
            grp_obj = get_object_or_404(Group, id=grp.id)
            post.hide_groups.remove(grp_obj) 
        post.save()
        return redirect(reverse('global_stream'))

    # Group
    print("-----Group-----")
    post.visibility = "Group"
    gid_keys = []
    for key,value in request.POST.items():
        if key.startswith("group_"):
            gid_keys.append(key)

    # Reset all groups
    for grp in post.hide_groups.all():
        grp_obj = get_object_or_404(Group, id=grp.id)
        post.hide_groups.remove(grp_obj) 
        
    for key in gid_keys:
        gid = int(request.POST[key])
        post.hide_groups.add(get_object_or_404(Group, id=gid))
    post.save()

    return redirect(reverse('global_stream'))


# Get post visibility (post_id given in request)
def get_post_visibility(request): 
    post_id = request.POST['post_id']

    post = get_object_or_404(Post, id=post_id)
    response_data = []
    response_data.append({'visibility':post.visibility})
    if post.visibility == "Group":
        groups = post.hide_groups.all()
        for group in groups:
            users_list = []
            for user in group.users.all():
                user_info = {
                    'user_id': user.id
                }
                users_list.append(user_info)

            group_info = {
                'group_id': group.id,
                'group_name': group.name,
                'group_users': users_list
            }
            response_data.append(group_info)

    response_json = json.dumps(response_data)
    response = HttpResponse(response_json, content_type='application/json')
    response['Access-Control-Allow-Origin'] = '*'
    return response

# Get all groups in the database
def get_groups(request):
    groups = Group.objects.all()
    response_data = []
    print(Group.objects.count())
    if( Group.objects.count() == 0):
        response_json = json.dumps(response_data)
        response = HttpResponse(response_json, content_type='application/json')
        response['Access-Control-Allow-Origin'] = '*'
        return response
    print(groups)
    for group in groups:
        users_list = []
        for user in group.users.all():
            user_info = {
                'user_id': user.id
            }
            users_list.append(user_info)

        group_info = {
            'group_id': group.id,
            'group_name': group.name,
            'group_users': users_list
        }
        response_data.append(group_info)
    response_json = json.dumps(response_data)
    response = HttpResponse(response_json, content_type='application/json')
    response['Access-Control-Allow-Origin'] = '*'
    return response



# get all users list
def users_list_action(request):
    response_data = []
    for user in User.objects.all():
        user_info = {
            'user_id': user.id, 
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
        response_data.append(user_info)
    response_json = json.dumps(response_data)
    response = HttpResponse(response_json, content_type='application/json')
    response['Access-Control-Allow-Origin'] = '*'
    return response

def add_group_action(request):
    # print("inside set_post_visibility")
    # for key,value in request.POST.items():
    #     print("{} {}".format(key,value))
    group = Group(name=request.POST['group-name'])
    group.save()
    users = []
    for key,value in request.POST.items():
        if key.startswith("user_"):
            print(value)
            group.users.add(get_object_or_404(User, id=int(value)))
            
    group.save()

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


