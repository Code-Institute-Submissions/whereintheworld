//AutoInit All Materialize CSS
M.AutoInit();

function initAutocomplete() {

  //Draw google map in 'map' element
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 0,
      lng: 0
    },
    zoom: 20,
    mapTypeId: 'terrain'
  });

  //define input search bar
  var input = document.getElementById('destSearch');

  //Filter for only Cities
  var options = {
    types: ['(cities)']
  };

  //Create the autocomplete search bar and link it to the UI element
  var autocomplete = new google.maps.places.Autocomplete(input, options);


  //this is for the place Details
  var service = new google.maps.places.PlacesService(map);

  //Need this to bind search result to map (along with all the other stuff below)
  autocomplete.bindTo('bounds', map);

  //defining Marker for map
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, 0)
  });

  //Adds listener and executes function for when search result changes
  autocomplete.addListener('place_changed', function () {

    //remove old marker
    marker.setVisible(false);

    //variables **Global**
    place = autocomplete.getPlace();
    latitude = place.geometry.location.lat();
    longitude = place.geometry.location.lng();
    photoUrl = place.photos[0].getUrl({
      maxWidth: 400,
      maxHeight: 400
    });
    address = place.formatted_address;


    if (!place.geometry) {
      // if user enters place that doesnt exist or presses enter
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }


    if (place.geometry.viewport) {
      // If the place has a geometry, pan the map over ot it
      map.fitBounds(place.geometry.viewport);
      map.setCenter(place.geometry.location);
      map.setZoom(12);
    } else {
      // If the place has no geometry, do this instead
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    //place marker on location
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);




    //The following are to return the names of hotels, night clubs, museums etc

    //Return Hotels
    service.nearbySearch({
      location: {
        lat: latitude,
        lng: longitude
      },
      radius: 5000,
      type: ['lodging']
    }, hotels);

    //Return restaurants
    service.nearbySearch({
      location: {
        lat: latitude,
        lng: longitude
      },
      radius: 5000,
      type: ['restaurant']
    }, restaurants);

    //Return night clubs
    service.nearbySearch({
      location: {
        lat: latitude,
        lng: longitude
      },
      radius: 5000,
      type: ["night_club"]
    }, nightClub);

    //Return museums
    service.nearbySearch({
      location: {
        lat: latitude,
        lng: longitude
      },
      radius: 5000,
      type: ["museum"]
    }, museum);

    //Return casinos
    service.nearbySearch({
      location: {
        lat: latitude,
        lng: longitude
      },
      radius: 5000,
      type: ["casino"]
    }, casino);

  });

}


//The following are functions to return names of places when search is completed

function restaurants(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    $("#food").append(`<div class="col s12">I'm sorry but we were unable to find any restaurants near ${address}.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
    $("#food").append(`<div class="col s12">I'm sorry but there seems to be an error on Google's side. Please try again later.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUOTA_LIMIT) {
    console.log("Check your Quota")
  } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
    console.log("Check if your key is valid")
  } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    console.log("Missing Place_ID, you may have forgotten to add it")
  } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
    console.log("Place_ID not in database")
  } else if (status === google.maps.places.PlacesServiceStatus.OK) {
    $("#food").empty().append(`<h2 class="center-align">Restaurants</h2>`)
    for (var i = 0; i < results.length; i++) {
      // createMarker(results[i]);
      //             console.log(results[i].rating);
      var photoUrl = results[i].photos[0].getUrl({
        maxWidth: 400,
        maxHeight: 400
      });
      var rating = results[i].rating;
      var openingHours = results[i].opening_hours;
      $("#food").append(`<div class="col s3 card-panel"><p>${results[i].name}</p><img class="responsive-img" src="${photoUrl}"></img><p>Rating: ${rating}/5</p></div>`);
    }
  }
}

function nightClub(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    $("#night_club").append(`<div class="col s12">I'm sorry but we were unable to find any night clubs near ${address}.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
    $("#night_club").append(`<div class="col s12">I'm sorry but there seems to be an error on Google's side. Please try again later.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUOTA_LIMIT) {
    console.log("Check your Quota")
  } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
    console.log("Check if your key is valid")
  } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    console.log("Missing Place_ID, you may have forgotten to add it")
  } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
    console.log("Place_ID not in database")
  } else if (status === google.maps.places.PlacesServiceStatus.OK) {
    $("#night_club").empty().append(`<h2 class="center-align">Night Clubs</h2>`)
    for (var i = 0; i < results.length; i++) {
      // createMarker(results[i]);
      // console.log(results[i].name);
      $("#night_club").append(`<div class="col s3 card-panel">${results[i].name}</div>`);
    }
  }
}

function museum(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    $("#museum").append(`<div class="col s12">I'm sorry but we were unable to find any museums near ${address}.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
    $("#museum").append(`<div class="col s12">I'm sorry but there seems to be an error on Google's side. Please try again later.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUOTA_LIMIT) {
    console.log("Check your Quota")
  } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
    console.log("Check if your key is valid")
  } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    console.log("Missing Place_ID, you may have forgotten to add it")
  } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
    console.log("Place_ID not in database")
  } else if (status === google.maps.places.PlacesServiceStatus.OK) {
    $("#museum").empty().append(`<h2 class="center-align">Museums</h2>`)
    for (var i = 0; i < results.length; i++) {
      // createMarker(results[i]);
      // console.log(results[i].name);
      $("#museum").append(`<div class="col s3 card-panel">${results[i].name}</div>`);
    }
  }
}

function casino(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    $("#casino").append(`<div class="col s12">I'm sorry but we were unable to find any casinos near ${address}.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
    $("#casino").append(`<div class="col s12">I'm sorry but there seems to be an error on Google's side. Please try again later.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUOTA_LIMIT) {
    console.log("Check your Quota")
  } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
    console.log("Check if your key is valid")
  } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    console.log("Missing Place_ID, you may have forgotten to add it")
  } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
    console.log("Place_ID not in database")
  } else if (status === google.maps.places.PlacesServiceStatus.OK) {
    $("#casino").empty().append(`<h2 class="center-align">Casinos</h2>`)
    for (var i = 0; i < results.length; i++) {
      // createMarker(results[i]);
      // console.log(results[i].name);
      $("#casino").append(`<div class="col s3 card-panel">${results[i].name}</div>`);
    }
  }
}

function hotels(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    $("#lodging").append(`<div class="col s12">I'm sorry but we were unable to find any hotels or lodgings near ${address}.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
    $("#lodging").append(`<div class="col s12">I'm sorry but there seems to be an error on Google's side. Please try again later.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUOTA_LIMIT) {
    console.log("Check your Quota")
  } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
    console.log("Check if your key is valid")
  } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    console.log("Missing Place_ID, you may have forgotten to add it")
  } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
    console.log("Place_ID not in database")
  } else if (status === google.maps.places.PlacesServiceStatus.OK) {
    $("#lodging").empty().append(`<h2 class="center-align">Where To Stay</h2>`)
    for (var i = 0; i < results.length; i++) {
      // createMarker(results[i]);
      // console.log(results[i]);
      $("#lodging").append(`<div class="col s3 card-panel">${results[i].name}</div>`);
    }
  }
}
