import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';
import { take, tap, delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class BookingService {
  private innerBookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService)
  {

  }

  get bookings() {
    return this.innerBookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date) {

      console.log(this.innerBookings);
      const booking = new Booking(
        Math.random().toString(),
        this.authService.userId,
        placeId,
        placeTitle,
        placeImage,
        firstName,
        lastName,
        guestNumber,
        dateFrom,
        dateTo);
      return this.innerBookings.pipe(
        take(1),
        delay(1000),
        tap(bookings => {
          this.innerBookings.next(bookings.concat(booking));
          console.log(this.innerBookings);
        })
      );
  }

  cancelBooking(bookingId: string)
  {
    console.log('cancelBooking');
    return this.innerBookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        //const idx: number = bookings.findIndex(x=>x.id === bookingId);
        //console.log(bookingId, idx);
        this.innerBookings.next(bookings.filter(b=>b.id !== bookingId));
        console.log(this.innerBookings);
      })
    );
  }
}
