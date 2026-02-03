from django.urls import path
from .views import (PostCreateView, PostListView, PostUpdateView, PostDeleteView, 
                    PostLikeView, CommentCreateView, CommentDeleteView, FeedView, 
                    PostDetailView, UserPostListView)


urlpatterns = [
    path('', PostListView.as_view()),
    path('create/', PostCreateView.as_view()),
    path('<int:pk>/', PostDetailView.as_view()), 
    path('<int:pk>/update/', PostUpdateView.as_view()),
    path('<int:pk>/delete/', PostDeleteView.as_view()),
    path('<int:pk>/like/', PostLikeView.as_view()),
    path('<int:pk>/comment/', CommentCreateView.as_view()),
    path('comment/<int:pk>/delete/', CommentDeleteView.as_view()),
    path('feed/', FeedView.as_view()),
    path('user/<str:username>/', UserPostListView.as_view()),
]
