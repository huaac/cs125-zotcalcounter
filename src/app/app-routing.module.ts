import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{
    //path: 'home',
    //loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  //},
  {
    path: '',
    redirectTo: 'workout-list',
    pathMatch: 'full'
  },
  {
    path: 'workout-list',
    loadChildren: () => import('./pages/workout-list/workout-list.module').then( m => m.WorkoutListPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
