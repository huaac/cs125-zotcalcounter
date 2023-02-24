import { Component, OnInit } from '@angular/core';
import * as readline from 'readline-sync';
import { Router } from '@angular/router'; //added

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}
}

//This code takes in two parameters: total workout minutes, daysoff, and prints out a monthly plan of workout minutes


const totalMinutes = Number(readline.question("Enter the total workout minutes for the month: "));
const offDays = readline.question("Enter the days off (separated by comma and space): ").split(", ");
const workDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].filter(day => !offDays.includes(day));
const dailyMinutes = Math.round(totalMinutes / workDays.length);

// Determine the number of days in the month, accounting for the days off
let daysInMonth = 31;
for (let day of offDays) {
  const index = workDays.indexOf(day);
  if (index >= 0) {
    workDays.splice(index, 1);
    daysInMonth--;
  }
}

// Initialize a dictionary to store the daily workout minutes
const schedule = {};
for (let day = 1; day <= daysInMonth; day++) {
  const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][(day - 1) % 7];
  if (workDays.includes(weekday)) {
    schedule[day] = [weekday, dailyMinutes];
  } else {
    schedule[day] = [weekday, 0];
  }
}

// Print out the month schedule of daily workout minutes
console.log("Month Schedule of Daily Workout Minutes:");
for (const [day, [weekday, minutes]] of Object.entries(schedule)) {
  console.log(`${day} ${weekday} : ${Math.round(minutes)} minutes`);
}
