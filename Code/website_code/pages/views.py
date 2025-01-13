from django.shortcuts   import render, redirect
from django.http        import JsonResponse


#NOTE: Kontakt View

from website_code.forms     import *                                            # import our contakt form for email backend , in "kontakt.html"
from django.core.mail       import send_mail, BadHeaderError                    # neccesary for backend emails endig handling
from django.http            import HttpResponse                                 



def homepage(request):
    return render(request, 'pages/homepage.html')


def explore_page(request):
    return render (request, "pages/explore_page.html")

def health_information_page(request):
    return render (request, "pages/health_information_page.html")


def kontakt_page_view(request):
	if request.method == 'POST':
		form = ContactForm(request.POST)
		if form.is_valid():                                                     # backend check valid form
			subject = "Website Inquiry" 
			body = {
			'first_name': form.cleaned_data['first_name'],                      # retrieve typed in input from user
			'last_name': form.cleaned_data['last_name'], 
			'email': form.cleaned_data['email_address'], 
			'message':form.cleaned_data['message'], 
			}
			message = "\n".join(body.values())

			try:
				send_mail(subject, message, 'admin@example.com', ['admin@example.com']) 
			except BadHeaderError:
				return HttpResponse('Invalid header found.')
			return redirect ("homepage")                                            # redirect to homepage after succesful sending
      
	form = ContactForm()
	return render(request, "pages/kontakt.html", {'form':form})                 #POST filled out contact form, render komtakt.html
    


def impressum_page_view(request):
    return render(request, "pages/impressum.html")


def datenschutz_page_view(request):
    return render(request, "pages/datenschutz.html")

def über_page_view(request):
    return render(request, "pages/über.html")