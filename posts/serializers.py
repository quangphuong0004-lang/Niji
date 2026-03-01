from rest_framework import serializers
from .models import Post, PostImage, PostLike, Comment
from accounts.models import User

class UserShortSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'avatar_url']

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None
    
class PostImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PostImage
        fields = ['id', 'image']

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None
    
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "content",
            "created_at",
            "parent",
            "replies",
            'is_owner',
        ]

    def get_user(self, obj):
        request = self.context.get("request")
        return UserShortSerializer(
            obj.user,
            context={"request": request}
        ).data

    def get_replies(self, obj):
        request = self.context.get("request")
        qs = obj.replies.all()
        return CommentSerializer(
            qs,
            many=True,
            context={"request": request}
        ).data
        
    def get_is_owner(self, obj):
        request = self.context.get("request")
        return request and request.user == obj.user

    
class PostSerializer(serializers.ModelSerializer):
    author = UserShortSerializer(read_only=True)
    images = PostImageSerializer(many=True, read_only=True)
    likes_count = serializers.IntegerField(source="likes.count", read_only=True)
    comments = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "content",
            "created_at",
            "images",
            "likes_count",
            "is_liked", 
            "comments",
            'is_owner',
        ]

    def get_comments(self, obj):
        request = self.context.get("request")
        qs = obj.comments.filter(parent__isnull=True)
        return CommentSerializer(
            qs,
            many=True,
            context={"request": request}
        ).data
    
    def get_is_liked(self, obj):
        request = self.context.get("request")

        if not request or request.user.is_anonymous:
            return False

        return obj.likes.filter(user=request.user).exists()
    
    def get_is_owner(self, obj):
        request = self.context.get("request")
        return request and request.user == obj.author