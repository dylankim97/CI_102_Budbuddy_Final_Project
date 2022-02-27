from django.urls import path, re_path
from . import views

from .views import ride_detail_view

urlpatterns = [
    path('', views.index, name='site-home'),
    path('map/', views.bus_map, name='map'),
    path('history/', ride_detail_view, name='ride-history'),
    path('signin/', views.sign_in, name='sign-in'),
    re_path(r'^user/create/$', views.create_object, name='website.views.create_user')
]
