from django.urls import path
from socialmedia import views

urlpatterns = [
    path('', views.global_stream, name='global_stream'),
    path('login', views.login_action, name='login'),
    path('post', views.post_action, name='post'),
    path('get-posts', views.get_posts),
    path('addPost', views.addPost, name='newPost'),
    path('set-visibility', views.set_post_visibility, name="visibility"),
    path('get-groups', views.get_groups, name="getGroups"),
]