import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Place } from '../../places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  onBookPlace()
  {
    this.modalController.dismiss({message:'Dummy message'}, 'confirm', 'create-booking');

  }

  onClose()
  {
    this.modalController.dismiss(null, 'cancel', 'create-booking');
  }
}
