$(function() {
  if (!onAnyOfPages({'pages': ['landing']})) return;

  $('body').mousemove(function(e){
    var x = -(e.pageX + this.offsetLeft);
    var y = -(e.pageY + this.offsetTop);
    x += window.innerWidth / 2;
    y += window.innerHeight / 2;
    x /= 50;
    y /= 50;
    $('#backing-image').css('background-position', x + 'px ' + y + 'px');
  });
});
