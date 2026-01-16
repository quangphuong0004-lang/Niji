from rest_framework import serializers 
from .models import User
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators = [validate_password])
    
    class Meta:
        model = User
        fields = ['username', 'password', 'full_name', 'phone', 'email', 'date_of_birth']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            password = validated_data['password'],
            full_name = validated_data.get('full_name'),
            phone = validated_data.get('phone'),
            email = validated_data.get('email'),
            date_of_birth = validated_data.get('date_of_birth'),
        )
        return user
    