import { Component, OnInit } from '@angular/core';

import { SearchService } from 'src/app/service/search.service'; // added
import { Router } from '@angular/router'; //added
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular'; //added


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  workouts: string[] = [];
  currentPage = 1;
//   imageBaseUrl = environment.images; // no images atm...

  constructor(private searchService: SearchService, private router:Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
//     this.searchService.getMuscleWorkouts(); // on initialization of page, print bicep data
  this.loadWorkouts("")
  }

  onSearchClick() {
    this.router.navigateByUrl('/history');
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

}
