import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { captureRejectionSymbol } from 'events';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  isLoading = false;
  loadedPlaces: Place[];
  showcasePlace: Place;
  virtualLoadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSubscription: Subscription;
  private fetchSubscription: Subscription;

  constructor(
    private placesService: PlacesService,
    private menuController: MenuController,
    private authService: AuthService
  ) { }


  ionViewWillEnter()
  {
    this.isLoading = true;

    // this.loadingController.create({
    //   message: 'Loading'
    // }).then(loader => {
    //   loader.present();
      this.fetchSubscription = this.placesService.fetchPlaces().subscribe(
        res => {
          this.isLoading = false;
          //loader.dismiss();
        }
      );
    //});

  }

  ngOnInit() {
    this.placesSubscription = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.showcasePlace = this.relevantPlaces[0];
      this.virtualLoadedPlaces = this.relevantPlaces.slice(1);
      console.log(this.relevantPlaces);
    });
  }
  ngOnDestroy() {
    if (this.placesSubscription)
    {
      this.placesSubscription.unsubscribe();
    }

    if (this.fetchSubscription)
    {
      this.fetchSubscription.unsubscribe();

    }
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>)
  {
    console.log(event);
    if (event.detail.value === 'all')
    {
      this.relevantPlaces = this.loadedPlaces;
      if (this.relevantPlaces.length > 0)
      {
        this.showcasePlace = this.relevantPlaces[0];
        this.virtualLoadedPlaces = this.relevantPlaces.slice(1);
      }
      else {

        this.showcasePlace = null;
        this.virtualLoadedPlaces = [] as Place[];
      }

    }
    else {
      this.relevantPlaces = this.loadedPlaces.filter(x=>x.userId === this.authService.userId);
      if (this.relevantPlaces.length > 0)
      {
        this.showcasePlace = this.relevantPlaces[0];
        this.virtualLoadedPlaces = this.relevantPlaces.slice(1);
      }
      else {

        this.showcasePlace = null;
        this.virtualLoadedPlaces = [] as Place[];
      }

    }
  }

//   onOpenMenu()
//   {
//       this.menuController.toggle('m1');
//   }
}
