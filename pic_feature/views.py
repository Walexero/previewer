from email.mime import image
import numbers
from re import I
from wsgiref import validate
from django.contrib import messages
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from pickletools import optimize
from django.shortcuts import render,redirect
from .models import imageUpload
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
from .context_env import img_res,accept_ext,image_size_limit,image_upload_amount
import magic
# Create your views here.

def home(request):
   if request.method == 'POST':
      images = request.FILES.getlist('files')
      image_sort = request.POST.getlist('filesort')
      adi = []
      
      # split the images to be deleted name to a list
      if len(image_sort[0]) == 0:
         if len(images) <= image_upload_amount:
            memory_upload = []
            for x in range(len(images)):
               img = images[x]
               # image upload input validator for extension and image size
               if img.name.split('.')[1] in accept_ext and img.size <= image_size_limit:
                  im = Image.open(img)
                  im_io = BytesIO()
                  if im.mode != 'RGB':
                     im = im.convert('RGB')
                  im = im.resize(img_res)
                  im.save(im_io, format= 'JPEG', optimize=True, quality=50)
                  memory_upload.append(InMemoryUploadedFile(im_io, None, img.name, 'image/jpeg', im_io.tell(), None ))
            for items in memory_upload:
               parser = imageUpload.objects.create(uploadImg = items)
            parser.save()
            return redirect('test')
         else:
            messages.error(request,f'Only 5mb maximum of images can be Uploaded for each. Image extension must be acceptable and Only a maximum of {image_upload_amount} images can be Uploaded')
         
                
      elif len(image_sort[0]) > 1:
         for x in image_sort:
            adi = x.split(",")
         images = [image for image in images if image.name not in adi]
         # Check if the image is not empty
         if len(images) == 0:
            messages.error(request,'Retry Upload')
         else:
         # # run if the image amount is not more than 10
            if len(images) <= image_upload_amount:
            #    #compress the image before save
               memory_upload = []
               for x in range(len(images)):
                  img = images[x]
                  im = Image.open(img)
                  im_io = BytesIO()
                  if im.mode != 'RGB':
                     im = im.convert('RGB')
                  im = im.resize(img_res)
                  im.save(im_io, format= 'JPEG', optimize=True, quality=50)
                  memory_upload.append(InMemoryUploadedFile(im_io, None, img.name, 'image/jpeg', im_io.tell(), None ))
               for items in memory_upload:
                  parser = imageUpload.objects.create(uploadImg = items)
               parser.save()
               return redirect('test')
            else:
               messages.error(request,f'Only 5mb maximum of images can be Uploaded for each. Image extension must be acceptable and Only a maximum of {image_upload_amount} images can be Uploaded')

   context = {
   }
   return render(request, 'pic_upload.html',context)

def test(request):
   seer = imageUpload.objects.all()
   return render(request, 'test.html', {'seer':seer})