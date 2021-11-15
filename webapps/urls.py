"""webapps URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from django.contrib.auth import views as auth_views
from socialmedia import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.global_stream),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('logout', auth_views.logout_then_login, name='logout'),
    path('local_stream', views.local_stream, name='local'),
    path('socialnetwork/get-local/<longitude>/<latitude>/', views.get_local),
    url(r'profile-photo/(?P<id>\d+)$', views.photo, name='photo'),
    url(r'photo/(?P<id>\d+)$', views.post_photo),
    path('socialmedia/', include('socialmedia.urls')),
    path('socialnetwork/add-comment', views.add_comment, name='ajax-add-comment')
]
  