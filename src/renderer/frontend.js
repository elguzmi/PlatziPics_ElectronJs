const url = require('url');
const os = require('os');
const path = require('path');
const { link } = require('fs');
import applyFilter from './filters.js'; 
//import de ipc renderer events 
import  { setIpc, sendIpc , abrirDirectorio , setDirectory}  from  './ipcRendererEvents.js';



window.addEventListener('load',()=>{
    //configura el evento pong
    /* setIpc();  */  //se ejecuta la funcion para escuchar al pong
    setDirectory();
    addImagesEvent();
    searchImagesEvent();
    changeImage('undefined');
    selectEvent();
    /* openDirectory(); */
    ButtonEvent('openDirectory' , abrirDirectorio);
});

function ButtonEvent(id, func){
    const directory =  document.getElementById(id);
    directory.addEventListener('click', func )
}


function openDirectory() {
    const directory = document.getElementById('openDirectory');
    directory.addEventListener('click', ()=>{
        sendIpc(); //ejecutar la funcion
    })
}

const addImagesEvent = ()=>{
    const thumbs = document.querySelectorAll('li.list-group-item');

    //le agrego le selected a la primera imagen
    
    for(let i = 0; i< thumbs.length; i++){
        thumbs[i].addEventListener('click',()=>{
            changeImage(thumbs[i]);
        })
    }
}

function selectEvent() {
    const select = document.getElementById('filters');

    select.addEventListener('change', (event)=>{
        applyFilter(event.target.value, document.getElementById('image-displayed'));
    });
}

function changeImage(node) {
    try{
        document.querySelector('li.selected').classList.remove('selected');
    }catch(e){
        console.log('No hay ningun elemento li');
    }
    if (node != 'undefined' && node != null) {
        node.classList.add('selected');
        document.querySelector('#image-displayed').src = node.querySelector('img').src;
    }else{
        document.querySelector('#image-displayed').alt = 'No has seleccionado ninguna imagen'
        document.querySelector('#image-displayed').src = '';
    } 
}



//evento de buscar imagen
function searchImagesEvent() {
    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('keyup',(event)=>{
        const regex = new RegExp(event.target.value.toLowerCase(), 'gi' )
        if (event.target.value.length > 0) {
            const thumbs = document.querySelectorAll('li.list-group-item img');
            /* console.log(os.cpus()); */
            for (let i = 0; i < thumbs.length; i++) {
                //lo que hace url parse es convertir el src tipo file en un pathname
                let fileUrl = url.parse(thumbs[i].src);  
                let fileName = path.basename(fileUrl.pathname);  //debe devolver el nombre del archivo     
                if (fileName.match(regex)) {
                    thumbs[i].parentNode.classList.remove('hidden')
                }else{
                    thumbs[i].parentNode.classList.add('hidden');
                }
            }
            selectFirtsImage();
        }else{
            const thumbs = document.querySelectorAll('li.list-group-item img');
            for (let i = 0; i < thumbs.length; i++) {
                thumbs[i].parentNode.classList.remove('hidden');
            }
        }
    })
}

//metodo que seleccion la primera imagen que no tiene la clase hidden
function selectFirtsImage() {
    const image = document.querySelector('li.list-group-item:not(.hidden)');
    changeImage(image);
}


//metodo para saber si un elemento tiene una clase especifica
function hasClass(element, className) {
    return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
}

