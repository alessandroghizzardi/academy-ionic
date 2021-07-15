import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, OnDestroy {
  form: FormGroup;
  place: Place;
  private placeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService,
    private loadingController: LoadingController) { }

  ngOnInit() {


    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId'))
      {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeSubscription = this.placesService.getPlace(paramMap.get('placeId')).subscribe(
        place => {
          this.place = place;

          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: 'blur',
              validators: [Validators.required],
            }),
            description: new FormControl(this.place.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            })
            // ,
            // price: new FormControl(null, {
            //   updateOn: 'blur',
            //   validators: [Validators.required, Validators.min(1)]
            // }),
            // availableFrom: new FormControl(null, {
            //   updateOn: 'blur',
            //   validators: [Validators.required]
            // }),
            // availableTo: new FormControl(null, {
            //   updateOn: 'blur',
            //   validators: [Validators.required]
            // }),
          });
        }
      );

    });
  }

  ngOnDestroy() {
    if (this.placeSubscription)
    {
      this.placeSubscription.unsubscribe();
    }
  }

  onEditOffer()
  {
    if (!this.form.valid)
    {
      return;
    }

    const newPlace = {...this.place};
    newPlace.title = this.form.value.title;
    newPlace.description = this.form.value.description;

    this.loadingController.create({
      message: 'Creating'
    }).then(loading => {
      loading.present();

      this.placesService.updatePlace(newPlace).subscribe(() => {
        loading.dismiss();
        this.form.reset();
        this.navController.navigateBack('/places/tabs/offers');
      });
    });

  }
}
