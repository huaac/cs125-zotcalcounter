import { Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Preferences } from '@capacitor/preferences';
@Component({
  imports: [IonicModule, CommonModule],
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  standalone: true,
})
export class HistoryComponent implements OnInit, OnDestroy {
  //this part initializes the default variables
  myVariable: string = "0";
  Duration: number = -1;Duration1: number = -1;Duration2: number = -1;Duration3: number = -1;Duration4: number = -1;Duration5: number = -1;Duration6: number = -1;
  Duration7: number = -1;Duration8: number = -1;Duration9: number = -1;Duration10: number = -1;Duration11: number = -1;Duration12: number = -1;
  Exercise: string = "-1";Exercise1: string = "-1";Exercise2: string = "-1";Exercise3: string = "-1";Exercise4: string = "-1";Exercise5: string = "-1";Exercise6: string = "-1";
  Exercise7: string = "-1";Exercise8: string = "-1";Exercise9: string = "-1";Exercise10: string = "-1";Exercise11: string = "-1";Exercise12: string = "-1";
  Rating: string = "-1";Rating1: string = "-1";Rating2: string = "-1";Rating3: string = "-1";Rating4: string = "-1";Rating5: string = "-1";Rating6: string = "-1";
  Rating7: string = "-1";Rating8: string = "-1";Rating9: string = "-1";Rating10: string = "-1";Rating11: string = "-1";Rating12: string = "-1";
  private checkInterval: any;
  @Output() myVariableChange = new EventEmitter<string>();

  constructor(private router: Router, public modalCtrl: ModalController) {}
  //regularly checks whether user has finished their input in the Checkin part of this page
  //The function update_valuesandqueue will only be called when a change is detected.
  ngOnInit() {
    this.checkInterval = setInterval(() => {
      this.getCheckinFinished();
    }, 1000);
  }

  //redirects to the Search Page
  onHistoryClick() {
    this.router.navigateByUrl('/search');
  }

  //clearinterval so that the portion above wont cause memory leakage
  ngOnDestroy() {
    clearInterval(this.checkInterval);
  }
  //This part detects user input of total hours desired in the calender portion. And updates the calender
  onInputChange(event: any) {
    const inputValue: number = parseInt(event.target.value, 10);
    if (!isNaN(inputValue)) {
      //myVariable here is minutes of each day in the workout calender
      this.myVariable = Math.round(inputValue * 60 / 31).toString();
      this.myVariableChange.emit(this.myVariable);
    }
  }

  changePage() {
    this.router.navigateByUrl('/checkin');
  }

  //checks whether the checkin part has finished, if yes, the queue is updated and the values are stored and updated by calling update_valuesandqueue
  getCheckinFinished() {
    const value = localStorage.getItem('CapacitorStorage.checkinFinished');
    if (value =="1"){
    this.update_valuesandqueue();
    }

    //resets value of checkinFinished to 0.
    Preferences.set({
      key: 'checkinFinished',
      value: "0",
    })
  }
  //called when CheckinFinished function finds out the Checkin part has finished, it updates the queue and Duration, Exercise, Rating.
  update_valuesandqueue() {
    const value: number = Number(localStorage.getItem('CapacitorStorage.checkinDuration'));
    const value1 = localStorage.getItem('CapacitorStorage.checkinExercise');
    const value2 = localStorage.getItem('CapacitorStorage.checkinRating');
    this.updateQueueValues();
    this.Duration = value ? value: 0;
    this.Exercise = value1 ? value1 : "-1";
    this.Rating = value2 ? value2 : "-1";

  }

  //The function called by update_valuesandqueue() to update the queue
  updateQueueValues() {
    this.Duration12 = this.Duration11;
    this.Duration11 = this.Duration10;
    this.Duration10 = this.Duration9;
    this.Duration9 = this.Duration8;
    this.Duration8 = this.Duration7;
    this.Duration7 = this.Duration6;
    this.Duration6 = this.Duration5;
    this.Duration5 = this.Duration4;
    this.Duration4 = this.Duration3;
    this.Duration3 = this.Duration2;
    this.Duration2 = this.Duration1;
    this.Duration1 = this.Duration;

    this.Exercise12 = this.Exercise11;
    this.Exercise11 = this.Exercise10;
    this.Exercise10 = this.Exercise9;
    this.Exercise9 = this.Exercise8;
    this.Exercise8 = this.Exercise7;
    this.Exercise7 = this.Exercise6;
    this.Exercise6 = this.Exercise5;
    this.Exercise5 = this.Exercise4;
    this.Exercise4 = this.Exercise3;
    this.Exercise3 = this.Exercise2;
    this.Exercise2 = this.Exercise1;
    this.Exercise1 = this.Exercise;

    this.Rating12 = this.Rating11;
    this.Rating11 = this.Rating10;
    this.Rating10 = this.Rating9;
    this.Rating9 = this.Rating8;
    this.Rating8 = this.Rating7;
    this.Rating7 = this.Rating6;
    this.Rating6 = this.Rating5;
    this.Rating5 = this.Rating4;
    this.Rating4 = this.Rating3;
    this.Rating3 = this.Rating2;
    this.Rating2 = this.Rating1;
    this.Rating1 = this.Rating;
  }
}
