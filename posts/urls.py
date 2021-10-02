from django.urls import path
from . import views

app_name = "posts"
urlpatterns = [
    path("", views.post_list_and_create_view, name="main-board"),
    path("json/", views.hello_world_view, name="json"),
    path("data/<int:num_posts>/", views.load_post, name="load-data"),
    path("like-unlike/", views.like_unlike_view, name="like-unlike")
]
