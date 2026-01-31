from rest_framework import serializers 
from .models import User
from django.contrib.auth.password_validation import validate_password
from socials.models import Follow

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    full_name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    date_of_birth = serializers.DateField(required=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'full_name', 'phone', 'date_of_birth']

    def create(self, validated_data):
        if validated_data.get("phone") == "":
            validated_data["phone"] = None

        return User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data.get("email"),
            full_name=validated_data.get("full_name"),
            phone=validated_data.get("phone"),
            date_of_birth=validated_data.get("date_of_birth"),
        )

class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_self = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'full_name',
            'avatar_url',
            'bio',
            'date_of_birth',
            'last_active',
            'is_verified',
            'date_joined',
            'is_following',
            'followers_count',
            'following_count',
            'is_self',
        ]

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None
    
    def get_is_following(self, obj):
        request = self.context.get('request')
        if not request or request.user.is_anonymous:
            return False

        return Follow.objects.filter(
            follower=request.user,
            following=obj
        ).exists()
    
    def get_followers_count(self, obj):
        return Follow.objects.filter(following=obj).count()

    def get_following_count(self, obj):
        return Follow.objects.filter(follower=obj).count()
    
    def get_is_self(self, obj):
        request = self.context.get("request")
        return request.user == obj

class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "full_name",
            "bio",
            "date_of_birth",
            "avatar",
        ]