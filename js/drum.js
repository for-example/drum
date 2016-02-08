initModule = function (  ) {

/* global variables */
  var beats = 8;

/* state variables */
  var playing = false;
  var beat = 0;
  var timer;
  
  
/* setup */
  setup = function() {
    $(".button").val($("<div>").html("&#9654;").text());
    $("#m0").addClass("highlite");
  }
  

/* event handlers */  
  onTick = function(e) {
    beat = (beat+1)%beats;
    $(".metronome td").removeClass("highlite");
    $(".metronome td#m"+beat).addClass("highlite");
    return false;
  }
  
  onStop = function () {
    clearTimeout(timer);
    beat = 0;
    $(".metronome td").removeClass("highlite");
    $(".metronome td#m"+beat).addClass("highlite");
    return false;
  }

  onClick = function(e) {
    var txt;
    playing = ! playing;
    if (playing) {
      txt = "&#9724;";
      timer = setInterval(onTick, 500);
    } else {
      txt = "&#9654;";
      onStop();
    }
    $(this).val($("<div>").html(txt).text());
    return false;
  } 
/* end event handlers */   

  $( ".button" ).click( onClick );
  
  setup();
  
};