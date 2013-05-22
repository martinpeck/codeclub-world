window.CodeClubWorld = {};

CodeClubWorld.makeMap = function() {
  $.getJSON('api/active-clubs.json').then(function(data) {
    var clubs = data.clubs;

    var center = new google.maps.LatLng(54.559323, -4.174805);
    var image = '../img/map/marker-6c4ba1e0ffb35772220dc5917d98ec85.png';

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: center,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var markers = [];

    $.each(clubs, function(i, club) {

      var loc = club.location;
      var latLng = new google.maps.LatLng(loc.lat, loc.lng);
      var marker = new google.maps.Marker({ 
        position: latLng,
        icon: image
      });

      markers.push(marker);

      infobox = new InfoBox({
        content: document.getElementById('infobox'),
        disableAutoPan: false,
        maxWidth: 150,
        pixelOffset: new google.maps.Size(-140, -205),
        zIndex: null,
        boxStyle: {
          background: "#fff",
          width: "280px",
          // height: "140px",
          padding: "0 10px"
        },
        infoBoxClearance: new google.maps.Size(1, 1),
        closeBoxURL: "../img/map/close.png",
        closeBoxMargin: "10px 0 0 0"
      });

      google.maps.event.addListener(marker, 'click', function() { 

        var clubName        = ('<h5 class="name">'+club.name+'</h5>');
        var clubCity        = ('<p class="city">'+club.location.city+'</p>');
        var clubActivated   = ('<p class="date">Activated: '+moment(club.activated_at).format("Do MMMM YYYY")+'</p>');
        var $clubContent = clubName+clubCity+clubActivated;

        infobox.open(map, marker);
        infobox.setContent($clubContent);
      });

    });

    var mcOptions = {styles: 
      [
        {
          textColor: 'white',
          url: '../img/map/small-cluster.png',
          height: 40,
          width: 40,
        },
       {
          textColor: 'white',
          url: '../img/map/medium-cluster.png',
          height: 40,
          width: 40
        },
       {
          textColor: 'white',
          url: '../img/map/large-cluster.png',
          height: 40,
          width: 40
        }
      ]
    };

    var markerCluster = new MarkerClusterer(map, markers, mcOptions);
    
  });

}

CodeClubWorld.interceptForm = function() {
  $('form').on('submit', function(e) {
    e.preventDefault();

    var data = $(this).serializeHash();
    CodeClubWorld.register(data);
  });
}

CodeClubWorld.register = function(data) {
  var address = [
    data.venue.name,
    data.venue.address_1,
    data.venue.address_2,
    data.venue.city,
    data.venue.postcode
  ].join(', ');
  
  var region = data.region.code;
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: address, region: region }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {

      data.venue.latitude = results[0].geometry.location.lat();
      data.venue.longitude = results[0].geometry.location.lng();
    } else {
      console.log(status);
    }

    console.log(data);
  });
}


$(function() {
  CodeClubWorld.makeMap();
  CodeClubWorld.interceptForm();
  moment();
});