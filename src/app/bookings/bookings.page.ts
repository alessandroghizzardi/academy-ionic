import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit , OnDestroy {
  bookings: Booking[];
  isLoading = false;
  private bookingsSubscription: Subscription;

  constructor(
    private bookingService: BookingService,
    private loadingController: LoadingController
    ) { }

  ngOnInit() {
    this.bookingsSubscription = this.bookingService.bookings.subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  ionViewWillEnter()
  {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
    //this.bookings = this.bookingService.bookings;
  }

  ngOnDestroy()
  {
    if (this.bookingsSubscription)
    {
      this.bookingsSubscription.unsubscribe();
    }
  }

  onCancelBooking(bookingId: string, slidingItem: IonItemSliding)
  {
    console.log(bookingId);
    this.loadingController.create({
      message:'Removing booking'
    }).then(ctrl => {
      ctrl.present();

      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        slidingItem.close();
        ctrl.dismiss();
        console.log('Booked canceled');
      });
    });
  }
}
