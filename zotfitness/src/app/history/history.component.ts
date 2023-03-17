import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router'; //added
import { ModalController } from '@ionic/angular'; // added

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
  
  constructor(private router:Router, public modalCtrl:ModalController) { }

  ngOnInit() {}

  onInputChange(event: any) {
    const inputValue: number = parseInt(event.target.value, 10);
    if (!isNaN(inputValue)) {
      this.myVariable = Math.round(inputValue * 60 / 31).toString();
      this.myVariableChange.emit(this.myVariable);
    }
  }

  changePage(){
    this.router.navigateByUrl('/checkin');
  }
  
}
