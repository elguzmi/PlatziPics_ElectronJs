'use strict'
//aqui corre el proceso principal

//el objeto app permite controla el ciclo de vida del aplicativo y diferentes elementos en si
//instanciamos el ojeto de app y browserWindow
const { app, BrowserWindow, ipcMain , dialog} = require('electron');
const fs = require('fs');
const isImage = require('is-image');
const filesize = require('filesize'); //modulo para veriguar el tamaño de la imagen
const path = require('path'); //modulo que se utiliza parsa que devuelva la ruta de la imagen


/* console.dir(app);  muestra que funciones y propiedades tiene el objeto app */

//va  a escuchar por el evento before-quit , es decir antes de cerrar la plicacion de sa a ejecutar
app.on('before-quit' , ()=>{
    console.log('Saliendo..');
})
let win;

//evento ready
app.on('ready',()=>{
    //creando una ventana, el objeto browser window permite crear una ventana
    win = new BrowserWindow({
        webPreferences:{
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true},
        width: 1024,
        height: 768,
        maxHeight: 768,
        maxWidth:1080,
        'title': 'Hola mundo',
        center:true,
        maximizable: false,  //no deja maximizar
        show:false  //ocultar la ventana
    });
    win.on('move', ()=>{
        //hay varias funciones de la ventana
        const position = win.getPosition();
        /* console.log('la posicion de la pantalla es:' +position); */
    })

    //en once solamente una vez
    win.once('ready-to-show',()=>{
        win.show(); //muestra la ventana actual
    })

    win.on('closed',()=>{
        win=null;
        app.quit();
    });

    //cargar url externas y volverlas un aplicativo de escritorio
    /* win.loadURL('https://elguzmi.github.io/RickAndMortyApi/'); */

    //ahora va a cargar una url local
    win.loadURL(`file://${__dirname}/renderer/index.html`);
    console.log('el directorio es:'+__dirname);

})



//ipcMain es el objeto que escucha y envia eventos desde el lado principal
//escucha el evento ping del cliente y envia un argumento
ipcMain.on('ping', (event,arg)=>{
    console.log(`se recibio ping - ${arg}`);

    //cuando el evento se haya ejecutad se utiliza el objeto event.sender.send
    //el evento que vamos a enviar se llama pong
    event.sender.send('pong', new Date());
})


//escucha el evento open directory
ipcMain.on('open-directory',(event)=>{
    //abrir un proceso de tipo dialogo desde el mainprocess
    dialog.showOpenDialog(win, {
        title: 'Seleccione la nueva ubicacion',
        buttonLabel: 'Abrir ubicación',
        properties: ['openDirectory']
    }) //funciona como una promesa
        .then(result =>{
            let images = [];
            if (result.canceled != true) {
                console.log(result.filePaths.toString());
                try{
                    fs.readdir(result.filePaths.toString(), (err, files)=>{
                        console.log(files); //me manda un array con la lista de archivos
                        let i=0;
                        while (i < files.length){
                            if(isImage(files[i])) {  //filtrar imagenes se utiliza el modulo isImage devuelve true si al extension es imagen
                                let imageFile = path.join(result.filePaths.toString(), files[i]);
                              let stats = fs.statSync(imageFile);  //stats son la informacion del archivo como el tamaño etc..
                                /* console.log(stats); informacion del archivo*/
                                let size = filesize(stats.size, {round: 0});
                                //agregamos un objeto por cada elemento que contiene : nombre de archivo, ruta directa, y tamaño
                                images.push({filename:files[i], source: `file://${imageFile}`, size: size});  //nombre de archivo, ruta y tamaño  
                            }
                            i++;
                        }
                        event.sender.send('load-images', images);
                    })
                }catch (err){
                    console.error(err);
                    event.sender.send('load-images', null);
                }
            }else{
                console.log('cancelado');
            }
            //envio el evento al renderer el arreglo images
            console.log('las imagenes son: '+images);
            
        }).catch(err =>{
            console.log(err);
        })
})

//cerrar el aplicativo
/* app.quit() */