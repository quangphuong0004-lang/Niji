from django.urls import path
from .views import MarkOneReadView, NotificationListView, MarkAllReadView

urlpatterns = [
    path('', NotificationListView.as_view()),
    path('read/', MarkAllReadView.as_view()),
    path('<int:pk>/read/', MarkOneReadView.as_view()),
]