from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Follow
from .serializers import UserPublicSerializer, FollowSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

#Tìm kiếm user
class UserSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        keyword = request.query_params.get('q', '').strip()

        queryset = User.objects.filter(
            Q(username__icontains=keyword) |
            Q(full_name__icontains=keyword)
        )
        queryset = queryset.exclude(id=request.user.id)

        serializer = UserPublicSerializer(
            queryset,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)
    

#Follow
class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if request.user.id == user_id:
            return Response(
                {"detail": "Không thể follow chính mình"},
                status=400
            )

        try:
            following = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "Người dùng không tồn tại"},
                status=404
            )

        follow, created = Follow.objects.get_or_create(
            follower=request.user,
            following=following
        )

        if not created:
            return Response(
                {"detail": "Đã follow"},
                status=400
            )

        return Response(
            FollowSerializer(
                follow,
                context={'request': request}
            ).data,
            status=201
        )


#Unfollow       
class UnfollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        try:
            follow = Follow.objects.get(
                follower=request.user,
                following_id=user_id
            )
        except Follow.DoesNotExist:
            return Response(
                {"detail": "Chưa follow user này"},
                status=400
            )

        follow.delete()
        return Response({"detail": "Đã unfollow"})

#Following
class FollowingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"detail": "User không tồn tại"},
                status=404
            )

        follows = Follow.objects.filter(follower=user)

        serializer = FollowSerializer(
            follows,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

#Followers
class FollowersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User không tồn tại"}, status=404)

        followers = Follow.objects.filter(following=user)

        serializer = FollowSerializer(
            followers,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)