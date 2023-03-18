import { Component, OnInit } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router'; //added
import { Preferences } from '@capacitor/preferences'; //added

type MapType = { 
  [id: string]: number; 
}

const lookUpTable: MapType = {'cardio': 0, 'olympic_weightlifting': 1, 'plyometrics': 2, 'powerlifting': 3, 'strength': 4, 'stretching': 5, 'strongman': 6,
'abdominals': 7, 'abductors': 8, 'adductors': 9, 'biceps': 10, 'calves': 11, 'chest': 12, 'forearms': 13, 'glutes': 14, 'hamstrings': 15, 'lats': 16,
'lower_back': 17, 'middle_back': 18, 'neck': 19, 'quadriceps': 20, 'traps': 21, 'triceps': 22, 'beginner': 23, 'intermediate': 24, 'expert': 25};

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {

  goalCategory:string = "";
  muscleCategory:string = "";

  public muscles:string[] = ["abdominals", "abductors", "adductors", "biceps", "calves", "chest", "forearms",
    "glutes", "hamstrings", "lats", "lowerback", "middleback", "neck", "quadriceps",
    "traps", "tripceps"];

  constructor(private router:Router) { }

  ngOnInit() {}

  onQuestionsClick() {
    this.setGoal();
    this.setMuscles();

    this.router.navigateByUrl('/search');

    //this.removeGoal();
    //this.removeMuscles();
  }

  // event handler that updates muscleCategory whenever user selects a muscle
  selectionMade(ev: Event){
    this.muscleCategory = (ev.target as HTMLInputElement).value;
  }

  // function that deletes stored goal
  removeGoal = async () => {
    await Preferences.remove({ key: 'goal' });
  };

  // function that deletes stored muscle
  removeMuscles = async () => {
    await Preferences.remove({ key: 'muscles' });
  };

  // function that sets goal
  setGoal = async () => {
  await Preferences.set({
    key: 'goal',
    value: this.goalCategory,
  });
  };

  // function that sets muscles 
  setMuscles = async () => {
  await Preferences.set({
    key: 'muscles',
    value: this.muscleCategory,
  }); // should I keep this?

  // For now I "set" instead of "add".
  for (let i = 0; i < this.muscleCategory.length; i++) {
    console.log(this.muscleCategory[i]);
    await Preferences.set({
      key: (-1 - lookUpTable[this.muscleCategory[i]]).toString(),
      value: (15).toString()
    });
  }
  

  };
}
