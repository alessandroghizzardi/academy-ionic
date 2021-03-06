import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, private loadingController: LoadingController) { }

  ngOnInit() {
  }

  onLogin()
  {
    this.loadingController.create({
      keyboardClose: true, message: 'Logging in'
    }).then(loading => {
        loading.present();
        this.authService.login();
        setTimeout(() => {
          loading.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, 1000);
    });
  }
}
