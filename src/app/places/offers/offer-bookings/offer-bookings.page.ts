import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  place: Place;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placesServices: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if ((!paramMap.has('placeId')))
      {
          this.navController.navigateBack('/places/tabs/offers');
          return;
      }
      this.place = this.placesServices.getPlace(paramMap.get('placeId'));
    });
  }

}