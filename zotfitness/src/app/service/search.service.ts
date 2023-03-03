import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ApiResult {
  name: string;
  type: string;
  muscle: string;
  equipement: string;
  difficulty: string;
  instructions: string;
}


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http:HttpClient) { }

  //return sample data from calling baseURL in environments folder
  private sendRequestToExpressWorkout(endpoint: string):Observable<any> {
    let resp = this.http.get(`${environment.workoutBaseURL}${endpoint}`,
//       params: {muscle: 'biceps'},
      {headers: {'X-Api-Key': environment.apiKey}});
    return resp;
  }

  //prints sample data from url 'https://api.api-ninjas.com/v1/exercises?type=strength&muscle=biceps'
  //'muscle=biceps', type=strength&muscle=biceps
  getMuscleWorkouts(parameters: string):Observable<any>{
//     console.log(this.sendRequestToExpress('biceps'));
    //this.sendRequestToExpress('type=strength&muscle=biceps').subscribe(data => {
    //  console.log(data);
    //});
    return this.sendRequestToExpressWorkout(parameters);
  }

// gets data from weather website Mateo.com in environment folder
  private sendRequestToExpressWeather(endpoint: string):Observable<any> {
    let resp = this.http.get(`${environment.weatherBaseURL}${endpoint}`);
//       params: {muscle: 'biceps'},
//       {headers: {'X-Api-Key': environment.apiKey}});
    return resp;
  }

  // adds parameters to the weather base url for more specific information
  getWeatherData(parameters: string):Observable<any>{
    return this.sendRequestToExpressWeather(parameters);
  }

}

// "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m"

// import { Injectable } from '@angular/core';
//
// import { HttpClient } from '@angular/common/http'; //added {, HttpHeaders}
// import { environment } from 'src/environments/environment';
// import { Observable } from 'rxjs';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class SearchService {
//
//   constructor(private http:HttpClient) { }
//
//   //return sample data from calling baseURL in environments folder
//   private sendRequestToExpress(endpoint: string):Observable<any> {
//     let resp = this.http.get(`${environment.baseURL}${endpoint}`,
// //       params: {muscle: 'biceps'},
//       {headers: {'X-Api-Key': environment.apiKey}});
//     return resp;
//   }
//
//   //prints sample data from url 'https://api.api-ninjas.com/v1/exercises?type=strength&muscle=biceps'
//   //'muscle=biceps', type=strength&muscle=biceps
//   getMuscleWorkouts():void{
// //     console.log(this.sendRequestToExpress('biceps'));
//     this.sendRequestToExpress('type=strength&muscle=biceps').subscribe(data => {
//       console.log(data);
//     });
//   }
//
// }
