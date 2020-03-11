import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Plat } from '../Models/plat';
import {PlatService} from '../service/plat.service';
import { ToastController } from '@ionic/angular';
import { UtilsService } from '../utils.service';
import { Restaurant } from '../Models/restaurant';


@Component({
  selector: 'app-plat',
  templateUrl: 'plat.page.html',
  styleUrls: ['plat.page.scss']
})
export class PlatPage {

  plats : Plat [];
  
  constructor(private route : Router, private service: PlatService, private toast : ToastController, private utils: UtilsService) {
    this.getPlats();
  }

  // ionViewDidEnter() {
  //   this.getPlats();

  // }

  getPlats():void 
  {
    this.service.getPlats().subscribe(plats =>{
        this.plats = plats;
    }, 
    error=>
    { 
      this.utils.presentToast('Erreur survenue','danger');

    });
  }
  modifierPlat (id:any):void
  {
    this.route.navigate(['tabs/plat/modifier-plat',id]);
  }
  deletePlat(id: number):void
  {
      this.service.deletePlat(id).subscribe(plat=>{
      this.utils.presentToast('Supprimé avec succès','success');
      this.getPlats();
    });
  }


}
