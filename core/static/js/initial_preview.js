const genConfirmer = document.querySelector('#formHolder')
const imgUpload = document.querySelector('#fileUpload');
const previewer = document.querySelector('#upload_row');
const delUpload = document.querySelector('#delUpload');
const submit = document.querySelector('#submit');
const previewConfirm = document.querySelector('#confirmer');
const confirmLabel = document.querySelector('#confirmerLabel');
const confirmCont = document.querySelector('#confirm');
const hide = document.querySelectorAll('.hidden');


  const preview = {

    genMarkup(pic, id){
      return `
        <div class="col-sm-3" id="uploaded_files" data-id="${id}">
            <img src="${pic}">
        </div>
        `
    },

    genDelButton(number){
      return `
        <button id="previewDelete" class="btn btn-secondary">Delete</button>
        `
    },

    genConfirmMarkup(){

    },

    uploadFileRead(file){
      const reader = new FileReader();
      reader.addEventListener('load', (e) =>{
          const result = e.target.result
      })
      reader.addEventListener('progress', (e)=> {
          if (e.loaded && e.total){
              const percent = (e.loaded / e.total) * 100;
              const percent_render = document.querySelector('#readPreview').querySelector('.read_value');
              percent_render.innerText = `${percent == 100 ? 'Completed' : 'Loading'}: ${Math.round(percent)}`
          }
      });
      reader.readAsDataURL(file)
    },

    previewImg(){
      imgUpload.addEventListener('change', (e) => {
        //hide the Upload button
        submit.style.display = "none";
        //Image preview code
        let urls = []
        if (event.target.files) {    
            src_list = event.target.files
            //Guard to protect single image render
            if(src_list.length == 1)
              previewer.innerHTML = '';
            if(src_list.length > 0)
              previewer.innerHTML = '';
            const output = Object.keys(src_list).forEach(function(value){
              
              urls = URL.createObjectURL(src_list[value])
              preview.uploadFileRead(src_list[value])
              hide.forEach(mov => mov.classList.remove('hidden'));
              previewer.insertAdjacentHTML('beforeend', preview.genMarkup(urls, Number(value)))
              const fitter = document.querySelectorAll('img')
              fitter.forEach(value => {
                value.style.width = '100%';
                //This frees up memory from using blobs
                value.onload = (e)=>{
                  URL.revokeObjectURL(e.src)
                }
              })
            })
            // For deleting preview image
            picker = document.querySelectorAll('#uploaded_files');

            picker.forEach((img_cont,id) => {
              img_cont.insertAdjacentHTML('beforeend',preview.genDelButton(id))
            });   
            //Deleting the Preview Image
            const preview_deleter = document.querySelectorAll('button');
            //Rendering Confirm preview checkbox
            preview.previewDelete(preview_deleter);
            preview.sendDelData();
          }  
      })
    },

    previewDelete(previewButton){
      previewButton.forEach(delButton => {
        delButton.addEventListener('click', (e) => {
          const delButton_node = e.target.closest('#uploaded_files');
          preview.getDelData.push(delButton_node.dataset.id)
          const delButton_img = delButton_node.querySelector('img')
          // delete the preview image selected
          previewer.removeChild(delButton_node)
          //Unhide the 'hidden' classes || hide it
          if(previewer.children.length > 0)
            hide.forEach(mov => mov.classList.remove('hidden'));
          if(previewer.children.length == 0)
            hide.forEach(mov => mov.classList.add('hidden'));
        })
      })
    },

    getDelData : [],

    delData : [],

    sendDelData(){
      previewConfirm.addEventListener('click', () => {
        //Use getDelData to get delete file image name
        preview.getDelData.forEach((del,i) => preview.delData[i] = src_list[del].name);
        delUpload.value = preview.delData;
        submit.style.display = 'block';
        delHide = document.querySelectorAll('#previewDelete')
        delHide.forEach(mov => mov.style.display = 'none');
        hide.forEach(mov => mov.classList.add('hidden'));
      })
    }
  }

  window.onload = preview;
  preview.previewImg();


