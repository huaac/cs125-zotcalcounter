import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router'; //added

@Component({
  imports: [IonicModule],
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  standalone: true,
})
export class HistoryComponent implements OnInit {
  myVariable: string = "0";
  @Output() myVariableChange = new EventEmitter<string>();

  myVariable2: number = 0;
  @Output() myVariable2Change = new EventEmitter<number>();
  myVariable2_1: number = 0;
  myVariable2_2: number = 0

  totalMinutes: number = 0;
  totalMinutes1: number = 0;
  totalMinutes2: number = 0;

  constructor(private router:Router) { }

  ngOnInit() {}

  onInputChange(event: any) {
    const inputValue: number = parseInt(event.target.value, 10);
    if (!isNaN(inputValue)) {
      this.myVariable = Math.round(inputValue * 60 / 31).toString();
      this.myVariableChange.emit(this.myVariable);
    }
  }
  
  onMyVariable2ButtonClick(inputValue: string) {
    const value: number = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      this.myVariable2_2 = this.myVariable2_1;
      this.myVariable2_1 = this.myVariable2;

      this.myVariable2 = value;
      this.myVariable2Change.emit(this.myVariable2);
      
      this.totalMinutes2 = this.totalMinutes1;
      this.totalMinutes1 = this.totalMinutes;
      this.updateTotalMinutes();
    }
  }
  
  updateTotalMinutes() {
    const myVariableNumber = parseInt(this.myVariable, 10);
    if (!isNaN(myVariableNumber)) {
      this.totalMinutes = parseFloat(((myVariableNumber * this.myVariable2) / 60).toFixed(1));
    }
  }
  
  
}
