//este archvuo es para los eventos que tenga que ejecutar el proceso de renderizado

/* import { ipcRenderer } from "electron"; */
const ipcRenderer =  require('electron').ipcRenderer;



function setDirectory() {
    console.log('cargo la funcion');
    ipcRenderer.on('load-images',(event, images)=>{
        if (images == null || images ==0) {
            console.log('No se encuentran imagenes dentro de la carpeta');
        }else{
            console.log(images);
            clearImages();  //limpiar las antiguas imagenes
            let i = 0;
            const nodoMain = document.querySelector('.list-group');
            while (i< images.length) {
                nodoMain.innerHTML += loadImages(images[i]);
                i++;
            }
        }
    })
}

function clearImages() {
    const oldImages = document.querySelectorAll('li.list-group-item');
    console.log(oldImages);
    for (let i = 0; i < oldImages; i++) {
        oldImages[i].parentNode.removeChild(oldImages[i]);
    }
}

function loadImages(images) {
    const template = `
    <li class="list-group-item">
        <img class="media-object pull-left" src="${images.source}" height="34">
        <div class="media-body">
            <strong>${images.filename}</strong>
            <p>${images.size}</p>
        </div>
    </li>`;
    return template;
}

function abrirDirectorio() {
    ipcRenderer.send('open-directory');
}



//configurar los eventos en el lado de renderizado
function setIpc() {
    //excuchar en el lado del proceso de renderizado
    //evento pong que recibe desde el main
    ipcRenderer.on('pong',(event,arg)=>{
        console.log(`pong recibido ${arg}`);
    })
}

function sendIpc() {
    //ENVIO UN OBJETO DATE
    ipcRenderer.send('ping', new Date());
}


/* export default setIpc ;*/
export {setIpc, sendIpc , abrirDirectorio, setDirectory}  //para exportar funciones como modulos
