//Init Things On Page Load
$('body').hide();
$(".main-1").hide();

$(document).ready(function () {
  //Init Materialize CSS Tabs/Modals
  $('.tabs').tabs();
  $('#modalprime').modal();
  $('#start-modal').modal();
  $('#contact-modal').modal();
  //Init Anything else
  $('body').fadeIn(1000);
});
//End Page Load

// Modal Functions
$("#how-to-btn").click(function () {
  $('#start-modal').modal('open');
});
$("#contact-event").click(function () {
  $('#contact-modal').modal('open');
});

//----------------------

var placeTypes = [
  'lodging',
  'restaurant',
  'night_club',
  'museum',
  'casino'
];

var attractId = [
  'lodgeEvent',
  'restEvent',
  'nightEvent',
  'musEvent',
  'casEvent'
];

//----------------------

var markers = [];

//==============================================================================================================
//Click trigger for main page (This is to make the tiles on the main page work)
//==============================================================================================================

var isClickTriggered = false;

function clickTriggered(textQuery) {
  isClickTriggered = true;
  var request = {
    query: textQuery,
    fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
  };

  service.findPlaceFromQuery(request, function (results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      if (results.length > 0) {
        var place = results[0];
      } else {
        return;
      }
      if (!place.geometry) return;
    }

    //Change The Page Around A Bit When New Destination is Entered
    $(".sub-heading").addClass("col s4").css("margin-top", "15px");
    $("#destSearch").removeClass("s10").addClass("s8");

    $("#how-to-btn").hide(500);
    $(".main-1").show(500);
    $(".main-2").hide(500);

    //remove old marker
    marker.setVisible(false);

    //variables **Global**
    latitude = place.geometry.location.lat();
    longitude = place.geometry.location.lng();
    address = place.formatted_address.split(",")[0];
    photoUrl = place.photos[0].getUrl({
      maxWidth: 400,
      maxHeight: 400
    });

    if (!place.geometry) {
      // if user enters place that doesnt exist or presses enter (not working)
      return;
    }

    if (place.geometry.viewport) {
      // If the place has a geometry, pan the map over ot it
      map.fitBounds(place.geometry.viewport);
      map.setCenter(place.geometry.location);
      map.setZoom(13);
    } else {
      // If the place has no geometry, do this instead
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    $("#placeName").empty().append(`<h1>Attractions in ${address}</h1>`)

    //This cycles through the different attraction functions getting all the info
    for (j = 0; j < placeTypes.length; j++) {
      service.nearbySearch({
        location: {
          lat: latitude,
          lng: longitude
        },
        radius: 5000,
        type: placeTypes[j]
      }, eval(placeTypes[j]));
    }
    $("#destSearch").blur();
    isClickTriggered = false;
  });
}

//==============================================================================================================
//The main Google Maps JS Autocomplete function
//==============================================================================================================

function initAutocomplete() {
  //Draw google map in 'map' element
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 0,
      lng: 0
    },
    zoom: 20,
    mapTypeControl: false,
    mapTypeId: 'terrain'
  });

  //define input search bar
  input = document.getElementById('destSearch');

  //Filter for only Cities
  var options = {
    types: ['(cities)']
  };

  // Choose First Result on Enter Key (https://stackoverflow.com/a/11703018)
  var pac_input = document.getElementById('destSearch');
  (function pacSelectFirst(input) {
    // store the original event binding function
    var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

    function addEventListenerWrapper(type, listener) {
      // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
      // and then trigger the original listener.
      if (type == "keydown") {
        var orig_listener = listener;
        listener = function (event) {
          var suggestion_selected = $(".pac-item-selected").length > 0;
          if (event.which == 13 && !suggestion_selected) {
            var simulated_downarrow = $.Event("keydown", {
              keyCode: 40,
              which: 40
            });
            orig_listener.apply(input, [simulated_downarrow]);
            this.blur();
          }
          orig_listener.apply(input, [event]);
        };
      }
      _addEventListener.apply(input, [type, listener]);
    }
    input.addEventListener = addEventListenerWrapper;
    input.attachEvent = addEventListenerWrapper;
  })(pac_input);

  //Create the autocomplete search bar and link it to the UI element
  var autocomplete = new google.maps.places.Autocomplete(input, options);

  //this is for the place Details
  service = new google.maps.places.PlacesService(map);
  infowindow = new google.maps.InfoWindow();

  //Need this to bind search result to map (along with all the other stuff below)
  autocomplete.bindTo('bounds', map);

  //defining Marker for map
  marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, 0)
  });

  //Adds listener and executes function for when search result changes
  autocomplete.addListener('place_changed', function () {
    // Do not execute this function if click is triggered on first page
    if (isClickTriggered) return;
    //Change The Page Around A Bit When New Destination is Entered
    $(".sub-heading").addClass("col s4").css("margin-top", "15px");
    $("#destSearch").removeClass("s10").addClass("s8");

    $("#how-to-btn").hide(500);
    $(".main-1").show(500);
    $(".main-2").hide(500);

    //remove old marker
    marker.setVisible(false);

    //variables **Global**
    place = autocomplete.getPlace();
    latitude = place.geometry.location.lat();
    longitude = place.geometry.location.lng();
    address = place.formatted_address.split(",")[0];
    photoUrl = place.photos[0].getUrl({
      maxWidth: 400,
      maxHeight: 400
    });

    if (!place.geometry) {
      // if user enters place that doesnt exist or presses enter (not working)
      return;
    }


    if (place.geometry.viewport) {
      // If the place has a geometry, pan the map over ot it
      map.fitBounds(place.geometry.viewport);
      map.setCenter(place.geometry.location);
      map.setZoom(13);
    } else {
      // If the place has no geometry, do this instead
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    //The following commented out code places a marker at your city of choice
    //place marker on SEARCH location
    //marker.setPosition(place.geometry.location);
    //marker.setVisible(true);

    $("#placeName").empty().append(`<h1>Attractions in ${address}</h1>`)

    //This cycles through the different attraction functions getting all the info
    for (j = 0; j < placeTypes.length; j++) {
      service.nearbySearch({
        location: {
          lat: latitude,
          lng: longitude
        },
        radius: 5000,
        type: placeTypes[j]
      }, eval(placeTypes[j]));
    }
    $("#destSearch").blur();
  });

  // Main screen tiles!
  $(".main-card1").click(function () {
    $("#destSearch").val("Seville, Spain");
    $("#destSearch").focus();
    google.maps.event.trigger(input, 'keydown', {
      keyCode: 13
    });
  });
  $(".main-card2").click(function () {
    $("#destSearch").val("Oslo, Norway");
    $("#destSearch").focus();
    google.maps.event.trigger(input, 'keydown', {
      keyCode: 13
    });
  });
  $(".main-card3").click(function () {
    $("#destSearch").val("Detroit, USA");
    $("#destSearch").focus();
    google.maps.event.trigger(input, 'keydown', {
      keyCode: 13
    });
  });
  $(".main-card4").click(function () {
    $("#destSearch").val("Durban, South Africa");
    $("#destSearch").focus();
    google.maps.event.trigger(input, 'keydown', {
      keyCode: 13
    });
  });
  $(".main-card5").click(function () {
    $("#destSearch").val("Hamburg, Germany");
    $("#destSearch").focus();
    google.maps.event.trigger(input, 'keydown', {
      keyCode: 13
    });
  });
  $(".main-card6").click(function () {
    $("#destSearch").val("Guanajuato, Mexico");
    $("#destSearch").focus();
    google.maps.event.trigger(input, 'keydown', {
      keyCode: 13
    });
  });
  $(".main-card7").click(function () {
    $("#destSearch").val("Kaohsiung, Taiwan");
    $("#destSearch").focus();
    google.maps.event.trigger(input, 'keydown', {
      keyCode: 13
    });
  });
  $(".main-card8").click(function () {
    $("#destSearch").val("Antwerp, Belgium");
    $("#destSearch").focus();
    google.maps.event.trigger(input, 'keydown', {
      keyCode: 13
    });
  });
  $(".main-card9").click(function () {
    $("#destSearch").val("Matera, Italy");
    $("#destSearch").focus();
    google.maps.event.trigger(input, 'keydown', {
      keyCode: 13
    });
  });
  $(".main-card10").click(function () {
    $("#destSearch").val("San Juan, Puerto Rico");
    $("#destSearch").focus();
    google.maps.event.trigger(input, 'keydown', {
      keyCode: 13
    });
  });

}
//End of Autocomplete

//==============================================================================================================
// This function produces the modal popup for more information on a selected attraction
function showPhotoModal(place) {

  let photos = place.photos
  if (place.opening_hours == null) {} else {
    var place_times = place.opening_hours.weekday_text.toString()
    var new_place_times = place_times.split(',').join('<br />')
  }

  $('.modal-header').empty().append(`<h1 class="center-align">${place.name}</h1>`)
  $('.modal-placeinfo').empty().append(`
    <p class="left-align"><strong>Address:</strong> ${place.formatted_address}</p>
    <p class="left-align"><strong>Overall Rating:</strong> ${place.rating}/5</p>
    <p class="left-align"><strong>Telephone Number:</strong> ${place.international_phone_number}</p>
    <p class="right-align">${new_place_times}</p>
    <hr>
    <h2 class="center-align">Reviews</h2>
    <p class="flow-text">${place.reviews[0].author_name} says:</p>
    <p class="left-align"><strong>Rating:</strong> ${place.reviews[0].rating}/5</p>
    <blockquote>${place.reviews[0].text}</blockquote>
    <p class="left-align"><strong>Date:</strong> ${new Date(place.reviews[0].time*1000)}</p>
    <br>
    <p class="flow-text">${place.reviews[1].author_name} says:</p>
    <p class="left-align"><strong>Rating:</strong> ${place.reviews[1].rating}/5</p>
    <blockquote>${place.reviews[1].text}</blockquote>
    <p class="left-align"><strong>Date:</strong> ${new Date(place.reviews[1].time*1000)}</p>
    <br>
    <p class="flow-text">${place.reviews[2].author_name} says:</p>
    <p class="left-align"><strong>Rating:</strong> ${place.reviews[2].rating}/5</p>
    <blockquote>${place.reviews[2].text}</blockquote>
    <p class="left-align"><strong>Date:</strong> ${new Date(place.reviews[2].time*1000)}</p>
    <br>
    <p class="flow-text">${place.reviews[3].author_name} says:</p>
    <p class="left-align"><strong>Rating:</strong> ${place.reviews[3].rating}/5</p>
    <blockquote>${place.reviews[3].text}</blockquote>
    <p class="left-align"><strong>Date:</strong> ${new Date(place.reviews[3].time*1000)}</p>
    <br>
    <p class="flow-text">${place.reviews[4].author_name} says:</p>
    <p class="left-align"><strong>Rating:</strong> ${place.reviews[4].rating}/5</p>
    <blockquote>${place.reviews[4].text}</blockquote>
    <p class="left-align"><strong>Date:</strong> ${new Date(place.reviews[4].time*1000)}</p>
    `)
  $('.slides').empty()
  for (i = 0; i < photos.length; i++) {
    let x = photos[i].getUrl({
      maxWidth: 600,
      maxHeight: 600
    })
    $('.slides').append(`<li><img src='${x}' /></li>`)
  }
  $('.slider').slider({
    height: 500,
    interval: 5000
  });
}


//The following are functions to return names of attractions when search is completed
//==================================================Restaurant==================================================
function restaurant(results, status) {
  resultsGlobal0 = results
  //clear past results
  $("#restaurant").empty();
  if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    $("#restaurant").append(`<div class="col s12 error_text center-align">I'm sorry but we were unable to find any restaurants near ${address}.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
    $("#restaurant").append(`<div class="col s12 error_text center-align">I'm sorry but there seems to be an error on Google's side. Please try again later.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUOTA_LIMIT) {
    console.log("Check your Quota")
  } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
    console.log("Check if your key is valid")
  } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    console.log("Missing Place_ID, you may have forgotten to add it")
  } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
    console.log("Place_ID not in database")
  } else if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log(results)
    //cycle through nearBy results and return name/picture/rating for list (ALSO STORES PLACE_ID AS PLACEID TAG)
    for (var i = 0; i < results.length; i++) {
      let rating = results[i].rating;
      let name = results[i].name;
      let place_id = results[i].place_id;
      let photoUrl = results[i].photos[0].getUrl({
        maxWidth: 400,
        maxHeight: 400
      });
      $("#restaurant").append(`<a class="modal-trigger" href="#modalprime">
    <div class="col s12 m6 l4 card-deets" id="rest_modal${i}" placeid="${place_id}">
      <div class="card hvr-float">
        <div class="card-title">
          <span class="card-title">${name}</span>
        </div>
        <div class="card-image">
          <img class="responsive-img" src="${photoUrl}">
        </div>
        <div class="card-content">
          <p>Rating: ${rating}/5</p>
        </div>
      </div>
    </div>
    </a>`);
      $(`#rest_modal${i}`).on('click', function () {
        service.getDetails({
          placeId: $(this).attr("placeid")
        }, function (place) {
          showPhotoModal(place)
        });
      });
    }
  }
}


//----------------------------------------------------Night Club------------------------------------------------

function night_club(results, status) {
  resultsGlobal1 = results
  //clear past results
  $("#night_club").empty();
  if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    $("#night_club").append(`<div class="col s12 error_text center-align">I'm sorry but we were unable to find any night clubs near ${address}.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
    $("#night_club").append(`<div class="col s12 error_text center-align">I'm sorry but there seems to be an error on Google's side. Please try again later.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUOTA_LIMIT) {
    console.log("Check your Quota")
  } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
    console.log("Check if your key is valid")
  } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    console.log("Missing Place_ID, you may have forgotten to add it")
  } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
    console.log("Place_ID not in database")
  } else if (status === google.maps.places.PlacesServiceStatus.OK) {
    //cycle through nearBy results and return name/picture/rating for list (ALSO STORES PLACE_ID AS PLACEID TAG)
    for (var i = 0; i < results.length; i++) {
      let rating = results[i].rating;
      let name = results[i].name;
      let place_id = results[i].place_id;
      let photoUrl = results[i].photos[0].getUrl({
        maxWidth: 400,
        maxHeight: 400
      });
      $("#night_club").append(`<a class="modal-trigger" href="#modalprime">
    <div class="col s12 m6 l4 card-deets" id="nc_modal${i}" placeid="${place_id}">
      <div class="card hvr-float">
        <div class="card-title">
          <span class="card-title">${name}</span>
        </div>
        <div class="card-image">
          <img class="responsive-img" src="${photoUrl}">
        </div>
        <div class="card-content">
          <p>Rating: ${rating}/5</p>
        </div>
      </div>
    </div>
    </a>`);
      $(`#nc_modal${i}`).on('click', function () {
        service.getDetails({
          placeId: $(this).attr("placeid")
        }, function (place) {
          showPhotoModal(place)
        });
      });
    }
  }
}


//------------------------------------------------------Meuseum-------------------------------------------------

function museum(results, status) {
  resultsGlobal2 = results
  //clear past results
  $("#museum").empty();
  if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    $("#museum").append(`<div class="col s12 error_text center-align">I'm sorry but we were unable to find any museums near ${address}.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
    $("#museum").append(`<div class="col s12 error_text center-align">I'm sorry but there seems to be an error on Google's side. Please try again later.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUOTA_LIMIT) {
    console.log("Check your Quota")
  } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
    console.log("Check if your key is valid")
  } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    console.log("Missing Place_ID, you may have forgotten to add it")
  } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
    console.log("Place_ID not in database")
  } else if (status === google.maps.places.PlacesServiceStatus.OK) {
    //cycle through nearBy results and return name/picture/rating for list (ALSO STORES PLACE_ID AS PLACEID TAG)
    for (var i = 0; i < results.length; i++) {
      let rating = results[i].rating;
      let name = results[i].name;
      let place_id = results[i].place_id;
      let photoUrl = results[i].photos[0].getUrl({
        maxWidth: 400,
        maxHeight: 400
      });
      $("#museum").append(`<a class="modal-trigger" href="#modalprime">
    <div class="col s12 m6 l4 card-deets" id="meus_modal${i}" placeid="${place_id}">
      <div class="card hvr-float">
        <div class="card-title">
          <span class="card-title">${name}</span>
        </div>
        <div class="card-image">
          <img class="responsive-img" src="${photoUrl}">
        </div>
        <div class="card-content">
          <p>Rating: ${rating}/5</p>
        </div>
      </div>
    </div>
    </a>`);
      $(`#meus_modal${i}`).on('click', function () {
        service.getDetails({
          placeId: $(this).attr("placeid")
        }, function (place) {
          showPhotoModal(place)
        });
      });
    }
  }
}


//---------------------------------------------------Casino-----------------------------------------------------

function casino(results, status) {
  resultsGlobal3 = results
  //clear past results
  $("#casino").empty();
  if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    $("#casino").append(`<div class="col s12 error_text center-align">I'm sorry but we were unable to find any casinos near ${address}.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
    $("#casino").append(`<div class="col s12 error_text center-align">I'm sorry but there seems to be an error on Google's side. Please try again later.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUOTA_LIMIT) {
    console.log("Check your Quota")
  } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
    console.log("Check if your key is valid")
  } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    console.log("Missing Place_ID, you may have forgotten to add it")
  } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
    console.log("Place_ID not in database")
  } else if (status === google.maps.places.PlacesServiceStatus.OK) {
    //cycle through nearBy results and return name/picture/rating for list (ALSO STORES PLACE_ID AS PLACEID TAG)
    for (var i = 0; i < results.length; i++) {
      let rating = results[i].rating;
      let name = results[i].name;
      let place_id = results[i].place_id;
      let photoUrl = results[i].photos[0].getUrl({
        maxWidth: 400,
        maxHeight: 400
      });
      $("#casino").append(`<a class="modal-trigger" href="#modalprime">
    <div class="col s12 m6 l4 card-deets" id="cas_modal${i}" placeid="${place_id}">
      <div class="card hvr-float">
        <div class="card-title">
          <span class="card-title">${name}</span>
        </div>
        <div class="card-image">
          <img class="responsive-img" src="${photoUrl}">
        </div>
        <div class="card-content">
          <p>Rating: ${rating}/5</p>
        </div>
      </div>
    </div>
    </a>`);
      $(`#cas_modal${i}`).on('click', function () {
        service.getDetails({
          placeId: $(this).attr("placeid")
        }, function (place) {
          showPhotoModal(place)
        });
      });
    }
  }
}


//----------------------------------------------------Lodging---------------------------------------------------

function lodging(results, status) {
  resultsGlobal4 = results
  //clear past results
  $("#lodging").empty();
  if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
    $("#lodging").append(`<div class="col s12 error_text center-align">I'm sorry but we were unable to find any lodgings near ${address}.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
    $("#lodging").append(`<div class="col s12 error_text center-align">I'm sorry but there seems to be an error on Google's side. Please try again later.</div>`);
  } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUOTA_LIMIT) {
    console.log("Check your Quota")
  } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
    console.log("Check if your key is valid")
  } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
    console.log("Missing Place_ID, you may have forgotten to add it")
  } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
    console.log("Place_ID not in database")
  } else if (status === google.maps.places.PlacesServiceStatus.OK) {
    //cycle through nearBy results and return name/picture/rating for list (ALSO STORES PLACE_ID AS PLACEID TAG)

    for (var i = 0; i < results.length; i++) {
      let rating = results[i].rating;
      let name = results[i].name;
      let place_id = results[i].place_id;
      let photoUrl = results[i].photos[0].getUrl({
        maxWidth: 400,
        maxHeight: 400
      });
      $("#lodging").append(`<a class="modal-trigger" href="#modalprime">
    <div class="col s12 m6 l4 card-deets" id="lodging_modal${i}" placeid="${place_id}">
      <div class="card hvr-float">
        <div class="card-title">
          <span class="card-title">${name}</span>
        </div>
        <div class="card-image">
          <img class="responsive-img" src="${photoUrl}">
        </div>
        <div class="card-content">
          <p>Rating: ${rating}/5</p>
        </div>
      </div>
    </div>
    </a>`);
      $(`#lodging_modal${i}`).on('click', function () {
        service.getDetails({
          placeId: $(this).attr("placeid")
        }, function (place) {
          showPhotoModal(place)
        });
      });
    }
  }
}


//==============================================================================================================

//Click Event for Headings (shows markers of that specific type on the map when clicked and removes old ones)
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

//----------------------------------

$("#restEvent").click(function () {
  setMapOnAll(null);
  markers = [];
  for (var i = 0; i < resultsGlobal0.length; i++) {
    (function (i) {
      service.getDetails({
        placeId: resultsGlobal0[i].place_id
      }, function (place) {
        let marker = new google.maps.Marker({
          map: map,
          position: resultsGlobal0[i].geometry.location
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function () {
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            place.formatted_address + '<br>' +
            place.formatted_phone_number + '</div>');
          infowindow.open(map, this);
        });
      });
    })(i);
  }
});

//----------------------------------

$("#nightEvent").click(function () {
  setMapOnAll(null);
  markers = [];
  for (var i = 0; i < resultsGlobal1.length; i++) {
    (function (i) {
      service.getDetails({
        placeId: resultsGlobal1[i].place_id
      }, function (place) {
        let marker = new google.maps.Marker({
          map: map,
          position: resultsGlobal1[i].geometry.location
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function () {
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            place.formatted_address + '<br>' +
            place.formatted_phone_number + '</div>');
          infowindow.open(map, this);
        });
      });
    })(i);
  }
});

//----------------------------------

$("#musEvent").click(function () {
  setMapOnAll(null);
  markers = [];
  for (var i = 0; i < resultsGlobal2.length; i++) {
    (function (i) {
      service.getDetails({
        placeId: resultsGlobal2[i].place_id
      }, function (place) {
        let marker = new google.maps.Marker({
          map: map,
          position: resultsGlobal2[i].geometry.location
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function () {
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            place.formatted_address + '<br>' +
            place.formatted_phone_number + '</div>');
          infowindow.open(map, this);
        });
      });
    })(i);
  }
});

//----------------------------------

$("#casEvent").click(function () {
  setMapOnAll(null);
  markers = [];
  for (var i = 0; i < resultsGlobal3.length; i++) {
    (function (i) {
      service.getDetails({
        placeId: resultsGlobal3[i].place_id
      }, function (place) {
        let marker = new google.maps.Marker({
          map: map,
          position: resultsGlobal3[i].geometry.location
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function () {
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            place.formatted_address + '<br>' +
            place.formatted_phone_number + '</div>');
          infowindow.open(map, this);
        });
      });
    })(i);
  }
});

//----------------------------------

$("#lodgeEvent").click(function () {
  setMapOnAll(null);
  markers = [];
  for (var i = 0; i < resultsGlobal4.length; i++) {
    (function (i) {
      service.getDetails({
        placeId: resultsGlobal4[i].place_id
      }, function (place) {
        let marker = new google.maps.Marker({
          map: map,
          position: resultsGlobal4[i].geometry.location
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function () {
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            place.formatted_address + '<br>' +
            place.formatted_phone_number + '</div>');
          infowindow.open(map, this);
        });
      });
    })(i);
  }
});


//==============================================================================================================
