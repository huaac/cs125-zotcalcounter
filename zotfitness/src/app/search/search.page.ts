import { Component, OnInit } from '@angular/core';

import { SearchService } from 'src/app/service/search.service'; // added
import { Router } from '@angular/router'; //added

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor(private searchService: SearchService, private router:Router) { }

  ngOnInit() {
//     this.searchService.getMuscleWorkouts(); // on initialization of page, print bicep data
  }

  onSearchClick() {
    this.router.navigateByUrl('/history');
  }

}
