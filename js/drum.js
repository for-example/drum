initModule = function (  ) {

/* state variables */
  var playing = false;

/* event handlers */  
  onClick = function(e) {
    var txt;
    playing = ! playing;
    txt = playing ? "&#9724;" : "&#9654;";
    $(this).val($("<div>").html(txt).text()); // a trick to have val() work with unicode
    return false;
  } 

  $( ".button" ).click( onClick );
  
};