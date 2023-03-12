import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';

export interface ApiResult {
  name: string;
  type: string;
  muscle: string;
  equipement: string;
  difficulty: string;
  instructions: string;
}

type workoutType = {
  type: string;
  muscle: string;
  difficulty: string;
};

type workoutReportType = {
  workout: workoutType;
  //duration: number;
  likeability: number;
};

type MapType = { 
  [id: string]: number; 
}

const lookUpTable: MapType = {'cardio': 0, 'olympic_weightlifting': 1, 'plyometrics': 2, 'powerlifting': 3, 'strength': 4, 'stretching': 5, 'strongman': 6,
'abdominals': 7, 'abductors': 8, 'adductors': 9, 'biceps': 10, 'calves': 11, 'chest': 12, 'forearms': 13, 'glutes': 14, 'hamstrings': 15, 'lats': 16,
'lower_back': 17, 'middle_back': 18, 'neck': 19, 'quadriceps': 20, 'traps': 21, 'triceps': 22, 'beginner': 23, 'intermediate': 24, 'expert': 25};

const Max = 10000;


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

// sets capacitor.Preferences based on a list of numbers
// keys are from 'a' ~ 'z'
  async setPreferences(preferences: number[]){
    for (let i = 0; i < 26; i++) {
      let p = 0;
      await Preferences.set({
        key: 'a' + i,
        value: preferences[i].toString()
      })
    }
    
  }

  /*
  setPreferences(preferences: number[]){
    for (let i = 0; i < 26; i++) {
      let p = 0;
      Preferences.set({
        key: 'a' + i,
        value: preferences[i].toString()
      })
    }
    
  }*/

  checkName = async (index: string) => {
    const { value } = await Preferences.get({ key: index });
    console.log(`Hello ${value}!`);
  };


  // gets the capacitor.Preferences in the format of a list of numbers
  async getPreferences(): Promise<number[]>{
    let preferences: number[] = [];
    for (let i = 0; i < 26; i++)
      preferences.push(Number((await Preferences.get({ key: 'a' + i })).value));
    return preferences;

  }
/*
  // gets the capacitor.Preferences in the format of a list of numbers
  getPreferences(): number[]{
    let preferences: number[] = [];
    for (let i = 0; i < 26; i++) {
      const { value } = await Preferences.get({ key: 'name' });
      Preferences.get({ key: 'a' + i }).then(res => {
        //preferences.push(Number(res.value));
        preferences.push(Number(res.value));
        console.log(Number(res.value), "I'm getting preferences here");
      });
    }

    console.log(typeof preferences, preferences.length, "Testing getGetPreferences");
    return preferences;

  }
  */

  

  async updatePreferencesWithworkoutHistory(workoutHistory: workoutReportType[]){
    let preferences = this.getPreferences();

    preferences.then(res => {
      for (let workout of workoutHistory) {
        res[lookUpTable[workout.workout.type]] += workout.likeability; // * workout.duration
        res[lookUpTable[workout.workout.muscle]] += workout.likeability; // * workout.duration
        res[lookUpTable[workout.workout.difficulty]] += workout.likeability; // * workout.duration
      }

      // Maybe also normalize the values if they are too large.

      console.log(res);

      this.setPreferences(res);

      console.log(this.getPreferences(), "Inside the function");
    });

  }
  
/*
  updatePreferencesWithworkoutHistory(workoutHistory: workoutReportType[]){
    let preferences: number[] = [];
    preferences = this.getPreferences();
    console.log(this.getPreferences().length, "Testing length");
    console.log(this.getPreferences(), "Not using a let");
    console.log(preferences, "Using a let");
    for (let workout of workoutHistory) {
      preferences[lookUpTable[workout.workout.type]] += workout.likeability; // * workout.duration
      preferences[lookUpTable[workout.workout.muscle]] += workout.likeability; // * workout.duration
      preferences[lookUpTable[workout.workout.difficulty]] += workout.likeability; // * workout.duration
    }

      // Maybe also normalize the values if they are too large.

      console.log(preferences, "Inside the function 1");

      this.setPreferences(preferences);

      console.log(this.getPreferences(), "Inside the function 2");
  }
*/

// This is a helper function that gives cardio workouts more weights if the weather is good (true)
  ModifyPreferencesWithWeather(weather: boolean, preferences: number[]): number[] {
    if (weather = true)
      preferences[0] += 10; // I'm not sure if it is reasonable at the moment.
    return preferences;
  }

// I copied https://stackoverflow.com/questions/51362252/javascript-cosine-similarity-function
  cosineSimilarity(A: number[], B: number[]): number {
    var dotproduct=0;
    var mA=0;
    var mB=0;
    for(let i = 0; i < 26; i++){
        dotproduct += (A[i] * B[i]);
        mA += (A[i]*A[i]);
        mB += (B[i]*B[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = (dotproduct)/((mA)*(mB))
    return similarity;
  }

// Uses best match algorithm to get top K workouts (returning their indexes)
// workoutList is a list of the names of all 
// If weather is good, then weather = true
  async bestMatch(workoutList: workoutType[], weather: boolean, K: number): Promise<number[]> {
    let workoutListVector: number[][] = [];

    // Create a vector for the workout list.
    for (let i = 0; i < workoutList.length; i++){
      workoutListVector.push([]);
      for (let j = 0; j < 26; j++)
        workoutListVector[i].push(0);
      workoutListVector[i][lookUpTable[workoutList[i].type]] = Max;
      workoutListVector[i][lookUpTable[workoutList[i].muscle]] = Max;
      workoutListVector[i][lookUpTable[workoutList[i].difficulty]] = Max;

      // also push the index to make sorting easier.
      workoutListVector[i].push(i);
    }

    // Get the vector of the user preferences.
    let preferences = this.getPreferences();
    let result: number[] = [];

    preferences.then(res => {
      res = this.ModifyPreferencesWithWeather(weather, res);
      
      // sort the workoutListVector based on similarity with the preferences vector
      let sorted: number[][] = workoutListVector.sort((x, y) => this.cosineSimilarity(y, res) - this.cosineSimilarity(x, res));
      for (let i = 0; i < K; i++)
        result.push(sorted[i][26]);
    });

    return result;

  }
  
/*
  // Uses best match algorithm to get top K workouts (returning their indexes)
// workoutList is a list of the names of all 
// If weather is good, then weather = true
bestMatch(workoutList: workoutType[], weather: boolean, K: number): number[]{
  let workoutListVector: number[][] = [];

  // Create a vector for the workout list.
  for (let i = 0; i < workoutList.length; i++){
    workoutListVector.push([]);
    for (let j = 0; j < 26; j++)
      workoutListVector[i].push(0);
    workoutListVector[i][lookUpTable[workoutList[i].type]] = Max;
    workoutListVector[i][lookUpTable[workoutList[i].muscle]] = Max;
    workoutListVector[i][lookUpTable[workoutList[i].difficulty]] = Max;

    // also push the index to make sorting easier.
    workoutListVector[i].push(i);
  }

  // Get the vector of the user preferences.
  let preferences = this.getPreferences();
  let result: number[] = [];

    preferences = this.ModifyPreferencesWithWeather(weather, preferences);
    
    // sort the workoutListVector based on similarity with the preferences vector
    let sorted: number[][] = workoutListVector.sort((x, y) => this.cosineSimilarity(y, preferences) - this.cosineSimilarity(x, preferences));
    for (let i = 0; i < K; i++)
      result.push(sorted[i][26]);

  return result;

}*/
  

  testPreferences(){
    let random: number[] = [];
    for (let i = 0; i < 26; i++)
      random[i] = 26 - i;
    this.setPreferences(random);
    //console.log(this.getPreferences());

    
    let workoutHistory: workoutReportType[] = [];
    workoutHistory.push({workout: {type: 'cardio', muscle: 'abdominals', difficulty: 'beginner'}, likeability: 5});
    workoutHistory.push({workout: {type: 'plyometrics', muscle: 'chest', difficulty: 'intermediate'}, likeability: 4});
    workoutHistory.push({workout: {type: 'strongman', muscle: 'chest', difficulty: 'intermediate'}, likeability: 3});
    workoutHistory.push({workout: {type: 'stretching', muscle: 'neck', difficulty: 'expert'}, likeability: 2});
    workoutHistory.push({workout: {type: 'stretching', muscle: 'lats', difficulty: 'intermediate'}, likeability: 1});

    console.log("I'm calling the function.");
    this.updatePreferencesWithworkoutHistory(workoutHistory);
    console.log(this.getPreferences(), "outside the function");
    
    
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
