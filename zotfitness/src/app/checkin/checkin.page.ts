import { Component, OnInit } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router'; //added
import { Preferences } from '@capacitor/preferences'; //added
import {workoutType, workoutReportType, SearchService} from '../service/search.service'
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage implements OnInit {
  
  exerciseCategory:string = "";
  ratingCategory:string = "";
  durationCategory:string = "";
  invalidName:boolean = false;

  constructor(private router:Router, private searchService: SearchService, private alertController: AlertController) { }

  ngOnInit() {
  }

  async onCheckinClick() {
    this.setExercise();
    this.setRating();
    this.setDuration();

    // call yunfan's function to properly store exercise data

    // call from api to get data from name of exercise and use to make params
    let param = "name=" + this.exerciseCategory.toLowerCase();
    this.searchService.getMuscleWorkouts(param).subscribe(
      async res => {
        // if the name does not exist (aka improper input res[0] not exist) then say error
        console.log(res[0]);
        if(!res[0]) {
          this.presentAlert();
        } 
        else{
          const workoutT: workoutType = {
            type: res[0].type,
            muscle: res[0].muscle,
            difficulty: res[0].difficulty
          };

          const workoutRT: workoutReportType = {
            workout: workoutT,
            likeability: Number(this.ratingCategory)
          };

          this.searchService.updatePreferencesWithworkoutHistory(workoutRT);
          this.router.navigateByUrl('/history');
        }
      }
    );
  }

  async presentAlert(){
    let a = await this.alertController.create({
      header: 'Invalid Exercise Type',
      subHeader: 'This exercise does not exist',
      message: 'Please check the spelling of the exercise.',
      buttons: ['OK'],
    });

    await a.present();
  }

  // event handler that updates exercise whenever user selects a muscle
  ratingSelect(ev: Event){
    this.ratingCategory = (ev.target as HTMLInputElement).value;
  }

  // event handler that updates exercise whenever user selects a muscle
  durationSelect(ev: Event){
    this.durationCategory = (ev.target as HTMLInputElement).value;
  }

  // function that deletes stored check in exercise
  removeExercise = async () => {
    await Preferences.remove({ key: 'checkinExercise' });
  };

  // function that deletes stored checkin rating
  removeRating = async () => {
    await Preferences.remove({ key: 'checkinRating' });
  };

  // function that deletes stored checkin duration
  removeDuration = async () => {
    await Preferences.remove({ key: 'checkinDuration' });
  };

  // function that sets exercise
  setExercise = async () => {
  await Preferences.set({
    key: 'checkinExercise',
    value: this.exerciseCategory,
  });
  };

  // function that sets rating
  setRating = async () => {
  await Preferences.set({
    key: 'checkinRating',
    value: this.ratingCategory,
  });
  };

  // function that sets duration
  setDuration = async () => {
  await Preferences.set({
    key: 'checkinDuration',
    value: this.durationCategory,
  });
  };
}
