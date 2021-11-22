from django.db import models

from django.contrib.auth.models import User
from django.db.models.fields import CharField
from ckeditor.fields import RichTextField


# Create your models here.
class Comment(models.Model):
    user = models.ForeignKey(User, default=None, on_delete=models.PROTECT)
    text = models.CharField(max_length=200)
    # parent_post = models.ForeignKey(Post)
    time = models.DateTimeField()

class Group(models.Model):
    name = models.CharField(max_length=40, default="Default")
    users = models.ManyToManyField(User, related_name="users")


# geo ref: https://stackoverflow.com/questions/50626626/how-to-save-html5-geolocation-data-to-python-django-admin
class Post(models.Model):
    user = models.ForeignKey(User, default=None, on_delete=models.PROTECT)
    text = models.CharField(max_length=200)
    image = models.FileField(blank=True)
    content_type = models.CharField(max_length=50)
    time = models.DateTimeField(blank=True)
    comment = models.ManyToManyField(Comment)
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)
    city = models.CharField(max_length=50)
    body = RichTextField(blank=True, null=True)
    visibility = models.CharField(max_length=10, default='Public')
    hide_groups = models.ManyToManyField(Group, default=None)
    combined_addr = models.CharField(max_length=50)


class Profile(models.Model):
    user = models.OneToOneField(User, default=None, on_delete=models.PROTECT)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    picture = models.TextField(null=True, blank=True)
    # blacklist = models.ManyToManyField(User)
    following = models.ManyToManyField(User, related_name='following')
    groups = models.ManyToManyField(Group, default=None)

