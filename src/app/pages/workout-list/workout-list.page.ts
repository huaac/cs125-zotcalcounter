import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { WorkoutService } from 'src/app/services/workout.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.page.html',
  styleUrls: ['./workout-list.page.scss'],
})
export class WorkoutListPage implements OnInit {

  workouts = [];
  currentPage = 1;
  imageBaseUrl = environment.images; // no images atm...
 
  constructor(
    private workoutService: WorkoutService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadWorkouts("")
  }

  async loadWorkouts(parameters: string, event?: InfiniteScrollCustomEvent) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.workouts = [];
 
    this.workoutService.getMuscleWorkouts(parameters).subscribe(
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

}
