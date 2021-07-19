import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  availableFrom: string;
  availableTo: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private innerPlaces = new BehaviorSubject<Place[]>([]);
  // [
  //   new Place(
  //     'p1',
  //     'Manhattan Mansion',
  //     'In the heart of New York City.',
  //     'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
  //     149.99,
  //     new Date('2021-01-01'),
  //     new Date('2021-12-31'),
  //     'vj'
  //   ),
  //   new Place(
  //     'p2',
  //     'L\'Amour Toujours',
  //     'A romantic place in Paris!',
  //     'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
  //     189.99,
  //     new Date('2021-01-01'),
  //     new Date('2021-12-31'),
  //     'vj'
  //   ),
  //   new Place(
  //     'p3',
  //     'The Foggy Palace',
  //     'Not your average city trip!',
  //     'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
  //     99.99,
  //     new Date('2021-01-01'),
  //     new Date('2021-12-31'),
  //     'vj'
  //   )
  // ]

  get places() {
    return this.innerPlaces.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces()
  {
    return this.http
    .get<{[key: string]: PlaceData}>('https://ionic-angular-366cc-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json')
      .pipe(
        map(responseData => {
          const p = [];
          for (const key in responseData)
          {
              if (responseData.hasOwnProperty(key))
              {
                const innerData = responseData[key];
                p.push(new Place(
                  key,
                  innerData.title,
                  innerData.description,
                  innerData.imageUrl,
                  +innerData.price,
                  new Date(innerData.availableFrom),
                  new Date(innerData.availableTo),
                  innerData.userId
                ));
              }
          }
          return p;
        }),
        delay(500),
        tap(responseData => {
          console.log(responseData);
          this.innerPlaces.next(responseData);
        })
    );
  }

  getPlace(id: string)
  {
    return this.http.get<PlaceData>(
      `https://ionic-angular-366cc-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${id}.json`
    ).pipe(
      map(responseData  => {
        console.log(responseData);
        return new Place(
          id,
          responseData.title,
          responseData.description,
          responseData.imageUrl,
          +responseData.price,
          new Date(responseData.availableFrom),
          new Date(responseData.availableTo),
          responseData.userId
        );
      })
    );
    // return this.places.pipe(
    //   take(1),
    //   map(places => ({ ...places.find(x=>x.id === id) }))
    // );

    //return this.innerPlaces.find(x=>x.id === id);
  }

  updatePlace(place: Place)
  {
   return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <=0)
        {
          return this.fetchPlaces();
        }
        else {
          return of(places);
        }
      }),
      switchMap(places => {
        const i = places.findIndex(x=>x.id === place.id);
        const newPlaces = [...places];
        newPlaces[i] = place;

        return this.http.put(
          `https://ionic-angular-366cc-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${place.id}.json`,
          {...place}
        );
      }),
      tap(responseData => {
        console.log(responseData);
        //this.innerPlaces.next(places);
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
    return this.http.post<{name: string}>(
      'https://ionic-angular-366cc-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json',
      { ...place, id: null }
    ).pipe(
      switchMap(responseData => {
        place.id = responseData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
          this.innerPlaces.next(places.concat(place));
      })
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


