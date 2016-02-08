initModule = function (  ) {

/* global variables */
  var rhythm = "BB.TB.T."

/* state variables */
  var playing = false;
  var beat = 0;
  var timer;
  
  
/* setup */
  setup = function() {
    // button
    $(".button").val($("<div>").html("&#9654;").text());
    
    // metronome
    $("#m0").addClass("highlite");
    
    for (var b = 0; b < rhythm.length; b++) {
      // diagram
      $(".diagram td#d"+b).text(rhythm[b]);
    
      // controls
      if (rhythm[b] == 'B') {
        $(".controls #b"+b).addClass("highlite");
      } else if (rhythm[b] == 'T') {
        $(".controls #t"+b).addClass("highlite");
      }
    }
    return false;
  }
  

/* event handlers */  
  onTick = function(e) {
    beat = (beat+1)%rhythm.length;
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
  
  onTouch = function(e) {
    var i = this.id.substr(1);
    if (this.id[0] == 'b') {
      $(this).toggleClass("highlite");                                     // self
      $(".controls #t"+i).removeClass("highlite");                         // other 
      $(".diagram td#d"+i).text($(this).hasClass("highlite") ? 'B' : '.'); // diagram
    } else if (this.id[0] == 't') {
      $(this).toggleClass("highlite");                                     // self
      $(".controls #b"+i).removeClass("highlite");                         // other
      $(".diagram td#d"+i).text($(this).hasClass("highlite") ? 'T' : '.'); // diagram
    }    
    return false;
  }
/* end event handlers */   

  $( ".button" ).click( onClick );
  $( ".controls td" ).click( onTouch );
  
  setup();
  
};