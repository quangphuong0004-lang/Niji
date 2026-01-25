from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)
from .views import RegisterView, MyProfileView, UserProfileView, UpdateProfileView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),  
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('me/', MyProfileView.as_view(), name='my-profile'),
    path('me/update/', UpdateProfileView.as_view(), name='my-profile-update'),
    path('<str:username>/', UserProfileView.as_view(), name='user-profile'),
]
