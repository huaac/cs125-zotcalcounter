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

//   imageBaseUrl = environment.images; // no images atm...

  constructor(private searchService: SearchService, private router:Router, private loadingCtrl: LoadingController, public modalCtrl:ModalController) { }

  ngOnInit() {
//     this.searchService.getMuscleWorkouts(); // on initialization of page, print bicep data
    this.loadWorkouts("");
    this.getWeatherData();
  }

  onSearchClick() {
    this.router.navigateByUrl('/history');
  }

  onSearchClickTEST() { // REMOVE LATER
    this.router.navigateByUrl('/description');
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
        for (let i = 0; i < 10; i++)
          this.workouts.push(res[i].name);

      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }

  async searchbarChange(input: any){
    //console.log(content.detail.value)
    this.loadWorkouts(input.detail.value); // The parameters
  }

  async clear(){
    console.log("Hello World");
    //this.loadWorkouts(input.detail.value); // The parameters
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
