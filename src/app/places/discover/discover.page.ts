import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];
  virtualLoadedPlaces: Place[];

  constructor(private placesService: PlacesService, private menuController: MenuController) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
    this.virtualLoadedPlaces = [...this.loadedPlaces.slice(1)];

  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>)
  {
    console.log(event);
  }

//   onOpenMenu()
//   {
//       this.menuController.toggle('m1');
//   }
}
