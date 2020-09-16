from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, related_name="followers")


class Like(models.Model):
    likedBy = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="likesByThisUser")
    likedOn = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="likesOnThisPost")



class Post(models.Model):
    postHeader = models.CharField(max_length=64, default="Enter Post Header")
    postBody = models.TextField(default="Enter Post Message")
    postedBy = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="postsByThisUser")
    postedOn = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return f"{self.postHeader} by {self.postedBy}"



class Comment(models.Model):
    commentBody = models.TextField()
    commentedOn = models.ForeignKey(Post, on_delete=models.CASCADE,related_name="commentsOnThisPost")
    commentedBy = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="commentsByThisUser")

