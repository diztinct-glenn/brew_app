$(document).ready(function() {
  $('#radio_select').hide();

  var getData = function(beerName) {
      return $.ajax({
        method: "GET",
        url: "http://api.brewerydb.com/v2/beers?name=" + beerName + "&withBreweries=Y&key=DON'T FORGET TO ADD BACK API KEY"
      })
      .done(function(data) {
        console.log(data.data[0]);
        parseData(data);
      })
    }

    var addAJAXFunction = function() {
      $('#submit_button').click(function(event){
        var beerName = $('#beer_entered').val();
        getData(beerName);
        // console.log(beerName);
        event.preventDefault();
      })
    };
    addAJAXFunction();

    var parseData = function(data) {
      var beer = data.data[0].name;
      var brewery = data.data[0].breweries[0].name
      var label = data.data[0].labels.medium;
      var description = data.data[0].description;
      var abv = Number(data.data[0].abv);
      var ibu = Number(data.data[0].ibu);
      $('#output').html(beer + " is brewed by " + brewery + ".");
      $('#beer_img').attr("src", label);
      $('#description').html(description);
      $('#abv').html('ABV: ' + abv + '%');
      $('#ibu').html('IBU: ' + ibu);
      $('#radio_select').show();
    }
})
