import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  form: FormGroup;
  place: Place;
  constructor(private route: ActivatedRoute, private navController: NavController, private placesService: PlacesService) { }

  ngOnInit() {


    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId'))
      {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));

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
    });
  }

  onEditOffer()
  {
    if (!this.form.valid)
    {
      return;
    }
    console.log(this.form);

  }
}
