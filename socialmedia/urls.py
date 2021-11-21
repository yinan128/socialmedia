from django.urls import path
from socialmedia import views

urlpatterns = [
    path('', views.global_stream, name='global_stream'),
    path('login', views.login_action, name='login'),
    path('post', views.post_action, name='post'),
    path('get-posts', views.get_posts),

    path('set-visibility', views.set_post_visibility, name="visibility"),
    path('get-groups', views.get_groups, name="getGroups"),
    path('get-visibility', views.get_post_visibility, name="get_visibility"),
    path('users-list', views.users_list_action, name="usersList"),
    path('add-group', views.add_group_action, name="addGroup"),

    path('get-postsNearby/<str:longitude>/<str:latitude>/', views.get_nearbyPosts),
    path('get-local-news/<str:longitude>/<str:latitude>/', views.get_news),
    path('get-local/<str:longitude>/<str:latitude>/', views.get_local),
    path('add-comment', views.add_comment),
    path('stat', views.get_stat, name='stat')
]