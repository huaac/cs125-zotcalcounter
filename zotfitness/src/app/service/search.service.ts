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

export type workoutType = {
  type: string;
  muscle: string;
  difficulty: string;
};

export type workoutReportType = {
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

const workoutParameters: string[] = ['cardio', 'olympic_weightlifting', 'plyometrics', 'powerlifting', 'strength', 'stretching', 'strongman', 'abdominals',
'abductors', 'adductors', 'biceps', 'calves', 'chest', 'forearms', 'glutes', 'hamstrings', 'lats', 'lower_back', 'middle_back', 'neck', 'quadriceps', 
'traps', 'triceps', 'beginner', 'intermediate', 'expert'];

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
  
  async setPreferences(preferences: number[]){
    for (let i = 0; i < 26; i++) {
      let p = 0;
      await Preferences.set({
        key: 'a' + i,
        value: preferences[i].toString()
      })
    }
  }


  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  // gets the capacitor.Preferences in the format of a list of numbers
  async getPreferences(): Promise<number[]>{
    let preferences: number[] = [];
    for (let i = 0; i < 26; i++) {
      Preferences.get({ key: 'a' + i }).then(res => {
        preferences.push(Number(res.value));
        //console.log(Number(res.value), "I'm getting preferences here");
      });
    }

    return preferences;

  }
  

  async updatePreferencesWithworkoutHistory(workoutHistory: workoutReportType){
    let preferences: number[] = [];

      await this.getPreferences().then(res => {preferences = res});
      //console.log('before delay')

        preferences[lookUpTable[workoutHistory.workout.type]] += workoutHistory.likeability; // * workout.duration
        preferences[lookUpTable[workoutHistory.workout.muscle]] += workoutHistory.likeability; // * workout.duration
        preferences[lookUpTable[workoutHistory.workout.difficulty]] += workoutHistory.likeability; // * workout.duration
      //console.log('after delay');

      //console.log(preferences, "Inside the function 1");

      await this.setPreferences(preferences);

      //console.log(this.getPreferences(), "Inside the function 2");

      // Maybe also normalize the values if they are too large.
  }


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
async bestMatch(weather: boolean, K: number): Promise<string[]>{
  let workoutListVector: number[][] = [];
  let workoutList: ApiResult[] = [];

  let workoutListlength: number = 0;
  await Preferences.get({ key: "workoutListLength"}).then(res => {workoutListlength = Number(res.value)});

  // generate the workoutList
  for (let i = 0; i < workoutListlength; i++) {
    let name: string = '', type: string = '', muscle: string = '', equipement: string = '', difficulty: string = '', instructions: string = '';
    await Preferences.get({ key: (i * 6 + 0).toString()}).then(res => {if (res.value != null) name = res.value});
    await Preferences.get({ key: (i * 6 + 1).toString()}).then(res => {if (res.value != null) type = res.value});
    await Preferences.get({ key: (i * 6 + 2).toString()}).then(res => {if (res.value != null) muscle = res.value});
    await Preferences.get({ key: (i * 6 + 3).toString()}).then(res => {if (res.value != null) equipement = res.value});
    await Preferences.get({ key: (i * 6 + 4).toString()}).then(res => {if (res.value != null) difficulty = res.value});
    await Preferences.get({ key: (i * 6 + 5).toString()}).then(res => {if (res.value != null) instructions = res.value});

    workoutList.push({"name": name, "type": type, "muscle": muscle, "equipement": equipement, "difficulty": difficulty, "instructions": instructions});
  }

  // Create a vector for the workout list.
  for (let i = 0; i < workoutList.length; i++){
    workoutListVector.push([]);
    for (let j = 0; j < 26; j++)
      workoutListVector[i].push(0);
    workoutListVector[i][lookUpTable[workoutList[i].type]] = Max;
    workoutListVector[i][lookUpTable[workoutList[i].muscle]] = Max;
    workoutListVector[i][lookUpTable[workoutList[i].difficulty]] = Max;

    // also push the name to make sorting easier.
    workoutListVector[i].push(i);
  }

  let preferences = await this.getPreferences();

  await this.delay(1000);

  // Get the vector of the user preferences.
  let result: string[] = [];

  preferences = this.ModifyPreferencesWithWeather(weather, preferences);
  
  // sort the workoutListVector based on similarity with the preferences vector
  let sorted: number[][] = workoutListVector.sort((x, y) => this.cosineSimilarity(y, preferences) - this.cosineSimilarity(x, preferences));
  for (let i = 0; i < K; i++)
    await Preferences.get({ key: (sorted[i][26] * 6 + 0).toString()}).then(res => {if (res.value != null) result.push(res.value)});

  return result;
  
}

// Find a list of all workouts.
async getAllWorkouts() {
  let workoutList: ApiResult[] = [];

  // Find brute force all tag combinations.
  for (let i = 0; i < 7; i++) // 7
    for (let j = 7; j < 23; j++) // 23
      for (let k = 23; k < 26; k++) { // 26
        await this.delay(100);
        this.getMuscleWorkouts("type=" + workoutParameters[i] + "&muscle=" + workoutParameters[j] + "&difficulty=" + workoutParameters[k]).subscribe(
           (res) => {
             // for all of the results
            for (let l = 0; l < res.length; l++) {
              // for some wierd reasons there can be repeated workouts...
              let repeated: boolean = false;
              for (let m = 0; m < workoutList.length; m++)
                if (res[l].name === workoutList[m].name)
                  repeated = true;
              if (repeated) continue;

              let cur: ApiResult = {"name": res[l].name, "type": res[l].type, "muscle": res[l].muscle, "equipement": res[l].equipement,
               "difficulty": res[l].difficulty, "instructions": res[l].instructions};
              workoutList.push(cur);
            }
            
           },
           (err) => {
           console.log(err);
          }
         );
       }
  
  // set everything inside the preferences.
  for (let i = 0; i < workoutList.length; i++) {
    Preferences.set({
      key: (i * 6 + 0).toString(),
      value: workoutList[i].name
    })

    Preferences.set({
      key: (i * 6 + 1).toString(),
      value: workoutList[i].type
    })

    Preferences.set({
      key: (i * 6 + 2).toString(),
      value: workoutList[i].muscle
    })

    Preferences.set({
      key: (i * 6 + 3).toString(),
      value: workoutList[i].equipement
    })

    Preferences.set({
      key: (i * 6 + 4).toString(),
      value: workoutList[i].difficulty
    })

    Preferences.set({
      key: (i * 6 + 5).toString(),
      value: workoutList[i].instructions
    })

  }

  // also set the length of workoutList
  Preferences.set({
    key: "workoutListLength",
    value: workoutList.length.toString()
  })
    
  
}

  async testPreferences(){
    let random: number[] = [];
    for (let i = 0; i < 26; i++)
      random[i] = 26 - i;
    await this.setPreferences(random);
    console.log(await this.getPreferences());

    let workoutHistory: workoutReportType[] = [];
    workoutHistory.push({workout: {type: 'cardio', muscle: 'abdominals', difficulty: 'beginner'}, likeability: 5});
    workoutHistory.push({workout: {type: 'plyometrics', muscle: 'chest', difficulty: 'intermediate'}, likeability: 4});
    workoutHistory.push({workout: {type: 'strongman', muscle: 'chest', difficulty: 'intermediate'}, likeability: 3});
    workoutHistory.push({workout: {type: 'stretching', muscle: 'neck', difficulty: 'expert'}, likeability: 2});
    workoutHistory.push({workout: {type: 'stretching', muscle: 'lats', difficulty: 'intermediate'}, likeability: 1});
      
    console.log("I'm calling the function.");
    await this.updatePreferencesWithworkoutHistory(workoutHistory[0]);
    await this.updatePreferencesWithworkoutHistory(workoutHistory[1]);
    await this.updatePreferencesWithworkoutHistory(workoutHistory[2]);
    await this.updatePreferencesWithworkoutHistory(workoutHistory[3]);
    await this.updatePreferencesWithworkoutHistory(workoutHistory[4]);

    console.log(await this.getPreferences(), "outside the function");
    
    this.getAllWorkouts();
    await this.bestMatch(true, 10).then(res => {console.log(res)});


    
    
    
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
