import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root'})
export class BookingService {
  private innerBookings: Booking[] = [
    {
      id: 'zyx',
      placeId: 'p1',
      placeTitle: 'Manhattan Mansion',
      guestNumber: 2,
      userId: 'test'
    }
  ];


  get bookings() {
    return [...this.innerBookings];
  }
}
