from django.shortcuts import render
from .models import Favorite_Ride
from django.http import HttpResponse

def ride_detail_view(request):
    objects = []

    for item in Favorite_Ride.objects.all():
        if item.username == request.user.username:
            objects.append(item)

    finalRes = ""
    quote = "Favorite stops for {}: ".format(request.user.username)

    for i in range(len(objects)):
        finalRes += objects[i].destination

        if i != len(objects) - 1:
            finalRes += ' | '


    context = {
        'object': finalRes
    }

    return render(request, "website/history.html", context)



def create_object(request):

    if request.method == 'POST':
        destination = request.POST['destination']

        Favorite_Ride.objects.create(
            destination=destination,
            username=request.user.username
        )

        return HttpResponse('')


def index(request):
    return render(request, 'website/index.html')


def history(request):
    return render(request, 'website/history.html')


def bus_map(request):
    return render(request, 'website/map.html')


def sign_in(request):
    return render(request, 'website/sign_in.html')


def destination(request):
    return render(request, 'website/map.html')
