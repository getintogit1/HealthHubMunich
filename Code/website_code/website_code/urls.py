"""
URL configuration for healthhub project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


from pages.views import homepage,  explore_page, health_information_page, impressum_page_view, datenschutz_page_view, kontakt_page_view, über_page_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', homepage, name = 'homepage'),
    path('analyse/', include('analyse.urls')),
    #path("analyse/",analyse_page, name="analyse"),
    path("explore/",explore_page, name="explore"),
    path("health-information/",health_information_page, name="health-information"),
    path("datenschutz/",datenschutz_page_view, name="datenschutz"),
    path("impressum/",impressum_page_view, name="impressum"),
    path("kontakt/",kontakt_page_view, name="kontakt"),
    path("über/",über_page_view, name="über"),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)



    