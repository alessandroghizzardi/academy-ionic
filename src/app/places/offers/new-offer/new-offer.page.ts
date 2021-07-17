import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(
    private placesService: PlacesService,
    private navController: NavController,
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      availableFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      availableTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }
  onCreateOffer()
  {
    console.log(this.form.valid);
    console.log(this.form);
    if (!this.form.valid)
    {
      return;
    }

    this.loadingController.create({
      message: 'Creating'
    }).then(loading => {
      loading.present();

      console.log(this.form.value);

      this.placesService.addPlace(
        this.form.value.title,
        this.form.value.description,
        +this.form.value.price,
        new Date(this.form.value.availableFrom),
        new Date(this.form.value.availableTo)
      ).subscribe(() => {
        console.log(this.placesService.places);
        loading.dismiss();
        this.form.reset();
        this.navController.navigateBack('/places/tabs/offers');
      });
    });
  }
}
