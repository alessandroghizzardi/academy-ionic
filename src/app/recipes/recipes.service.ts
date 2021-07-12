import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipes: Recipe[] = [
    {
      id: '1',
      title: 'Schnitzel',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Schnitzel.JPG/1024px-Schnitzel.JPG',
      ingredients: ['French Fries', 'Pork Meat', 'Salad']
    },
    {
      id: '2',
      title: 'Spaghetti',
      imageUrl:
        'https://blog.giallozafferano.it/lemieloverie/wp-content/uploads/2019/02/IMG_20190201_122053.jpg',
      ingredients: ['Spaghetti', 'Meat', 'Tomatoes']
    }
  ];
  constructor() { }

  getAllRecipes()
  {
    return [...this.recipes];
  }

  getRecipe(recipeId: string)
  {
    return {
      ...this.recipes.find(recipe => recipe.id === recipeId)
    };
  }

  deleteRecipe(recipeId: string)
  {
    this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
  }
}
