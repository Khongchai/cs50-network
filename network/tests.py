from django.test import TestCase, Client
from network.models import *


# Create your tests here.
class NetworkTestCase(TestCase):

    def setUp(self):

        #These are just setting up the database; variables for these will have to be created later.
        Khong = User.objects.create(is_superuser=True, first_name="Khongchai", last_name="Greesuradej", email="Khong@khong.com", password="Khong", username="Khong")
        Iris = User.objects.create(is_superuser=False, first_name="Natawan", last_name="Meechai", email="Iris@iris.com", password="Iris", username="Iris")

        khong_post_1 = Post.objects.create(postHeader="Hey!", postBody="How are you doing today?", postedBy=Khong, likes=0)
        khong_post_2 = Post.objects.create(postHeader="Hey again!", postBody="Wie geht es dir?", postedBy=Khong, likes=1)
        iris_post_1 = Post.objects.create(postHeader="I love UX/UI!", postBody="I was so inspired by this talk we had today.", postedBy=Iris, likes=1)
        iris_post_2 = Post.objects.create(postHeader="That moment..", postBody="That moment when you farted in front of your teacher.", postedBy=Iris, likes=0)

        comment_on_khong = Comment.objects.create(commentBody="Hey, I'm good, thanks for checking!", commentedOn=khong_post_1, commentedBy=Iris)
        comment_on_iris = Comment.objects.create(commentBody="You don't play violin anymore? Sick!", commentedOn=iris_post_1, commentedBy=Khong)

    def test_post_count(self):
        Khong = User.objects.get(username="Khong")
        Iris = User.objects.get(username="Iris")
        self.assertEqual(Khong.postsByThisUser.count(), 2)
        self.assertEqual(Iris.postsByThisUser.count(), 2)

    def test_index(self):
        c = Client()
        response = c.get("")
        self.assertEqual(response.status_code, 200)

    def test_incrementing_like(self):
        Khong = User.objects.get(username="Khong")
        iris_post2 = Post.objects.get(postHeader="That moment..")
        iris_post2.likedBy.add(Khong)
        initial_likes = iris_post2.likes
        iris_post2.likes += 1

        self.assertEqual(initial_likes + 1, iris_post2.likes)
        self.assertEqual(Khong, iris_post2.likedBy.first())


        


