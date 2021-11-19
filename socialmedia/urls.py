from django.urls import path
from socialmedia import views

urlpatterns = [
    path('', views.global_stream, name='global_stream'),
    path('login', views.login_action, name='login'),
    path('post', views.post_action, name='post'),
    path('get-posts', views.get_posts),
    path('get-postsNearby', views.get_nearbyPosts),
    path('get-local-news', views.get_news),
    path('addPost', views.addPost, name='newPost'),
    path('get-local/<str:longitude>/<str:latitude>/', views.get_local),
    path('add-comment', views.add_comment),
    path('stat', views.get_stat, name='stat')
]