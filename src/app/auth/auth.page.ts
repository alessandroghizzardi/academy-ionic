import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;

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

  onSubmit(form: NgForm)
  {
    if (!form.valid)
    {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);

    if (this.isLogin)
    {
      //Send a request to login servers
    }
    else {
      //Send a requet to signup
    }
  }

  onSwitchAuthMode()
  {
    this.isLogin = !this.isLogin;
  }
}
