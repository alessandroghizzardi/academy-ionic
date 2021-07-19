import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: string;
  lastName: string;
  placeId: string;
  placeTitle: string;
  placeImage: string;

  userId: string;
}

@Injectable({ providedIn: 'root'})
export class BookingService {
  generatedId: string;
  private innerBookings = new BehaviorSubject<Booking[]>([]);

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {

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
      return this.http.post<{name: string}>(
        'https://ionic-angular-366cc-default-rtdb.europe-west1.firebasedatabase.app/bookings.json',
        {...booking, id: null}
      ).pipe(
        switchMap(resData => {
          this.generatedId = resData.name;
          return this.innerBookings;
        }),
        take(1),
        tap(bookings => {
          booking.id = this.generatedId;
          this.innerBookings.next(bookings.concat(booking));
          console.log(this.innerBookings);
        })
      );
      // return this.innerBookings.pipe(
      //   take(1),
      //   delay(1000),
      //   tap(bookings => {
      //     this.innerBookings.next(bookings.concat(booking));
      //     console.log(this.innerBookings);
      //   })
      //);
  }


  fetchBookings()
  {
    return this.http
    .get<{[key: string]: BookingData}>(
      `https://ionic-angular-366cc-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
    ).pipe(
      map(
        bookingData => {
        const bookings = [];
        for (const key in bookingData)
        {
          if (bookingData.hasOwnProperty(key))
          {
            bookings.push(new Booking(
              key,
              bookingData[key].userId,
              bookingData[key].placeId,
              bookingData[key].placeTitle,
              bookingData[key].placeImage,
              bookingData[key].firstName,
              bookingData[key].lastName,
              +bookingData[key].guestNumber,
              new Date(bookingData[key].bookedFrom),
              new Date(bookingData[key].bookedTo),
            ));
          }
        }
        console.log('fetchBookings','innerBookings', 'map', bookings, bookingData);
        return bookings;
      }), tap (bookings =>  {
        this.innerBookings.next(bookings);
        console.log('fetchBookings','innerBookings', 'tap', bookings, this.innerBookings);
      })
    );
  }

  cancelBooking(bookingId: string)
  {
    console.log('cancelBooking');
    return this.http
    .delete(
      `https://ionic-angular-366cc-default-rtdb.europe-west1.firebasedatabase.app/bookings/${bookingId}.json`
    ).pipe(
      switchMap(() =>  this.bookings),
      take(1),
      delay(500),
      tap(bookings => {
        //const idx: number = bookings.findIndex(x=>x.id === bookingId);
        //console.log(bookingId, idx);
        this.innerBookings.next(bookings.filter(b=>b.id !== bookingId));
        console.log(this.innerBookings);
        console.log(this.bookings);
      })
    );
  }
}
