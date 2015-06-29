$(document).ready(function() {
  idx = null;
//  preLoadCheats();
  $('#remote').keypress(function(e){
     if(e.which == 13) {
        getResults($('<div/>').text($("#token").val()).html());
        //getResultsLunr($('<div/>').text($("#token").val()).html());
      }
  });

  $(".teaser").click(function () {
      $(".teaser-info").fadeToggle();
  });

});

function getResults(token){
  var finalhtml="";
  $.getJSON("http://127.0.0.1/select/?wt=json&hl=true&fl=id,description,command:string&hl.fl=description&hl.simple.pre=<strong>&hl.simple.post=</strong>&q=" + token, function(result){
  for (var i = 0; i < result.response.docs.length; i++) {
    var thisId = result.response.docs[i].id;
    var thisResult = ""
    + (result.highlighting[thisId].description || result.response.docs[i].description)
    + "<br><span class='command-snippet'>" + result.response.docs[i].command + "</span>"
    + "<br><br>";
    finalhtml += thisResult;
  }
  if(result.response.docs.length == 0) {
    finalhtml = "<span class='no-result'>Can't find any snippets with that query</span>"
  }
  $('#rs').html(finalhtml);
  });
}
