'use strict'

//el objeto app permite controla el ciclo de vida del aplicativo y diferentes elementos en si
//instanciamos el ojeto de app y browserWindow
const { app, BrowserWindow } = require('electron');


/* console.dir(app);  muestra que funciones y propiedades tiene el objeto app */

//va  a escuchar por el evento before-quit , es decir antes de cerrar la plicacion de sa a ejecutar
app.on('before-quit' , ()=>{
    console.log('Saliendo..');
})

//evento ready
app.on('ready',()=>{
    //creando una ventana, el objeto browser window permite crear una ventana
    let win = new BrowserWindow({
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

//cerrar el aplicativo
/* app.quit() */