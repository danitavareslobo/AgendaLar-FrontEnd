import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'people',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'people',
    loadChildren: () => import('./modules/people/people.module').then(m => m.PeopleModule),
    canActivate: [ AuthGuardService ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
