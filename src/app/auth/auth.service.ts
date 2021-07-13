import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private innerUuthenticated = true;
  private innerUserId = 'aj';

  public get userIsAuthenticated()
  {
    return this.innerUuthenticated;
  }

  public get userId()
  {
    return this.innerUserId;
  }

  constructor() { }

  login()
  {
    this.innerUuthenticated = true;
  }

  logout()
  {
    this.innerUuthenticated = false;
  }
}
