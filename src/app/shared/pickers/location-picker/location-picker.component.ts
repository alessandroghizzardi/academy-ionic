import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  apiKey = 'AIzaSyDQDizsnDZQbaFsRuAgTvzODTxqnhc_p74';

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  onPickLocation() {
      this.modalController.create({
        component: MapModalComponent,
        //componentProps: {selectedPlace : this.place, selectedMode: mode },
        id: 'map'
      }).then(ctrl => {
        ctrl.present();
      });

  }
}
