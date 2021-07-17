import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { take, map, tap, delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private innerPlaces = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      149.99,
      new Date('2021-01-01'),
      new Date('2021-12-31'),
      'vj'
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris!',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
      189.99,
      new Date('2021-01-01'),
      new Date('2021-12-31'),
      'vj'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
      99.99,
      new Date('2021-01-01'),
      new Date('2021-12-31'),
      'vj'
    )
  ]);

  get places() {
    return this.innerPlaces.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  getPlace(id: string)
  {
    return this.places.pipe(
      take(1),
      map(places => ({ ...places.find(x=>x.id === id) }))
    );

    //return this.innerPlaces.find(x=>x.id === id);
  }

  updatePlace(place: Place)
  {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap(places => {
        const i = places.findIndex(x=>x.id === place.id);
        const newPlaces = [...places];
        newPlaces[i] = place;
        this.innerPlaces.next(places);
      })
    );

    //return this.innerPlaces.find(x=>x.id === id);
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date)
  {
    const place = new Place(
      Math.random().toString(),
      title,
      description,
      'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    console.log(place);
    return this.http.post(
      'https://ionic-angular-366cc-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json',
      { ...place, id: null }
    ).pipe(
      tap(
        responseData => {
          console.log(responseData);
        }
      )
    );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this.innerPlaces.next(places.concat(place));
    //   })
    // );

    // this.places.pipe(take(1)).subscribe(places => {
    //   setTimeout(() => {
    //     this.innerPlaces.next(places.concat(place));
    //   }, 2000);
    // });
  }
}


