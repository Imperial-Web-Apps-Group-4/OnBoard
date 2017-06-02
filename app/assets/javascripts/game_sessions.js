/*
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

    function scaleBoard() {
        document.querySelector(".board").setAttribute("style", "transform: scale(" + uiScale + ") translateX(" + offsetX + "px) translateY(" + offsetY + "px)");
    };

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
*/

interact('.comp-drag') .draggable({
  restrict: {
     restriction: "parent",
     endOnly: true,
     elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
   },
   onmove: dragMoveListener
});

function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
