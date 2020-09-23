from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.core import serializers
import json

from network.models import *


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match.",
                "prevUserName": username,
                "prevEmail": email
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def create_post(request):
    if not request.user.is_authenticated:
        return HttpResponse("Client Validation Error")
    if request.method == "POST":
        postHeader = request.POST["header"]
        postBody = request.POST["postBody"]

        if postHeader == "" or postBody == "":
            return HttpResponse("Post-empty error")

        postedBy = User.objects.get(pk=request.user.id)
        newPost = Post.objects.create(postBody=postBody, postHeader=postHeader, postedBy=postedBy)
        newPost.save()

    return HttpResponseRedirect(reverse("index"))
    

#loading posts should be managed here only
def fetch_posts(request):

    start = int(request.GET.get("start")) 
    end = int(request.GET.get("end"))
    page_name = request.GET.get("page")
    posters = []
    users_followed_id = []
    currentUser = request.user
    posts = []
    if page_name == "All Posts":
        posts = list(Post.objects.values().order_by("-postedOn"))[start:end]
    elif page_name == "Following":
        posts = list(request.user.likedPosts.values().order_by("-postedOn"))[start:end]
        #print(posts)
    else:
        followed_users = request.user.following.all()
        for poster in followed_users:
            posts_from_followed = list(poster.postsByThisUser.values().order_by("-postedOn"))[start:end]
            for post_from_followed in posts_from_followed:
                posts.append(post_from_followed)
            #Set posters here so we can skip the next part
            posters.append(str(poster))
         
    #only do this if "posters" is empty
    if not posters:
        for post in posts:
            poster = User.objects.get(pk=post["postedBy_id"])
            posters.append(str(poster))
            post["postedOn"] = post["postedOn"].strftime("%#d %b %Y, %#I:%M %p")

    for user_val in currentUser.following.values():
        users_followed_id.append(int(user_val["id"]))
    return JsonResponse({
        "posts": posts,
        "posters": posters,
        "usersFollowedID": users_followed_id
    }, status=200)

@csrf_exempt
def increment_likes(request):
    if request.method == "POST":
        post = Post.objects.get(pk=int(request.body))
        user = request.user
        #check if post is already liked by user

        if user.likedPosts.filter(pk=int(request.body)).exists():
            user.likedPosts.remove(post)
            post.likes -= 1
        else:
            user.likedPosts.add(post)
            post.likes += 1
        post.save()
        
        return JsonResponse({
            "newLikes": post.likes
        })
    else:
        return HttpResponse("Error 405: GET method not allowed")

@csrf_exempt
def follow_user(request):
    currentUser = request.user
    user_to_follow = User.objects.get(pk=int(request.body))
    if currentUser.following.filter(pk=int(request.body)).exists():
        currentUser.following.remove(user_to_follow)
    else:
        currentUser.following.add(user_to_follow)
    currentUser.save()
    return HttpResponse(status=204)

def show_followed(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))

    return render(request, "network/followed.html")
    
def show_followed_users(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))
    return render(request, "network/followed.html", {
        "users": "users"
    })

def user_info(request):
    post_id = request.GET.get("postID")
    post = Post.objects.get(pk=post_id)
    return JsonResponse(post.serialize())

def add_comment(request):
    if request.method == "POST":
        data = json.loads(request.body)
        new_comment = data["newComment"]
        post = Post.objects.get(pk=int(data["postID"]))
        user = request.user
        #TODO add new comment to database then append the comment with js
        
   
