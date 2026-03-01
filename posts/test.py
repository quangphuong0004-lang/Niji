from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Post, PostLike, Comment

User = get_user_model()


class PostTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()

        # Tạo 2 user để test
        self.user1 = User.objects.create_user(
            username="user1",
            password="pass123456",
            email="user1@test.com"
        )
        self.user2 = User.objects.create_user(
            username="user2",
            password="pass123456",
            email="user2@test.com"
        )

        self.client.force_authenticate(user=self.user1)

        self.post = Post.objects.create(
            author=self.user1,
            content="Test post content"
        )



# TEST: TẠO BÀI VIẾT
class TestCreatePost(PostTestCase):

    def test_create_post_success(self):
        response = self.client.post("/api/posts/create/", {
            "content": "Hello NIJI!"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["content"], "Hello NIJI!")
        self.assertEqual(Post.objects.count(), 2)  # 1 có sẵn + 1 vừa tạo

    def test_create_post_empty_content(self):
        """Không được tạo post rỗng"""
        response = self.client.post("/api/posts/create/", {
            "content": ""
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_post_unauthenticated(self):
        """Chưa đăng nhập thì không tạo được post"""
        self.client.force_authenticate(user=None)  # logout
        response = self.client.post("/api/posts/create/", {
            "content": "Test"
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

# TEST: XEM BÀI VIẾT
class TestGetPost(PostTestCase):

    def test_get_all_posts(self):
        """Lấy danh sách tất cả posts"""
        response = self.client.get("/api/posts/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_post_detail(self):
        """Lấy chi tiết 1 post theo id"""
        response = self.client.get(f"/api/posts/{self.post.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "Test post content")

    def test_get_post_not_found(self):
        """Post không tồn tại trả về 404"""
        response = self.client.get("/api/posts/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


# TEST: SỬA / XÓA BÀI VIẾT
class TestUpdateDeletePost(PostTestCase):

    def test_update_post_by_owner(self):
        """Chủ post sửa được"""
        response = self.client.put(f"/api/posts/{self.post.id}/update/", {
            "content": "Updated content"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.post.refresh_from_db()
        self.assertEqual(self.post.content, "Updated content")

    def test_update_post_by_other_user(self):
        """User khác không sửa được post của người khác"""
        self.client.force_authenticate(user=self.user2)
        response = self.client.put(f"/api/posts/{self.post.id}/update/", {
            "content": "Hacked!"
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_post_by_owner(self):
        """Chủ post xóa được"""
        response = self.client.delete(f"/api/posts/{self.post.id}/delete/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 0)

    def test_delete_post_by_other_user(self):
        """User khác không xóa được"""
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(f"/api/posts/{self.post.id}/delete/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

# TEST: LIKE
class TestLikePost(PostTestCase):

    def test_like_post(self):
        """Like bài viết thành công"""
        response = self.client.post(f"/api/posts/{self.post.id}/like/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["liked"])
        self.assertEqual(response.data["likes_count"], 1)

    def test_unlike_post(self):
        """Like lần 2 = unlike"""
        self.client.post(f"/api/posts/{self.post.id}/like/")  # like
        response = self.client.post(f"/api/posts/{self.post.id}/like/")  # unlike
        self.assertFalse(response.data["liked"])
        self.assertEqual(response.data["likes_count"], 0)

    def test_like_count_accurate(self):
        """Đếm số like chính xác khi nhiều user like"""
        self.client.post(f"/api/posts/{self.post.id}/like/")  # user1 like
        self.client.force_authenticate(user=self.user2)
        self.client.post(f"/api/posts/{self.post.id}/like/")  # user2 like
        self.assertEqual(PostLike.objects.filter(post=self.post).count(), 2)


# TEST: COMMENT
class TestComment(PostTestCase):

    def test_add_comment(self):
        """Thêm comment thành công"""
        response = self.client.post(f"/api/posts/{self.post.id}/comment/", {
            "content": "Nice post!"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["content"], "Nice post!")

    def test_add_empty_comment(self):
        """Không comment rỗng"""
        response = self.client.post(f"/api/posts/{self.post.id}/comment/", {
            "content": ""
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reply_to_comment(self):
        """Reply vào comment"""
        comment = Comment.objects.create(
            user=self.user1,
            post=self.post,
            content="Parent comment"
        )
        response = self.client.post(f"/api/posts/{self.post.id}/comment/", {
            "content": "This is a reply",
            "parent": comment.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["content"], "This is a reply")

    def test_delete_comment_by_owner(self):
        comment = Comment.objects.create(
            user=self.user1,
            post=self.post,
            content="To be deleted"
        )
        response = self.client.delete(f"/api/posts/comment/{comment.id}/delete/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_comment_by_other_user(self):
        """User khác không xóa được comment"""
        comment = Comment.objects.create(
            user=self.user1,
            post=self.post,
            content="Protected comment"
        )
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(f"/api/posts/comment/{comment.id}/delete/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)