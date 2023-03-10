import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular'; //added
import { AlertController } from '@ionic/angular'; //added

// import { Input, Injectable } from  '@angular/core';// added
import { SearchPage } from 'src/app/search/search.page'; //added

@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
})
// @Injectable({ providedIn: 'root' })
export class DescriptionPage implements OnInit {

  workoutName:string = "";
  workoutType:string = "";
  workoutMuscle:string = "";
  workoutEquipment:string = "";
  workoutDifficulty:string = "";
  workoutInstruction:string = "";

  constructor(
    private modalCtr: ModalController, private alertController:AlertController, private searchTS: SearchPage
    ) {}

  ngOnInit() {
    console.log(this.workoutName);
//     this.workoutType = this.searchTS.l_type;
//     console.log(this.workoutType + "PRINTE");
//     const reload=()=>window.location.reload();
//     console.log(this.workoutType);
  }

  async close() {
    await this.modalCtr.dismiss(undefined);
  }

  // shows alert message
//   async presentAlert(message) {
//     const alert = await this.alertController.create({
//       cssClass: 'alertCustomCss',
//       //header: 'Alert',
//       //subHeader: 'Subtitle',
//       message: message,
//       buttons: ['OK']
//     });
//
//     await alert.present();
//   }



}
