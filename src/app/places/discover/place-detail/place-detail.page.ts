import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId'))
      {
        this.navController.navigateBack('/places/tabs/discover');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });
  }

  onBookPlace()
  {
    this.actionSheetController.create({
      header: 'Choose an action',
      buttons: [
        {
          text: 'Select date',
          role: 'select',
          handler: () => {
              this.openBookingModal('select');
          }
        },
        {
          text: 'Random date',
          role: 'random',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(action => {
      action.present();
    });
  }

  openBookingModal(mode: 'select' | 'random')
  {
    console.log(mode);
    this.modalController
      .create({
        component: CreateBookingComponent,
        componentProps: {selectedPlace : this.place },
        id: 'create-booking'
      })
      .then(modal => {
          modal.present();
          return modal.onDidDismiss();
        }
      ).then(
        resultData => {
          console.log(resultData);
          if (resultData.role === 'confirm'  )
          {
            alert('Booked');
          }
        }
      );
    //this.navController.navigateBack('/places/tabs/discover');

    //Only use for popup or pages you are sure are never used as first page
    //this.navController.pop();

    //No back animation
    //this.router.navigateByUrl('/places/tabs/discover');
  }
}
