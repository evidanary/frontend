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
  $.getJSON("http://127.0.0.1/select/?wt=json&indent=true&hl=true&hl.fl=description,command:string&hl.fl=description&hl.simple.pre=<strong>&hl.simple.post=</strong>&q=" + token, function(result){
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

function preLoadCheats() {
  cheatFile = "http://107.170.129.11:9393/subset.csv";
  cheats = {};
  idx = lunr(function () {
    this.ref('id');
    this.field('region');
    this.field('description', { boost: 10 });
    this.field('command');
  });

  Papa.parse(cheatFile, {
    download: true,
//    step: function(row) {
//      //console.log("Row:", row.data);
//      cheats[row.data[0]] = { "region": row.data[1], "description": row.data[2], "command": row.data[3] };
//      idx.add({"id": row.data[0], "region": row.data[1], "description": row.data[2], "command": row.data[3] });
//    },
    complete: function(results) {
      results.data.map(function(row) {
        cheats[row[0]] = { "region": row[1], "description": row[2], "command": row[3] };
        idx.add({"id": row[0], "region": row[1], "description": row[2], "command": row[3] });
      });
    }
  });
}

function getResultsLunr(query) {
  var maxResults = 10;
  var finalHTML="";
  console.log(idx.search(query));
  results = idx.search(query);

  results.slice(0, maxResults).map(function(result) {
     var intHTML = ""
    + (cheats[result.ref].description)
    + "<br><span class='command-snippet'>" + cheats[result.ref].command + "</span>"
    + "<br><br>";
    finalHTML += intHTML;
  });

//  for (var i = 0; i < result.response.docs.length; i++) {
//    var thisId = result.response.docs[i].id
//    var thisResult = ""
//    + (result.highlighting[thisId].description || result.response.docs[i].description)
//    + "<br><span class='command-snippet'>" + result.response.docs[i].command + "</span>"
//    + "<br><br>";
//    finalhtml += thisResult;
//  }

  $('#rs').html(finalHTML);
}


