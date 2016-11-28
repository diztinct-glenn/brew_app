$(document).ready(function() {
  $('#radio_select').hide();

  var getData = function(beerName) {
      $.ajax({
        method: "GET",
        url: "http://api.brewerydb.com/v2/beers?name=" + beerName + "&withBreweries=Y&key="
      })
      .done(function(data) {
        console.log(data.data[0]);
        parseData(data);
        $('#save_beer').on('click', function(){
          saveBeer(data)
          event.preventDefault();
        })
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
      var img_url = data.data[0].labels.medium;
      var description = data.data[0].description;
      var abv = Number(data.data[0].abv);
      var ibu = Number(data.data[0].ibu);
      $('#output').html(beer + " is brewed by " + brewery + ".");
      $('#beer_img').attr("src", img_url);
      $('#description').html(description);
      $('#abv').html('ABV: ' + abv + '%');
      $('#ibu').html('IBU: ' + ibu);
      $('#radio_select').show();
    }
})

    var saveBeer = function(data){
      //make the json object from your data
      var beerObject = {
        "name": data.data[0].name,
        "brewery": data.data[0].breweries[0].name,
        "img_url": data.data[0].labels.medium,
        "description": data.data[0].description,
        "abv": Number(data.data[0].abv),
        "ibu": Number(data.data[0].ibu)
      }
      //make a post ajax request to /saveBeer
      $.ajax({
        method: "POST",
        url: "/saveBeer"
      })
      .done(function(beerObject) {

      })

      console.log(beerObject);

    }
