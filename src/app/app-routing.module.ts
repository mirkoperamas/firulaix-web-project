import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdquiereComponent } from './components/adquiere/adquiere.component' ;
import { ColaborarComponent } from './components/colaborar/colaborar.component';
import  { InicioComponent } from './components/inicio/inicio.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: 'adquiere',
    component: AdquiereComponent
  },
  {
    path: 'colaborar',
    component: ColaborarComponent
  },
  {
    path: 'inicio',
    component: InicioComponent
  }

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
