function applyFilter(filtro, currentImage ){

    let imgObj = new Image();
    imgObj.src = currentImage.src;
    
    filterous.importImage(imgObj, {}) // eslint-disable-line
    .applyInstaFilter(filtro)
    .renderHtml(currentImage);
}

export default applyFilter;