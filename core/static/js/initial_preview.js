const genConfirmer = document.querySelector('#formHolder')
const imgUpload = document.querySelector('#fileUpload');
const previewer = document.querySelector('#upload_row');
const delUpload = document.querySelector('#delUpload');
// const submit = document.querySelector('#submit');
// const previewConfirm = document.querySelector('#confirmer');
// const confirmLabel = document.querySelector('#confirmerLabel');
// const confirmCont = document.querySelector('#confirm');
// const hide = document.querySelectorAll('.hidden');
const alertMsg = document.querySelector('span')
const formInput = document.querySelector('#formInput')
const imageUploadAmount = 10;
const imageLimit = 5242880

// For the Image Upload Extension Validator
const uploadValidator = ['jpeg', 'jpg', 'png'];

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
      return `
        <div class="row" id="confirm">
            <label class="" id="confirmerLabel">Finished Preview</label>
            <input type="checkbox" class="" id="confirmer">
        </div>
      `
    },

    genSubmiter(){
      return`
      <input type="submit" value="Upload" id="submit" class="btn btn-success">
      `
    },

    genValidatorAlert(){
      return `
      Only 5mb maximum of images can be Uploaded for each. Image extension must be acceptable and Only a maximum of ${imageUploadAmount} images can be Uploaded
      `
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
        // submit.style.display = "none";
        let urls = []
        if (e.target.files) {    
          src_list = e.target.files
          //To validate image extension and raise alert if it doesn't pass it
          let uploadExt = []      
          let uploadSize = []      
          valid_ext = Object.keys(src_list).forEach((value)=>{
            uploadExt.push(src_list[value].name.split('.')[1])
            uploadSize.push(src_list[value].size)
          })
          uploadExt = [...new Set(uploadExt)]
          
          if (uploadExt.every(mov => { return uploadValidator.includes(mov)}) == true && src_list.length <= imageUploadAmount && uploadSize.every(mov => { return mov < imageLimit}) == true ){
          //   Guard to protect single and multiple image render
            if(src_list.length == 1 || src_list.length > 0)
              previewer.innerHTML = '';
            const output = Object.keys(src_list).forEach(function(value){
              urls = URL.createObjectURL(src_list[value])
              preview.uploadFileRead(src_list[value])
              previewer.insertAdjacentHTML('beforeend', preview.genMarkup(urls, Number(value)))
              const fitter = document.querySelectorAll('img')
              fitter.forEach(value => {
                value.onload = (e)=>{
                  URL.revokeObjectURL(e.src)
                  value.style.width = '100%';
                }
              })
            })

            //Generate the confirm option
            if(previewer.children.length > 0){
              genConfirmer.insertAdjacentHTML('afterend',preview.genConfirmMarkup())
              // Parsing Data before upload
              const previewConfirm = document.querySelector('#confirmer')
              preview.sendDelData(previewConfirm);
            }

            // For button for deleting preview image
            picker = document.querySelectorAll('#uploaded_files');
            picker.forEach((img_cont,id) => {
              img_cont.insertAdjacentHTML('beforeend',preview.genDelButton(id))
            });   
            // //Deleting the Preview Image
            const preview_deleter = document.querySelectorAll('button');
            preview.previewDelete(preview_deleter);
          }else{
            alertMsg.classList.add('alert-danger')
            alertMsg.innerText = preview.genValidatorAlert()
          }
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

          //remove the confirm option and the deleted datas
          if(previewer.children.length == 0){
            const confirmCont = document.querySelector('#confirm')
            confirmCont.remove()
            preview.getDelData = []
            imgUpload.value = '';
          }
        })
      })
    },

    getDelData : [],

    delData : [],

    sendDelData(previewConfirm /*optional*/){
      previewConfirm.addEventListener('click', () => {
        formInput.insertAdjacentHTML('beforeend', preview.genSubmiter())

        //Use getDelData to get delete file image name
        preview.getDelData.forEach((del,i) => preview.delData[i] = src_list[del].name);
        delUpload.value = preview.delData;

        // remove the confirmer
        const confirmCont = document.querySelector('#confirm')
        confirmCont.remove()
      })
    }
  }

  window.onload = preview;
  preview.previewImg();


