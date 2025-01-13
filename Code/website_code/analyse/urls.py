from django.urls import path
from .views      import analyse_page



urlpatterns = [
    path('', analyse_page, name='analyse'),
]