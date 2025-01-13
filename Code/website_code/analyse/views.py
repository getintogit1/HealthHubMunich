from django.shortcuts import render

def analyse_page(request):
    return render (request, "pages/analyse_page.html")
