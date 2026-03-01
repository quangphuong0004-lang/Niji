from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from posts.models import PostLike, Comment
from socials.models import Follow
from .models import Notification

channel_layer = get_channel_layer()

def _push_ws(notification):
    """Gửi thông báo qua WebSocket tới người nhận."""
    sender = notification.sender
    avatar_url = None
    if sender.avatar:
        avatar_url = sender.avatar.url  # relative URL, frontend tự ghép base

    async_to_sync(channel_layer.group_send)(
        f"notif_{notification.recipient.id}",
        {
            "type": "send_notification",
            "data": {
                "id":              notification.id,
                "notif_type":      notification.notif_type,
                "sender_username": sender.username,
                "sender_avatar":   avatar_url,
                "post_id":         notification.post_id,
                "is_read":         notification.is_read,
                "created_at":      str(notification.created_at),
            }
        }
    )

# ── LIKE ──────────────────────────────────────────────
@receiver(post_save, sender=PostLike)
def on_like(sender, instance, created, **kwargs):
    if not created:
        return
    if instance.user == instance.post.author:  
        return
    notif = Notification.objects.create(
        recipient=instance.post.author,
        sender=instance.user,
        notif_type='like',
        post=instance.post,
    )
    _push_ws(notif)

# ── COMMENT ───────────────────────────────────────────
@receiver(post_save, sender=Comment)
def on_comment(sender, instance, created, **kwargs):
    if not created:
        return
    if instance.user == instance.post.author:
        return
    notif = Notification.objects.create(
        recipient=instance.post.author,
        sender=instance.user,
        notif_type='comment',
        post=instance.post,
    )
    _push_ws(notif)

# ── FOLLOW ────────────────────────────────────────────
@receiver(post_save, sender=Follow)
def on_follow(sender, instance, created, **kwargs):
    if not created:
        return
    notif = Notification.objects.create(
        recipient=instance.following,  # chỉnh lại nếu field tên khác
        sender=instance.follower,
        notif_type='follow',
    )
    _push_ws(notif)