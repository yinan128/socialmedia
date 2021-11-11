from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.utils import timezone
from socialmedia.models import *
from socialmedia.forms import *
from geopy.geocoders import Nominatim

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
        user = request.user,
        text = request.POST['text'],
        time = timezone.now(),
        latitude = request.POST['lat'],
        longitude = request.POST['long']
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


def set_post_visibility(request):
    print("inside set_post_visibility")
    for key,value in request.POST.items():
        print("{} {}".format(key,value))
    pid = request.POST['post_id']
    post = get_object_or_404(Post, id=pid)

    # Private
    if(request.POST['post_vis_option'] == "private"):
        print("-----PRIVATE-----")
        for grp in Group.objects.all():
            post.hide_groups.add(get_object_or_404(Group, id=grp.id))
        return redirect(reverse('global_stream'))

    # Public
    if(request.POST['post_vis_option'] == "public"):
        print("-----Public-----")
        for grp in post.hide_groups.all():
            grp_obj = get_object_or_404(Group, id=grp.id)
            post.hide_groups.remove(grp_obj) 
        return redirect(reverse('global_stream'))

    # Group
    print("-----Group-----")
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

    return redirect(reverse('global_stream'))


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





def _my_json_error_response(message, status=200):
    # You can create your JSON by constructing the string representation yourself (or just use json.dumps)
    response_json = '{ "error": "' + message + '" }'
    return HttpResponse(response_json, content_type='application/json', status=status)

