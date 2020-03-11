import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlatService } from 'src/app/service/plat.service';
import { Plat } from 'src/app/Models/plat';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/utils.service';
import { Restaurant } from '../../Models/restaurant';

@Component({
  selector: 'app-modifier-plat',
  templateUrl: './modifier-plat.page.html',
  styleUrls: ['./modifier-plat.page.scss'],
})
export class ModifierPlatPage implements OnInit {
  restaurants: Restaurant[];

  platId : number;
  plat: Plat;
  formGroup: FormGroup;
  nomControl: FormControl ;
  prixControl: FormControl ;
  descriptionControl: FormControl ;
  restaurantControl: FormControl;

  constructor(
    private route : ActivatedRoute,
    private service: PlatService,
    private formBuilder: FormBuilder,
    private nav: NavController,
    private utils: UtilsService
  ) {
   
    this.platId = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getPlat(this.platId).subscribe(plat=>{
      this.plat= plat;
      this.createForm();
    })
    console.log("Id="+this.platId);
  }


  createForm() {
    this.nomControl = new FormControl(this.plat.nom,[Validators.required, Validators.minLength(2)]);
    this.prixControl = new FormControl(this.plat.prix,[Validators.required]);
    this.descriptionControl = new FormControl(this.plat.description);
    this.restaurantControl = new FormControl(this.plat.restaurant, [Validators.required]);

    this.formGroup=this.formBuilder.group({
      nom: this.nomControl,
      prix: this.prixControl,
      description: this.descriptionControl,
      restaurant : this.restaurantControl
    });
  }

  ngOnInit() {
    this.getRestaurants();
  }
  

  modifierPlat(): void {
    let infoPlat = new Plat();
    infoPlat.id=this.platId;
    infoPlat.nom= this.formGroup.get('nom').value;
    infoPlat.prix= this.formGroup.get('prix').value;
    infoPlat.description= this.formGroup.get('description').value;
    infoPlat.restaurant = this.formGroup.get('restaurant').value;


    console.log(this.formGroup.value);

    this.service.updatePlat(infoPlat).subscribe(plat=>{
      this.utils.presentToast("Plat modifié avec succés","success");
      this.nav.back();
      console.log(plat);
    },error=>{
      this.utils.presentToast("Une erreur est survenue","danger");
   })
    
  }

  getRestaurants(): void {
    this.service.getRestaurants().subscribe(restaurant => {
      this.restaurants = restaurant;
    },
      error => {
        this.utils.presentToast('Erreur survenue', 'danger');
      });
  }

}
