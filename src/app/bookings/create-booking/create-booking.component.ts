import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { Place } from '../../places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('form', {static: true }) form: NgForm;

  startDate: string;
  endDate: string;

  constructor(private modalController: ModalController) { }

  ngOnInit()
  {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if (this.selectedMode === 'random')
    {
      this.startDate = new Date(
        availableFrom.getTime() + (
          Math.random() * (availableTo.getTime()- (7*24*60*60*1000) - availableTo.getTime())
        )
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() + (2*24*60*60*1000)
      ).toISOString();
    }

    console.log(this.selectedMode);
    console.log(this.startDate);
    console.log(this.endDate);
  }

  onBookPlace()
  {
    if (!this.form.valid || !this.datesValid)
    {
      return;
    }

    this.modalController.dismiss({boookingData: {
      firsName:this.form.value.firstName,
      lastName:this.form.value.lastName,
      numberOfguests:this.form.value.numberOfguests,
      startDate:this.form.value.dateFrom,
      endDate:this.form.value.dateTo,
    }}, 'confirm', 'create-booking');
  }

  onClose()
  {
    this.modalController.dismiss(null, 'cancel', 'create-booking');
  }

  datesValid() {
    const startDate = new Date(this.form.value.dateFrom);
    const endDate = new Date(this.form.value.dateTo);
    return endDate > startDate;
  }
}
