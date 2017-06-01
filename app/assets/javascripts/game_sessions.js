window.onload = function() {

    let dragging = false,
        uiScale = 1,
        offsetX = 0,
        offsetY = 0,
        movementX = 0,
        movementY = 0;

    function scaleBoard() {
        document.querySelector(".board").setAttribute("style", "transform: scale(" + uiScale + ") translateX(" + offsetX + "px) translateY(" + offsetY + "px)");
    }
        
    document.querySelector('.zoom-in').addEventListener("mousedown", function() {
       uiScale += 0.05;
       scaleBoard();
    });
    
    document.querySelector('.zoom-out').addEventListener("mousedown", function() {
       uiScale -= 0.05;
       scaleBoard();
    });
    
    document.querySelector('.board').addEventListener("mousedown", function(e) {
        e.preventDefault();
        e.stopPropagation();
        movementX = 0;
        movementY = 0;
        console.log("Movements set to 0.");
        dragging = true;
    });
    
    document.querySelector('.board').addEventListener("mouseup", function(e) {
        e.preventDefault();
        e.stopPropagation();
        dragging = false;
    });
    
    document.querySelector('.board').addEventListener("mousemove", function(e) {
        e.preventDefault();
        e.stopPropagation();
        offsetX = (offsetX + movementX < 0) ? offsetX + movementX : 0;
        offsetY = (offsetY + movementY < 0) ? offsetY + movementY : 0;
        if (dragging) {
            document.querySelector(".board").setAttribute("style", "transform: scale(" + uiScale + ") translateX(" + offsetX + "px) translateY(" + offsetY + "px)");
        movementX = e.movementX;
        movementY = e.movementY;
        console.log("Movements changed.");}
    });
};