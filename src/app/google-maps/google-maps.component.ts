import { Component, OnInit, Input, Renderer2, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Plugins } from '@capacitor/core';
import { google } from 'google-maps';
import { Restaurant } from '../Models/restaurant';
import { PlatService } from '../service/plat.service';
import { UtilsService } from '../utils.service';




const { Geolocation, Network } = Plugins;

@Component({
  selector: 'google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss'],
})
export class GoogleMapsComponent implements OnInit {

  @Input('apiKey') apiKey: string;
  public static map: any;
  public markers: any[] = [];
  private mapsLoaded: boolean = false;
  private networkHandler = null;

  restaurants: Restaurant[];


  constructor(private service: PlatService, private utils: UtilsService, private renderer: Renderer2, private element: ElementRef, @Inject(DOCUMENT) private _document) { }

  ngOnInit() {
    this.getRestaurants();
    this.init().then((res) => {
      console.log("Google Maps ready.")
    }, (err) => {
      console.log(err);
    });

  }

  private init(): Promise<any> {

    return new Promise((resolve, reject) => {

      this.loadSDK().then((res) => {

        this.initMap().then((res) => {
          resolve(true);
        }, (err) => {
          reject(err);
        });

      }, (err) => {

        reject(err);

      });

    });

  }

  private loadSDK(): Promise<any> {

    console.log("Loading Google Maps SDK");

    return new Promise((resolve, reject) => {

      if (!this.mapsLoaded) {

        Network.getStatus().then((status) => {

          if (status.connected) {

            this.injectSDK().then((res) => {
              resolve(true);
            }, (err) => {
              reject(err);
            });

          } else {

            if (this.networkHandler == null) {

              this.networkHandler = Network.addListener('networkStatusChange', (status) => {

                if (status.connected) {

                  this.networkHandler.remove();

                  this.init().then((res) => {
                    console.log("Google Maps ready.")
                  }, (err) => {
                    console.log(err);
                  });

                }

              });

            }

            reject('Not online');
          }

        }, (err) => {

          // NOTE: navigator.onLine temporarily required until Network plugin has web implementation
          if (navigator.onLine) {

            this.injectSDK().then((res) => {
              resolve(true);
            }, (err) => {
              reject(err);
            });

          } else {
            reject('Not online');
          }

        });

      } else {
        reject('SDK already loaded');
      }

    });


  }

  private injectSDK(): Promise<any> {

    return new Promise((resolve, reject) => {

      window['mapInit'] = () => {
        this.mapsLoaded = true;
        resolve(true);
      }

      let script = this.renderer.createElement('script');
      script.id = 'googleMaps';

      if (this.apiKey) {
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
      } else {
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit';
      }

      this.renderer.appendChild(this._document.body, script);

    });

  }

  private initMap(): Promise<any> {
    
    return new Promise((resolve, reject) => {

      Geolocation.getCurrentPosition().then((position) => {

        console.log(position);    

        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         
        let mapOptions = {
          center: latLng,
          zoom: 10  
        };
       
        GoogleMapsComponent.map = new google.maps.Map(this.element.nativeElement, mapOptions);
        GoogleMapsComponent.addMarker(position.coords.latitude, position.coords.longitude , "MOI");
        console.log(this.restaurants);
        this.restaurants.forEach(function(element) {
        GoogleMapsComponent.addMarker(element.latitude, element.longitude, element.name);
        })
        resolve(true);

      }, (err) => {

        reject('Could not initialise map');

      });

    });

  }

 
  public static addMarker(lat: number, lng: number, nom: string): void {

    let latLng = new google.maps.LatLng(lat, lng);

    let marker = new google.maps.Marker({
      label : nom,
      map: GoogleMapsComponent.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });

    //this.markers.push(marker);

  }






  getRestaurants(): void {
    this.service.getRestaurants().subscribe(restaurant => {
      this.restaurants = restaurant;
      
    },
      error => {
        this.utils.presentToast('Erreur survenue', 'danger');
      });
  }



}
