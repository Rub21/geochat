L.mapbox.accessToken = 'pk.eyJ1Ijoia2FyaXRvdHAiLCJhIjoib0ppeVhnWSJ9.JOLM9BQLqtI_bjvNzjNPew';
var geolocate = document.getElementById('geolocate');
var map = L.mapbox.map('map', 'mapbox.streets');

var myLayer = L.mapbox.featureLayer().addTo(map);
if (!navigator.geolocation) {
    geolocate.innerHTML = 'Geolocation is not available';
} else {
    geolocate.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        map.locate();
    };
}

map.on('locationfound', function(e) {
    map.fitBounds(e.bounds);

    var geo = {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
            'title': 'Ruben',
            'marker-color': '#ff8888',
            'marker-symbol': 'star'
        }
    };

    var request = $.ajax({
        url: "http://localhost:3000",
        method: "POST",
        data: geo,
        dataType: "html"
    });
    request.done(function(msg) {
        console.log(msg);
    });


    myLayer.setGeoJSON(geo);

    myLayer.openPopup();
    geolocate.parentNode.removeChild(geolocate);

});



map.on('locationerror', function() {
    geolocate.innerHTML = 'Position could not be found';
});


var socket = io();

socket.on('chat message', function(msg) {
    $('.marker-title').append($('<li>').text(msg));
});

$('form').submit(function() {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});

$('#m').keyup(function(evt) {
    if (evt.keyCode === 13) {
        socket.emit('chat message', $('#m').val());
        $('m').val('');
    }
});