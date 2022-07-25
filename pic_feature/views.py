import numbers
from django.shortcuts import render
from .models import imageUpload

# Create your views here.

def home(request):
   if request.method == 'POST':
      images = request.FILES.getlist('files')
      image_sort = request.POST.getlist('filesort')
      adi = []
      # split the images to be deleted name to a list
      if image_sort[0] != '':
         for x in image_sort:
            adi = x.split(",")
      # use the list to delete from the images
         for i in images:
            for k in range(len(adi)):
               if i.name in adi[k]:
                  del images[images.index(i)]


   context = {
    # 'form':form,
    }
   return render(request, 'pic_upload.html',context)

def test(request):
   return render(request, 'test.html')