$(document).ready(function() {

  var addAJAXFunction = function() {
      $('#submit_button').click(function(event){
        var beerName = $('#search').val();
        getData(beerName);
        event.preventDefault();
      })
    };
    addAJAXFunction();

  var getData = function(beerName) {
      $.ajax({
        method: "GET",
        url: "/search/" +  beerName //pseuddo
      })
      .done(function(data) {
        // console.log(data)
        parseData(data);
        $('#save_beer').on('click', function(){
          saveBeer(data);
          // event.preventDefault();
        })
      })
    }

    $('#radio_select').hide();
    var parseData = function(data) {
      var beer = data.data[0].name;
      var brewery = data.data[0].breweries[0].name
      var img_url = data.data[0].labels.medium;
      var description = data.data[0].description;
      var abv = Number(data.data[0].abv);
      $('#output').html(beer + " is brewed by " + brewery + ".");
      $('#beer_img').attr("src", img_url);
      $('#description').html(description);
      $('#abv').html('ABV: ' + abv + '%');
      $('#radio_select').show();
    }

    var saveBeer = function(data){
      var beerObject = {
            name: data.data[0].name,
            brewery: data.data[0].breweries[0].name,
            img_url: data.data[0].labels.medium,
            description: data.data[0].description,
            abv: data.data[0].abv,
            liked: $('input[name="liked"]:checked').val()
          }
      $.ajax({
        method: "POST",
        url: "/beers/search",
        data: beerObject
      })

    }
})
