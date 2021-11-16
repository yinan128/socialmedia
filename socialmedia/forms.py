from django import forms
from socialmedia.models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('text', 'font', 'body',)