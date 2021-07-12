import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {

  recipe: Recipe;
  constructor(
    private activatedRoute: ActivatedRoute,
    private recipesService: RecipesService,
    private rouder: Router,
    private alertController: AlertController
    ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('recipeId')) {
        //Redirect to recipe list
        return;
      }
      const recipeId = paramMap.get('recipeId');

      this.recipe = this.recipesService.getRecipe(recipeId);
    });
  }

  async onDeleteRecipe()
  {
    console.log('onDeleteRecipe');
    const alert = this.alertController.create({
      header: 'Are you sure?',
      message: 'Do you really want to delete this recipe?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          role: 'confirm',
          handler: async () => {
            this.recipesService.deleteRecipe(this.recipe.id);
            await this.presentAlert('Recipe deleted', `Recipe for ${this.recipe.title} has been successfully deleted`);
            this.rouder.navigate(['/recipes']);
          }
        }
      ]
    }).then(alertElement => alertElement.present());

  }

  async presentAlert(alertHeader: string, alertMessage: string) {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: alertHeader,
      //subHeader: 'Subtitle',
      message: alertMessage,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
