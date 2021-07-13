import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  showcasePlace: Place;
  virtualLoadedPlaces: Place[];
  private placesSubscription: Subscription;

  constructor(private placesService: PlacesService, private menuController: MenuController) { }

  ionViewWillEnter()
  {
    this.placesSubscription = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.showcasePlace = this.loadedPlaces[0];
      this.virtualLoadedPlaces = [...this.loadedPlaces.slice(1)];
    });
  }
  ngOnInit() {

  }
  ngOnDestroy() {
    if (this.placesSubscription)
    {
      this.placesSubscription.unsubscribe();
    }
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>)
  {
    console.log(event);
  }

//   onOpenMenu()
//   {
//       this.menuController.toggle('m1');
//   }
}
