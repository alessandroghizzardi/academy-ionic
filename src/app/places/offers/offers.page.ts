import { Component, OnDestroy, OnInit } from '@angular/core';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  isLoading = false;
  offers: Place[];
  private placesSubscription: Subscription;
  private fetchSubscription: Subscription;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingController: LoadingController) { }


  ngOnInit() {
    this.placesSubscription = this.placesService.places.subscribe(places => {
      this.offers = places;
    });

  }

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
