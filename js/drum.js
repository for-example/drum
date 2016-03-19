initModule = function (  ) {

/* global variables */
  var rhythms = {
    "Ayuub"                 : "|B..T|B.T.|",
    "Baladi"                : "|BB|.T|B.|T.|",
    "Chiftetelli"           : "|B.|.T|..|T.|B.|B.|T.|..|",
    "Fanga"                 : "|B..T|.TT.|B.B.|TT..|",
    "Kakilambe 4 beat"      : "|B..T|T.T.|B.T.|T.T.|",
    "Kakilambe 6 beat"      : "|B.|TT|T.|BT|.B|T.|",
    "Linjin"                : "|B.B|TTT|",
    "Malfuf"                : "|B..T|..T.|",
    "Malfuf with turnaround": "|B..T|..T.|B..T|..T.|B..T|..T.|B.B.|T...|",
    "Waltz"                 : "|B.|T.|T.|",
    "Waltz - modified"      : "|B.|TT|T.|",
    "3-2 son clave"         : "|T..T|..T.|..T.|T...|"
  }
  var bass = new Audio('audio/bass.mp3');
  var bass1 = new Audio('audio/bass.mp3');
  
  var tone = new Audio('audio/tone.mp3');
  var tone1 = new Audio('audio/tone.mp3');
  
  var tempos = [120,132,144,156,168,176,180,240];

/* state variables */
  var playing = false;
  var beat = 0;
  var timer;
  var current_rhythm;
  var beats_per_measure;
  var tempo;

  /* setup */
  setup_global = function() {
    var html = '', rname, r, custom_beats = [];
    
    for (var i = 0; i < Object.keys(rhythms).length; i++) {
      rname = Object.keys(rhythms)[i];
      html += '<option value="'+ rname + '">'+ rname +'</option>';
      r =  no_dividers(rhythms[rname]);
      if ($.inArray(r.length, custom_beats) == -1) {
        custom_beats.push(r.length);
      }
    }
    
    custom_beats = custom_beats.sort(function(a, b){return a-b});
    for (var i = 0; i < custom_beats.length; i++) {
      rname = custom_rname(custom_beats[i]);
      rhythms[rname] = Array(custom_beats[i] + 1).fill("|").join(".");
      html += '<option value="'+ rname + '">' + rname + '</option>';
    }
    
    $("#rhythm_selector").html(html);
    $("#play").val($("<div>").html("&#9654;").text());
    $( "#play" ).click( onClick );
  }
  
  setup_rhythm = function() {
    var html;

    // reset    
    playing = false;
    beat = 0;
    clearTimeout(timer);
    
    //----------- html structures
    html = '<th></th>';
    for (var i = 0; i < current_rhythm.length; i++) {
      html += '<td id="m'+ i +'"></td>';
    } 
    $(".metronome").html(html);
    
    html = '<th></th>';
    for (var i = 0; i < current_rhythm.length; i++) {
      html += '<td id="d'+ i +'"></td>';
    } 
    $(".diagram").html(html);
    
    html = '<th>B</th>';
    for (var i = 0; i < current_rhythm.length; i++) {
      html += '<td id="b'+ i +'"></td>';
    } 
    $(".controls.bass").html(html);
    
    html = '<th>T</th>';
    for (var i = 0; i < current_rhythm.length; i++) {
      html += '<td id="t'+ i +'"></td>';
    } 
    $(".controls.tone").html(html);
    
    html = '';
    for (var i = 0; i < tempos.length; i++) {
      html += '<option value="'+ tempos[i] +'" >'+ tempos[i] +' bpm</option>';
    }
    $("#tempo").html(html);
    $("#tempo").val(tempo)
    //----------- end html structures
    
    //----------- highlighting
    // metronome
    $("#m0").addClass("highlite");
    
    for (var b = 0; b < current_rhythm.length; b++) {
      // diagram
      $(".diagram td#d"+b).text(current_rhythm[b]);
      
      if (b%beats_per_measure == 0) {
        $(".diagram td#d"+b).addClass( "leftb" );
      }
      if (b == current_rhythm.length - 1) {
        $(".diagram td#d"+b).addClass( "rightb" );
      }
    
      // controls
      if (current_rhythm[b] == 'B') {
        $(".controls #b"+b).addClass("highlite");
      } else if (current_rhythm[b] == 'T') {
        $(".controls #t"+b).addClass("highlite");
      }
    }
    //----------- end highlighting
    
    //----------- event handlers 
    $( ".controls td" ).click( onTouch );
    $( "#rhythm_selector" ).change( onRhythmSelect );
    $( "#tempo" ).change( onTempoSelect );
    onTempoSelect();
    return false;
  }
  

/* event handlers */  
  onTick = function(e) {
    $(".metronome td").removeClass("highlite");
    $(".metronome td#m"+beat).addClass("highlite");
    if (current_rhythm[beat] == 'B') {
      (beat%2 == 0 ? bass.play() : bass1.play());
    } else if (current_rhythm[beat] == 'T'){
      (beat%2 == 0 ? tone.play() : tone1.play());
    }
    beat = (beat+1)%current_rhythm.length;
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
      timer = setInterval(onTick, Math.round(1000*60/tempo));
    } else {
      txt = "&#9654;";
      onStop();
    }
    $(this).val($("<div>").html(txt).text());
    return false;
  } 
  
  onTouch = function(e) {
    $("#rhythm_selector").val(custom_rname(current_rhythm.length));
    var i = this.id.substr(1), chr;
    if (this.id[0] == 'b') {
      $(this).toggleClass("highlite");                                     // self
      chr = $(this).hasClass("highlite") ? 'B' : '.';
      $(".controls #t"+i).removeClass("highlite");                         // other 
      $(".diagram td#d"+i).text(chr);                                      // diagram
    } else if (this.id[0] == 't') {
      $(this).toggleClass("highlite");                                     // self
      chr = $(this).hasClass("highlite") ? 'T' : '.';
      $(".controls #b"+i).removeClass("highlite");                         // other
      $(".diagram td#d"+i).text(chr);                                      // diagram
    }    
    current_rhythm = current_rhythm.substr(0, i) + chr + current_rhythm.substr(Number(i)+1);
    return false;
  }
  
  onRhythmSelect = function(e) {
    var rname = $( "#rhythm_selector option:selected" ).text();
    current_rhythm = no_dividers(rhythms[rname]);
    beats_per_measure = measure(rhythms[rname]);
    setup_rhythm();
    return false;
  }
  
  onTempoSelect = function(e) {
    tempo = $( "#tempo option:selected" ).val();
    $( "#play" ).click();
    $( "#play" ).click();
    return false;
  }
/* end event handlers */   

/* end utility */
  custom_rname = function(num_beats) {
    return('custom ' + num_beats + ' beat');
  }
  no_dividers = function(pattern) {
    return(pattern.replace(/\|/g, ''));
  }
  measure = function(pattern) {
    return(pattern.indexOf('|',1) - 1);
  }
/* end utility */ 

  setup_global();
  onRhythmSelect();
  
};