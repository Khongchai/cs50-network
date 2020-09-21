
from django.urls import path

from network import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create_post", views.create_post, name="create_post"),
    path("fetch_posts", views.fetch_posts, name="fetch_posts"),
    path("increment_likes", views.increment_likes, name="increment_likes"),
    path("show_followed", views.show_followed, name="show_followed"),
    path("show_followed_users", views.show_followed_users, name="show_followed_users"),
    path("follow_user", views.follow_user, name="follow_user")
]
