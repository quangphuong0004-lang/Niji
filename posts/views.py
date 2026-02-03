import json
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Post, PostImage, PostLike, Comment
from .serializers import PostSerializer, CommentSerializer
from .permissions import IsPostOwner, IsCommentOwner
from django.shortcuts import get_object_or_404
from socials.models import Follow
from rest_framework.parsers import MultiPartParser, FormParser


class PostListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        posts = Post.objects.all().prefetch_related(
            "images", "likes", "comments__replies"
        )
        serializer = PostSerializer(posts, many = True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class PostCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PostSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        
        post = serializer.save(author=request.user)
        images = request.FILES.getlist('images')
        
        for img in images:
            PostImage.objects.create(post=post, image=img)
        
        return Response(
            PostSerializer(post, context={"request": request}).data,
            status=status.HTTP_201_CREATED
        )
     
        
class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        post = get_object_or_404(
            Post.objects.prefetch_related(
                "images",
                "likes",
                "comments__replies"
            ),
            pk=pk
        )

        serializer = PostSerializer(
            post,
            context={"request": request}
        )
        return Response(serializer.data)
    
    
class PostUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsPostOwner]
    parser_classes = [MultiPartParser, FormParser]
    
    def put(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        self.check_object_permissions(request, post)
        
        serializer = PostSerializer(post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        removed = request.data.get("removed_images")
        if removed:
            ids = json.loads(removed)
            PostImage.objects.filter(id__in=ids, post=post).delete()

        images = request.FILES.getlist("images")
        for img in images:
            PostImage.objects.create(post=post, image=img)

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class PostDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsPostOwner]
    
    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        self.check_object_permissions(request, post)
        
        post.delete()
        return Response({'Thông báo':'Xóa thành công'}, status=status.HTTP_204_NO_CONTENT)
    
class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        like, created = PostLike.objects.get_or_create(user=request.user, post=post)
        
        if not created:
            like.delete()
            return Response(
                {
                    "liked": False,
                    "likes_count": post.likes.count()
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {
                "liked":True,
                "likes_count":post.likes.count()
            },
            status=status.HTTP_200_OK
        )


class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        
        parent_id = request.data.get('parent')
        parent = None
        
        if parent_id:
            parent = get_object_or_404(Comment, id=parent_id, post=post)
        
        serialier = CommentSerializer(data=request.data)
        serialier.is_valid(raise_exception=True)
            
        comment = serialier.save(user=request.user, post=post, parent=parent)
            
        return Response(CommentSerializer(comment, context={"request": request}).data, status=status.HTTP_201_CREATED)
        
class CommentDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsCommentOwner]
    
    def delete(self, request, pk):
        comment = get_object_or_404(Comment, pk=pk)
        
        self.check_object_permissions(request, comment)
        
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class FeedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        following_ids = Follow.objects.filter(
            follower=request.user
        ).values_list("following_id", flat=True)

        posts = Post.objects.filter(
            author__id__in=list(following_ids) + [request.user.id]
        ).prefetch_related(
            "images", "likes", "comments__replies"
        ).order_by("-created_at")

        serializer = PostSerializer(posts, many=True, context={"request": request})
        return Response(serializer.data)
    
class UserPostListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, username):
        posts = Post.objects.filter(author__username=username
        ).prefetch_related(
            "images", "likes", "comments__replies"
        ).order_by("-created_at")
        
        serializer = PostSerializer(
            posts, many = True,
            context = {"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)