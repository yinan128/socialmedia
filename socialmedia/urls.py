from django.urls import path
from socialmedia import views

urlpatterns = [
    path('', views.global_stream, name='global_stream'),
    path('login', views.login_action, name='login'),
    path('post', views.post_action, name='post'),
    path('local_stream/<int:longitude>/<int:latitude>/', views.local_stream, name='local'),
    path('socialnetwork/get-local', views.get_local),
    path('get-posts', views.get_posts),
    path('get-postsNearby', views.get_nearbyPosts),
    path('get-local-news', views.get_news),
    path('addPost', views.addPost, name='newPost')

]