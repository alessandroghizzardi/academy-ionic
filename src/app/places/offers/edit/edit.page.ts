import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, OnDestroy {
  isLoading = false;
  placeId: string;
  form: FormGroup;
  place: Place;
  private placeSubscription: Subscription;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController,
    private placesService: PlacesService,
    private loadingController: LoadingController,
    private alertController: AlertController) { }

  ngOnInit() {


    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId'))
      {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placeSubscription = this.placesService.getPlace(this.placeId).subscribe(
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
          this.isLoading= false;
        },
        error => {
          this.alertController.create({
            header: 'Error',
            message: 'Error retrieveing data',
            buttons: [{text: 'Ok', handler: () => {
              this.router.navigate(['/places/tabs/offers']);
            }}]
          }).then(ctrl => {
            ctrl.present();
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
