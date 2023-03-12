import { Component, OnInit } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router'; //added
import { Preferences } from '@capacitor/preferences'; //added

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage implements OnInit {
  
  exerciseCategory:string = "";
  ratingCategory:string = "";
  durationCategory:string = "";

  constructor(private router:Router) { }

  ngOnInit() {
  }

  onQuestionsClick() {
    this.setExercise();
    this.setRating();
    this.setDuration();

    //this.router.navigateByUrl('/checkin');

    //this.setExercise();
    //this.setRating();
    //this.setDuration();
  }

  // event handler that updates exercise whenever user selects a muscle
  ratingSelect(ev: Event){
    this.exerciseCategory = (ev.target as HTMLInputElement).value;
  }

  // event handler that updates exercise whenever user selects a muscle
  //durationSelect(ev: Event){
  //  this.durationCategory = (ev.target as HTMLInputElement).value;
  //}

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
