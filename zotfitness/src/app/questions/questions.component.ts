import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Router } from '@angular/router'; //added

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}

  onQuestionsClick() {
    this.router.navigateByUrl('/search');
  }
}
