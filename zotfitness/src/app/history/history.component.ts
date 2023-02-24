import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router'; //added

@Component({
  imports: [IonicModule],
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}

}
