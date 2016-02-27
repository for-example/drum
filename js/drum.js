initModule = function (  ) {

/* global variables */
  var rhythms = {
    "Baladi" : "BB.TB.T.",
    "Fanga"  : "B..T.TT.B.B.TT..",
    "custom" : "........"
  }
  var bass = new Audio('audio/bass.mp3');
  var tone = new Audio('audio/tone.mp3');

/* state variables */
  var playing = false;
  var beat = 0;
  var timer;
  var rhythm;

  
/* setup */
  setup = function(rname) {
    var html, r;
    
    // current rhythm
    rhythm = rhythms[rname];

    // reset    
    playing = false;
    beat = 0;
    clearTimeout(timer);

    html = '';
    for (var i = 0; i < Object.keys(rhythms).length; i++) {
      r = Object.keys(rhythms)[i];
      html += '<option value="'+ r + '" '+(r == rname ? 'selected="selected"':'') +'>'+ r +'</option>';
    }
    $("#rhythm_selector").html(html);  
    
    //----------- html structures
    html = '<th></th>';
    for (var i = 0; i < rhythm.length; i++) {
      html += '<td id="m'+ i +'"></td>';
    } 
    $(".metronome").html(html);
    
    html = '<th></th>';
    for (var i = 0; i < rhythm.length; i++) {
      html += '<td id="d'+ i +'"></td>';
    } 
    $(".diagram").html(html);
    
    html = '<th>B</th>';
    for (var i = 0; i < rhythm.length; i++) {
      html += '<td id="b'+ i +'"></td>';
    } 
    $(".controls.bass").html(html);
    
    html = '<th>T</th>';
    for (var i = 0; i < rhythm.length; i++) {
      html += '<td id="t'+ i +'"></td>';
    } 
    $(".controls.tone").html(html);
    //----------- end html structures
    
    //----------- highlighting
    // button
    $("#play").val($("<div>").html("&#9654;").text());
    
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
    //----------- end highlighting
    
    //----------- event handlers 
    $( ".controls td" ).click( onTouch );
    $( "#rhythm_selector" ).change( onRhythmSelect );
    return false;
  }
  

/* event handlers */  
  onTick = function(e) {
    $(".metronome td").removeClass("highlite");
    $(".metronome td#m"+beat).addClass("highlite");
    if (rhythm[beat] == 'B') {
      bass.play();
    } else if (rhythm[beat] == 'T'){
      tone.play();
    }
    beat = (beat+1)%rhythm.length;
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
    $("#rhythm_selector").val('custom'); 
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
  
  onRhythmSelect = function(e) {
    setup(this.options[this.selectedIndex].value);
    return false;
  }
/* end event handlers */   

  setup(Object.keys(rhythms)[0]);
  $( "#play" ).click( onClick );
  
};