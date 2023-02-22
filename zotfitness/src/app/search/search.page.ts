import { Component, OnInit } from '@angular/core';

import { SearchService } from 'src/app/service/search.service'; //added

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.searchService.getMuscleWorkouts(); // on initialization of page, print bicep data
  }

}
