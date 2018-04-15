function initAutoComplete() {

    var places = new google.maps.places.Autocomplete(document.getElementById('destSearch'));

        google.maps.event.addListener(places, 'place_changed', function () {
            place = places.getPlace();
            address = place.formatted_address;
            latitude = place.geometry.location.lat().toFixed(7);
            longitude = place.geometry.location.lng().toFixed(7);
            msg = "Address: " + address + "\nLatitude: " + latitude + "\nLongitude: " + longitude;
            url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + `${latitude},${longitude}` + "&rankby=distance&types=tourist&key=AIzaSyAuLvQIxZxSFpjc9FU7HbxGGLOhB3UGi_w";

            $("#placeName").empty().append(`${address}`);
            $("#lodging").empty().append(`${JSON.stringify(place)}`);
            $("#food").empty().append(`${latitude},${longitude}`);

            if ($("#placeName").html().length == 0){
                $('#map').hide();
            } else {
                $('#map').show();
            };

        });


};
