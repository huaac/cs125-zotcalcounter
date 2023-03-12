import { Component, OnInit } from '@angular/core';

import { SearchService } from 'src/app/service/search.service'; // added
import { Router } from '@angular/router'; //added
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular'; //added

import { ModalController } from '@ionic/angular'; // added
import { DescriptionPage } from 'src/app/description/description.page';
import { Input, Injectable } from  '@angular/core';// added


// import { Output, EventEmitter } from '@angular/core'; //added

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
@Injectable({ providedIn: 'root' })
export class SearchPage implements OnInit {

  workouts: string[] = [];
  currentPage = 1;
  currentWeather = 0;
  searchTerm = "";

  typeParam = ["cardio", "olympic_weightlifting", "plyometrics", "powerlifting", "strength", "stretching", "strongman"];
  difficultyParam = ["beginner", "intermediate", "expert"];
  muscleParam = [
    "abdominals", "abductors", "adductors", "biceps", "calves",
    "chest", "forearms", "glutes", "hamstrings", "lats", "lower_back",
    "middle_back", "neck", "quadriceps", "traps", "triceps"];


//   imageBaseUrl = environment.images; // no images atm...

  constructor(private searchService: SearchService, private router:Router, private loadingCtrl: LoadingController, public modalCtrl:ModalController) { }

  ngOnInit() {
//     this.searchService.getMuscleWorkouts(); // on initialization of page, print bicep data
    this.loadWorkouts("");
//     this.getWeatherData();
  }

  onHistoryClick() {
    this.router.navigateByUrl('/history');
  }
  onProfileClick() {
    this.router.navigateByUrl('/questions');
  }

  onSearchClickNewWorkouts() {
    let split_text = this.searchTerm.split(", ");
    let text_paramm = this.buildParam(split_text);
    text_paramm.then(
      (res) => {
        this.loadWorkouts(res);
      });
  }

  async loadWorkouts(parameters: string, event?: InfiniteScrollCustomEvent) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.workouts = [];

    this.searchService.getMuscleWorkouts(parameters).subscribe(
      (res) => {
        loading.dismiss();
        if(res.length == 1) {this.workouts.push(res[0].name);}
        else {
          for (let i = 0; i < 10; i++)
            this.workouts.push(res[i].name);
        }
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }

//   async searchbarChange(input: any){
//     //console.log(content.detail.value)
//     this.loadWorkouts(input.detail.value); // The parameters
//   }

//returns a string that can be plugged into the URL
  async buildParam(text: string[]){
    let type_bool = false;
    let diff_bool = false;
    let muscle_bool = false;
    let text_param = "";

    if(text.length == 1) {return "name=" + text[0];}
    else {
      for(let x = 0; x < text.length; x++)
      {
        if(this.typeParam.includes(text[x]) && type_bool == false) {
          type_bool = true;
          text_param += "type=" + text[x];}
        if(this.muscleParam.includes(text[x]) && muscle_bool == false) {
          muscle_bool = true;
          text_param += "muscle=" + text[x];}
        if(this.difficultyParam.includes(text[x]) && diff_bool == false) {
          diff_bool = true;
          text_param += "difficulty=" + text[x];}
        if(text[x] == "olympic weightlifting") {
          type_bool = true;
          text_param += "type=olympic_weightlifting";}
        if(text[x] == "lower back") {
          muscle_bool = true;
          text_param += "muscle=lower_back";}
        if(text[x] == "middle back") {
          muscle_bool = true;
          text_param += "muscle=middle_back";}

        if (text_param != "") {text_param += "&";}
      }
      return text_param;}
  }

  async getWeatherData(){
    this.searchService.getWeatherData('latitude=33.67&longitude=-117.82&hourly=temperature_2m,apparent_temperature&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=America%2FLos_Angeles').subscribe(
    (inf) => {
      let latest_app_temp_index = inf.hourly.apparent_temperature.length-1;
      this.currentWeather = inf.hourly.apparent_temperature[latest_app_temp_index];
    }
    );
  }

// calls the modal that presents the workout description
  async initWorkoutDescription(name: string) {

    this.searchService.testPreferences();

    let param = 'name=' + name; //'name=' + name of workout

    this.searchService.getMuscleWorkouts(param).subscribe(
      async (res) => {

        const desc_modal = await this.modalCtrl.create({
          component: DescriptionPage,

          componentProps: {
            workoutName: name,
            workoutType: res[0].type,
            workoutMuscle: res[0].muscle,
            workoutEquipment: res[0].equipment,
            workoutDifficulty: res[0].difficulty,
            workoutInstruction: res[0].instructions}
          });

        desc_modal.onDidDismiss().then((modalDataResponse) => {
        });

        return await desc_modal.present();
    });
  }
}
