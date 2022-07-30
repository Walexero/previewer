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
      
      if images:
         # to verify image upload not greater than required size
         if len(images) == 0:
            messages.error('Nothing to Upload')
         if len(images) <= image_upload_amount:
            size_limit = []
            img_ext_verify = []
            # to validate all images before compression
            for x in range(len(images)):
               img =  images[x]
               if img.size > image_size_limit:
                  size_limit.append(img)
               if img.name.split('.')[1] not in accept_ext:
                  img_ext_verify.append(img)
            # to compress images if valid
            if len(size_limit) == 0 and len(img_ext_verify) == 0:
                if len(image_sort[0]) > 0:
                    for x in image_sort:
                        adi = x.split(",")
                    images = [image for image in images if image.name not in adi]

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

            elif len(size_limit) > 0 or len(img_ext_verify) > 0:
               messages.error(request,f'Only 5mb maximum of images can be Uploaded for each. Image extension must be acceptable and Only a maximum of {image_upload_amount} images can be Uploaded')
         else: 
            messages.error(request,f'Only 5mb maximum of images can be Uploaded for each. Image extension must be acceptable and Only a maximum of {image_upload_amount} images can be Uploaded')

   context = {
   }
   return render(request, 'pic_upload.html',context)
