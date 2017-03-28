var currentSlide = 0;
var maxSlide = 2;
var slideSize = 60;
var backupPositions = {
  slide1Up : 0,
  slide1Size : 0
};
$(document).ready(function (){
  /*
  *********************
  Background functions
  *********************
  */
  var currentBackground = '#intro-bg-1';
  var nextBackground = '#intro-bg-2';
  var imageArray = ['../images/2.jpeg','../images/3.jpeg','../images/4.jpeg','../images/1.jpeg'];
  var currentslidebg = 0;
  //Background timers
  var bg_rotation_timer = 5000;
  var bg_scale_timer = 6000;
  var bg_fade_timer = 400;
  var bg_fade_type = 'linear'
  var bg_starting_scale = 1.65;
  var bg_end_scale = 1.02;
  function checkBackground(){
    var img = $("<img />").attr('src', imageArray[currentslidebg]).on('load', function() {
      if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
        delete imageArray[currentslidebg]; //Remove bad picture from rotation
        backgroundTimer = setTimeout(checkBackground, bg_rotation_timer);
      } else {
        $(this).remove();
        $(currentBackground).css('z-index', 20);
        $(nextBackground).css('z-index',19);
        $(currentBackground).stop().animate({opacity:0}, bg_fade_timer);
        $(currentBackground).css({ transform: 'scale('+bg_starting_scale+')'});
        $(nextBackground).css('opacity',1);
        $(nextBackground).css('background-image',"url("+imageArray[currentslidebg]+")");
        $(nextBackground).css({ transform: 'scale('+bg_starting_scale+')'});
        $(nextBackground).transition({ scale: bg_end_scale , easing: bg_fade_type}, bg_scale_timer);
        currentslidebg++;
        var tempStr = currentBackground;
        currentBackground = nextBackground;
        nextBackground = tempStr;
        if(currentslidebg > imageArray.length-1) currentslidebg = 0;
        backgroundTimer = setTimeout(checkBackground, bg_rotation_timer);
      }
    });
  }
  //Start Background Timer
  $(currentBackground).css({ transform: 'scale('+bg_starting_scale+')'});
  $(currentBackground).transition({ scale: bg_end_scale, easing: bg_fade_type}, bg_scale_timer);
  var backgroundTimer = setTimeout(checkBackground, bg_rotation_timer);
  function clearBackground(){
    clearInterval(backgroundTimer);
  };
  //Calculate Division alterations
  CalculateDivChange();
  /*
  *********************
  Start Btn & PDF Btn Start Animation
  *********************
  */
  //After 1.8 Second flip in pdf button
  setTimeout(function (){
    //PDF
    var PDFWidth = $('#intro-div').height()/1.5;
    var PDFHeight = $('#intro-div').height()/1.5;
    backupPositions.slide1Up = $('#intro-div').offset().top + 35;
    backupPositions.slide1Size = $('#intro-div').height();
    $('#pdf-btn').width(PDFWidth).height(PDFHeight).offset({
      top:backupPositions.slide1Up,
      left:($('#intro-div').offset().left + ($('#intro-div').outerWidth()))
    });
    $('#pdf-btn').hover(function (){
      $(this).stop(true,true).transition({rotate: '10deg'});
    }, function (){
      $(this).transition({rotate: '-8deg'}).transition({rotate: '4deg'}).transition({rotate: '-2deg'}).transition({rotate: '0deg'});
    });
    $('#pdf-btn').click(function (){
      alert('push PDF');
    });
    $('#pdf-btn').transition({perspective:'100px', rotateY:'0deg'});
  }, 1000);
  //Allow Scroll event
  setTimeout(function (){
    $('html').on('mousewheel DOMMouseScroll', _.debounce(ChangeSlide, 100, true));
  }, 1500);
  /*
  *********************
  Resize Event
  *********************
  */
  $(window).resize(function (e){
    //when resize, correctly place start and pdf buttons.
    if(currentSlide > 0){
      $('#start-btn').offset({
        top:($('#intro-div').offset().top + $('#intro-div').outerHeight() + 20),
        left:($('#intro-div').offset().left + ($('#intro-div').outerWidth()/2) - ($('#start-btn').outerWidth()/2))
      });
    }
    $('#pdf-btn').offset({
      top:($('#intro-div').offset().top + 45),
      left:($('#intro-div').offset().left + ($('#intro-div').outerWidth()))
    });
  });
});

/*
*********************
Scroll Event
*********************
*/
//May need to change once for other devices...
function ChangeSlide(e){
  var delta = (e.originalEvent.wheelDelta || -e.originalEvent.detail);
  if (delta > 0) {
    if(currentSlide > 0){
      ScrollAnimation(currentSlide, currentSlide-1);
      currentSlide--;
    }
  } else if (delta < 0) {
    if(currentSlide < maxSlide){
      ScrollAnimation(currentSlide, currentSlide+1);
      currentSlide++;
    }
  }
}

/*
*********************
Scroll Animations
*********************
*/
function ScrollAnimation(currentSlide, nextSlide){
  if(currentSlide == 0 && nextSlide == 1){
    //Slide 1 Down
    //Move Title up
    $('#intro-div').transition({
      padding : '0em 1em 0em 1em',
      top : '45px',
      lineHeight : '1',
      height: slideSize + "px"
    });
    $('#intro-title').transition({
      opacity : 0
    });
    $('#intro-name').transition({
      y: '-17px'
    });
    $('#pdf-btn').stop(true).transition({
      top: '11px',
      x: '-45px',
      scale: '.7',
      rotate: '0deg'
    });
    //Show BIO slides
    $('#bio-div').transition({rotateY:'0deg'}, function (){
      //$('#bio-pic').transition({rotateY:'0deg'}, function (){
        $('#desc-div').transition({
          marginLeft:(($(window).width() - 620)/2 + 288) + "px",
          opacity: 1
        },600);
      //});
    });
    //Start Date Timer
    var myBirthDay = new Date(1988,9,12,3,30,23);
    var today = new Date();
    var fullDiff = Math.ceil(Math.abs(myBirthDay.getTime() - today.getTime())/1000);
    $('#bio-desc-age').text(secondsToString(fullDiff));
    setInterval(function() {
      var myBirthDay = new Date(1988,9,12,3,30,23);
      var today = new Date();
      var fullDiff = Math.ceil(Math.abs(myBirthDay.getTime() - today.getTime())/1000);
      $('#bio-desc-age').text(secondsToString(fullDiff));
    }, 1000);
    var hoverHide = false;
    //Hover Event
    $('.bio-desc-hover').css('pointer-events','all');
    $('.bio-desc-hover').hover(function(){
      if($('#hover-div').css('opacity') == 0){
        $('#hover-div').offset({
          top: $(this).offset().top + 2,
          left: ($(this).offset().left + $(this).textWidth() + 8)
        });
        $('#hover-div').transition({
          opacity : 1,
          width : '250px'
        });
      }else{
        $('#hover-div').stop().transition({
          top: $(this).offset().top + 2,
          left: ($(this).offset().left + $(this).textWidth() + 8)
        }, 800, "snap");
      }
      hoverHide = false;
      if($(this).attr('id') == 'desc-1'){
        $('#hover-div').html("<div class='center-text'><i>“When all think alike, then no one is thinking.”</i></br><div class='inside-text-center'>-Walter Lippman</div></div>");
      }else if($(this).attr('id') == 'desc-2'){
        $('#hover-div').html("<div class='center-text'><i>“It is not the strongest or the most intelligent who will survive but those who can best manage change.”</i></br><div class='inside-text-center'>–Charles Darwin</div></div>");
      }else if($(this).attr('id') == 'desc-3'){
        $('#hover-div').html("<div class='center-text'><i>“The expectations of life depend upon diligence; the mechanic that would perfect his work must first sharpen his tools.”</i></br><div class='inside-text-center'>-Confucius</div></div>");
      }else if($(this).attr('id') == 'desc-4'){
        $('#hover-div').html("<div class='center-text'><i>“Reliability is the precondition for trust.”</i></br><div class='inside-text-center'>–Wolfgang Schauble</div></div>");
      }else if($(this).attr('id') == 'desc-5'){
        $('#hover-div').html("<div class='center-text'><i>“Have patience. All things are difficult before they become easy.”</i></br><div class='inside-text-center'>-Saadi</div></div>");
      }
    }, function (){
      hoverHide = true;
      var tempTimer = setTimeout(function(){
        if(hoverHide){
          $('#hover-div').transition({
            opacity : 0
          });
        }
      },1700);
    });
    //Media Buttons
    $('#mediabtn-email').transition({rotateY:'0deg', delay:100});
    $('#mediabtn-insta').transition({rotateY:'0deg', delay:200});
    $('#mediabtn-twitter').transition({rotateY:'0deg', delay:300});
  }else if(currentSlide == 1 && nextSlide == 0){
    $('.bio-desc-hover').css('pointer-events','none');
    //Slide 1 Up
    $('#intro-div').transition({
      padding : '1em 2em',
      top : '45%',
      lineHeight : '1.2',
      height: backupPositions.slide1Size + "px"
    });
    $('#intro-title').transition({
      opacity : 1
    });
    $('#intro-name').transition({
      y: '0px'
    });
    $('#pdf-btn').stop(true).transition({
      scale: '1',
      x: '0px',
      top: backupPositions.slide1Up+"px",
      rotate: '0deg'
    });
    //Show BIO slides
    $('#bio-div').stop(true).transition({rotateY:'180deg'});
    //$('#bio-pic').stop(true).transition({rotateY:'180deg'});
    $('#desc-div').stop(true).transition({
      marginLeft:(($(window).width() - 620)/2 + 230) + "px",
      opacity: 0
    },200,'snap');
    //Media Buttons
    $('#mediabtn-email').transition({rotateY:'180deg', delay:0},200);
    $('#mediabtn-insta').transition({rotateY:'180deg', delay:20},200);
    $('#mediabtn-twitter').transition({rotateY:'180deg', delay:50},200);
  }else if(currentSlide == 1 && nextSlide == 2){
    $('.bio-desc-hover').css('pointer-events','none');
    //Shrink pic slide
    $('#bio-div').transition({
      top:'15px',
      marginLeft: ($('#intro-div').offset().left - 65)+'px',
      padding: '5px'
    });
    $('#bio-pic').transition({
      width: '50px',
      height: '50px'
    });
    //Shrink media buttons.
    $('#bio-mediabtns').transition({
      marginLeft : ($('#intro-div').offset().left + 35)+'px',
      marginTop : '65px'
    });
    $('#mediabtn-email').transition({
      scale:0.5,
      marginLeft: '23px'
    });
    $('#mediabtn-insta').transition({
      scale:0.5
    });
    $('#mediabtn-twitter').transition({
      scale:0.5,
      marginLeft: '73px'
    });
    //Hide desc slide
    $('#desc-div').stop(true).transition({
      marginTop: "-40px",
      opacity: 0
    },400);

    //Show Cover Page 
  }else if(currentSlide == 2 && nextSlide == 1){
    $('.bio-desc-hover').css('pointer-events','all');
    //Make slide larger
    $('#bio-div').transition({
      top:'130px',
      marginLeft: ($(window).width() - 620)/2+'px',
      padding: '1em'});
    $('#bio-pic').transition({
      width: '240px',
      height: '340px'
    });

    $('#mediabtn-email').transition({
      scale:1,
      marginLeft: '0px'
    });
    $('#mediabtn-insta').transition({
      scale:1
    });
    $('#mediabtn-twitter').transition({
      scale:1,
      marginLeft: '96px'
    });
    $('#bio-mediabtns').transition({
      marginLeft : ($(window).width() - 620)/2 + 66+'px',
      marginTop : '502px'
    });
    //Show desc slide
    $('#desc-div').stop(true).transition({
      marginTop:"0px",
      opacity: 1
    },400);
  }
};

/*Calculate text width*/
$.fn.textWidth = function(){
  var html_org = $(this).html();
  var html_calc = '<span>' + html_org + '</span>';
  $(this).html(html_calc);
  var width = $(this).find('span:first').width();
  $(this).html(html_org);
  return width;
};

/*
*********************
Calculate division changes
*********************
*/
function CalculateDivChange(){
  var tempWidth = $(window).width();
  var tempHeight = $(window).height();
  $("#bio-div").css('margin-left', (tempWidth - 620)/2);
  $("#desc-div").css('margin-left', (tempWidth - 620)/2 + 230);
  $('#bio-mediabtns').css('margin-left', (tempWidth - 620)/2 + 66);
  $('#bio-mediabtns').css('margin-top', 502);
}

function secondsToString(seconds){
  var numyears = Math.floor(seconds / 31536000);
  var numdays = Math.floor((seconds % 31536000) / 86400); 
  var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
  return numyears + " years " +  numdays + " days " + numhours + " hours " + numminutes + " min " + numseconds + " sec";
}

//Change to Current IP Address
var socket = io.connect('192.168.1.134:3000');
socket.on('news', function (data) {
  socket.emit('my other event', { my: 'data' });
});
