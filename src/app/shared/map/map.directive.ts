import { Component, Input, OnInit, OnChanges, SimpleChange, ElementRef } from '@angular/core';
// Services.
import { MapService } from './map.service';

@Component({
    selector: 'google-map',
    template: '<div id="map" style="width: 100%; height: 400px"></div>'
})

export class GoogleMapDirective implements OnInit, OnChanges {

    /**
     * Center map. Required.
     */
    @Input() center: google.maps.LatLng;
    
    /**
     * The initial map zoom level. Required.
     */
    @Input() zoom: number;
    
    /**
     * Enables/disables all default UI.
     */
    @Input() disableDefaultUI: boolean;
    
    /**
     * Enables/disables zoom and center on double click. Enabled by default.
     */
    @Input() disableDoubleClickZoom: boolean;
    
    /**
     * The initial map mapTypeId. Defaults to ROADMAP.
     */
    @Input() mapTypeId: google.maps.MapTypeId;
    
    /**
     * The maximum zoom level which will be displayed on the map.
     */
    @Input() maxZoom: number;
    
    /**
     * The minimum zoom level which will be displayed on the map.
     */
    @Input() minZoom: number;
    
    /**
     * Styles to apply to each of the default map types.
     */
    @Input() styles: Array<google.maps.MapTypeStyle>;

    constructor(public map: MapService, private elementRef: ElementRef) { }

    /**
     * On init, creates map.
     */
    ngOnInit() {
        // Gets the map element.
        var el: HTMLElement = this.elementRef.nativeElement.querySelector('#map');

        this.createMap(el);
    }

    /**
     * On changes, updates center map & zoom.
     */
    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (changes['center']) { this.map.setCenter(this.center); };
        if (changes['zoom']) { this.map.setZoom(this.zoom); };
    }

    /**
     * Creates the map with the set properties.
     */
    private createMap(el: HTMLElement) {
        this.map.initMap(el, {
            center: this.center,
            disableDefaultUI: this.disableDefaultUI,
            disableDoubleClickZoom: this.disableDoubleClickZoom,
            mapTypeId: this.mapTypeId,
            maxZoom: <number>this.maxZoom,
            minZoom: <number>this.minZoom,
            styles: this.styles,
            zoom: <number>this.zoom

        });

    }

}