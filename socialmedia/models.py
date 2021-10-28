from django.db import models

from django.contrib.auth.models import User
from django.db.models.fields import CharField

# Create your models here.
class Comment(models.Model):
    user = models.ForeignKey(User, default=None, on_delete=models.PROTECT)
    text = models.CharField(max_length=200)
    # parent_post = models.ForeignKey(Post)
    time = models.DateTimeField()


class Post(models.Model):
    user = models.ForeignKey(User, default=None, on_delete=models.PROTECT)
    text = models.CharField(max_length=200)
    image = models.FileField(blank=True)
    content_type = models.CharField(max_length=50)
    font = models.CharField(max_length=50)
    time = models.DateTimeField()
    comment = models.ManyToManyField(Comment)

class Group(models.Model):
    name: models.CharField(max_length=40)
    users: models.ManyToManyField(User)

class Profile(models.Model):
    user = models.ForeignKey(User, default=None, on_delete=models.PROTECT)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    blacklist = models.ManyToManyField(User)
    following = models.ManyToManyField(User)
    groups = models.ManyToManyField(Group)
