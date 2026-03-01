from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_avatar   = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'sender_username', 'sender_avatar', 'notif_type', 'post_id', 'is_read', 'created_at']

    def get_sender_avatar(self, obj):
        request = self.context.get('request')
        if obj.sender.avatar and request:
            return request.build_absolute_uri(obj.sender.avatar.url)
        return None