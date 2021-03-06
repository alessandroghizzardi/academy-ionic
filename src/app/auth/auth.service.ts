import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = false;

  get userIsAuthenticated()
  {
    return this.authenticated;
  }
  constructor() { }

  login()
  {
    this.authenticated = true;
  }

  logout()
  {
    this.authenticated = false;
  }
}
