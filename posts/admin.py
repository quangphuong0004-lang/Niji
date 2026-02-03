from django.contrib import admin
from .models import Post, PostImage, PostLike, Comment
# Register your models here.

admin.site.register(Post)
admin.site.register(PostImage)
admin.site.register(PostLike)
admin.site.register(Comment)
