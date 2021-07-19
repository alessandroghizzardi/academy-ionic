import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isLoading = false;
  isBookable = false;

  private placeSubscription: Subscription;
  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController,
    private placesService: PlacesService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertController: AlertController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId'))
      {
        this.navController.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;

      this.placeSubscription = this.placesService.getPlace(paramMap.get('placeId')).subscribe(
        place => {
          this.place = place;
          this.isBookable = this.place.userId === this.authService.userId;
          this.isLoading=false;
        },
        error => {
          this.alertController.create({
            header: 'Error',
            message: 'Error retrieving data',
            buttons: [{
              text: 'Ok',
              handler: () => {
                this.router.navigate(['/places/tabs/discover']);
              }
            }]
          }).then(ctrl => {
            ctrl.present();
          });
        }
      );
    });
  }

  ngOnDestroy() {
    if (this.placeSubscription)
    {
      this.placeSubscription.unsubscribe();
    }
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
        componentProps: {selectedPlace : this.place, selectedMode: mode },
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
            const loading = this.loadingController.create({
              message: 'Adding booking'
            }).then(ctrl => {
              ctrl.present();
              const data = resultData.data.bookingData;
              this.bookingService.addBooking(
                this.place.id,
                this.place.title,
                this.place.imageUrl,
                data.firstName,
                data.lastName,
                data.numberOfGuests,
                data.startDate,
                data.endDate).subscribe(() => {
                  ctrl.dismiss();
                  alert('Booking successful');
                });
            });
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
