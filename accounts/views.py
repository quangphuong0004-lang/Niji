from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework import status, permissions
from .serializers import RegisterSerializer, UserSerializer, UpdateProfileSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Đăng ký thành công'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user, context = {'request': request})
        return Response(serializer.data)
    

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, username):
        user = get_object_or_404(User, username = username)
        serializer = UserSerializer(user, context = {'request': request})
        return Response(serializer.data)


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        serializer = UpdateProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                UserSerializer(
                    request.user,
                    context={'request': request}
                ).data,
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)