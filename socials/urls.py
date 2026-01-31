from django.urls import path
from .views import UserSearchView, FollowUserView, UnfollowUserView, FollowingListView, FollowersListView

urlpatterns = [
    path('search/', UserSearchView.as_view()),
    
    path('follow/<int:user_id>/', FollowUserView.as_view()),
    path('unfollow/<int:user_id>/', UnfollowUserView.as_view()),
    path("following/<str:username>/", FollowingListView.as_view()),
    path('followers/<str:username>/', FollowersListView.as_view()),
]
