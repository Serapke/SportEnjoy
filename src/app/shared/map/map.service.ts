import {Injectable} from '@angular/core';

@Injectable() export class MapService {

    private map: google.maps.Map;

    private markers: Array<google.maps.Marker> = [];

    constructor() { }
    
    initMap(el: HTMLElement, mapOptions: any) {

        this.map = new google.maps.Map(el, mapOptions);

        window.addEventListener("resize", () => { this.resize(); });
    }
    
    /**
     * Resizes the map, updating its center.
     */
    private resize() {
        // Saves the center.
        var latLng: google.maps.LatLng = this.map.getCenter();
        
        // Triggers resize event.
        google.maps.event.trigger(this.map, "resize");
        
        // Restores the center.
        this.map.setCenter(latLng);
    }
    
    /**
     * Sets the center map.
     * 
     * @param latLng The center map
     */
    setCenter(latLng: google.maps.LatLng) {

        if (this.map != null && latLng != null) {
            // Changes the center of the map to the given LatLng.
            this.map.panTo(latLng);
        }

    }
    
    setZoom(zoom: number) {
        if (this.map != null) {
            this.map.setZoom(zoom);
        }
    }

    addMarker(latLng: google.maps.LatLng, title?: string, contentString?: string) {
        if (this.map != null && latLng != null) { 
            // Creates the marker.
            var marker = new google.maps.Marker({
                position: latLng,
                title: title
            });
            // Adds the marker to the map.
            marker.setMap(this.map);
            // Creates the info window if required.
            if (contentString != null) {
                // Sets the max width of the info window to the width of the map element.
                var width: number = this.map.getDiv().clientWidth;

                var infoWindow = new google.maps.InfoWindow({
                    content: contentString,
                    maxWidth: width
                });
            
                // Makes the info window visible.
                marker.addListener('click', function() {
                    infoWindow.open(this.map, marker);
                });
            }
            // Pushes it to the markers array.
            this.markers.push(marker);

        }

    }
    
    /**
     * Deletes all markers.
     */
    deleteMarkers() {
        // Removes the markers from the map.
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        // Removes references to them.
        this.markers = [];
    }
}