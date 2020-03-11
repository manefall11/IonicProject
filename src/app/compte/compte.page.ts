import { Component } from '@angular/core';

@Component({
  selector: 'app-compte',
  templateUrl: 'compte.page.html',
  styleUrls: ['compte.page.scss']
})

export class ComptePage {

  constructor() {}
  
  login = window.localStorage.getItem('pseudo');
  email = window.localStorage.getItem('email');

  

  public  deconnexion():void {
    window.localStorage.removeItem('token');
    location.reload();
  }
}
