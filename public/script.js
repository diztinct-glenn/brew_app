$(document).ready(function() {

  var getData = function(beerName) {
      return $.ajax({
        method: "GET",
        url: "http://api.brewerydb.com/v2/beers?name=" + beerName + "&withBreweries=Y&key=DON'T FORGET TO PUT BACK KEY"
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
      // var name = data.name;
      // var temp = data.main.temp;
      $('#output').html(beer + " is brewed by " + brewery + ".")
    }

  // http://api.brewerydb.com/v2/beers?name=coors%20light&withBreweries=Y&key=7a86410c004fdf1aa75506fd5da627d0

})
