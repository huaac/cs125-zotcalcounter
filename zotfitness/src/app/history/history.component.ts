import { Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  imports: [IonicModule],
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  standalone: true,
})
export class HistoryComponent implements OnInit, OnDestroy {
  myVariable: string = "0";
  Duration: number = 0;
  Duration1: number = 0;
  Duration2: number = 0;
  Exercise: string = "0";
  Exercise1: string = "0";
  Exercise2: string = "0";
  Rating: string = "0";
  Rating1: string = "0";
  Rating2: string = "0";
  private checkInterval: any;
  @Output() myVariableChange = new EventEmitter<string>();

  constructor(private router: Router, public modalCtrl: ModalController) {}

  ngOnInit() {
    this.checkInterval = setInterval(() => {
      this.getCheckinDuration();
      this.getCheckinExercise();
      this.getCheckinRating();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.checkInterval);
  }

  onInputChange(event: any) {
    const inputValue: number = parseInt(event.target.value, 10);
    if (!isNaN(inputValue)) {
      this.myVariable = Math.round(inputValue * 60 / 31).toString();
      this.myVariableChange.emit(this.myVariable);
    }
  }

  changePage() {
    this.router.navigateByUrl('/checkin');
  }

  getCheckinDuration() {
    const value: number = Number(localStorage.getItem('CapacitorStorage.checkinDuration'));
    if (parseFloat((value/60).toFixed(1)) && parseFloat((value/60).toFixed(1)) !== this.Duration) {
      this.updateQueueValues();
      this.Duration = parseFloat((value/60).toFixed(1));
    }
  }

  getCheckinExercise() {
    const value = localStorage.getItem('CapacitorStorage.checkinExercise');
    this.Exercise = value ? value : "0";
  }

  getCheckinRating() {
    const value = localStorage.getItem('CapacitorStorage.checkinRating');
    this.Rating = value ? value : "0";
  }

  updateQueueValues() {
    this.Duration2 = this.Duration1;
    this.Duration1 = this.Duration;

    this.Exercise2 = this.Exercise1;
    this.Exercise1 = this.Exercise;

    this.Rating2 = this.Rating1;
    this.Rating1 = this.Rating;
  }
}
