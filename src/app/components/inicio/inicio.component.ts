import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css','../general-style-components.css'],
})
export class InicioComponent implements OnInit {

  panelOpenState = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}