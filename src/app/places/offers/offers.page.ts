import { Component, OnDestroy, OnInit } from '@angular/core';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  private placesSubscription: Subscription;

  constructor(private placesService: PlacesService, private router: Router) { }


  ngOnInit() {
  }

  ionViewWillEnter()
  {
    this.placesSubscription = this.placesService.places.subscribe(places => {
      this.offers = places;
    });
  }

  ngOnDestroy()
  {
    if (this.placesSubscription)
    {
      this.placesSubscription.unsubscribe();
    }
  }


  onEdit(offerId: string, slidingItem: IonItemSliding)
  {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }
}
