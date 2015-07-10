$(document).ready(function() {
  idx = null;
  //  preLoadCheats();
  $('#remote').keypress(function(e){
    if(e.which == 13) {
      //Remove typeahead menu when enter is pressed
      $('.typeahead').typeahead('close');
      getResults($('<div/>').text($("#token").val()).html());
      //getResultsLunr($('<div/>').text($("#token").val()).html());
    }
  });

  initSuggestions();

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

function initSuggestions(){
  matchingDescriptionsRemote = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('command'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    //prefetch: '../data/films/post_1960.json',
    remote: {
      url: '/suggest?suggest=true&suggest.dictionary=descriptionSuggester&wt=json&suggest.count=6&suggest.q=%QUERY',
      filter: function(x) {
        var firstProp;
	var outerJson = x.suggest.descriptionSuggester;
	for(var key in outerJson) {
	  if(outerJson.hasOwnProperty(key)) {
	    firstProp = outerJson[key];
	    break;
	  }
	}
        return $.map(firstProp.suggestions, function(item) {
	  return {command: item.term};
        });
      },
      wildcard: '%QUERY'
      }
  }); 

  $('#remote .typeahead').typeahead(null, {
      name: 'command',
      display: 'command',
      source: matchingDescriptionsRemote.ttAdapter()
  });
}

