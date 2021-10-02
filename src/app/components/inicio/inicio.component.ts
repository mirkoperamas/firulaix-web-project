import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css','../general-style-components.css']
})
export class InicioComponent implements OnInit {

  panelOpenState = false;

  copy = '0xe16d271322273a77ba5748df4fd9209c4bea541f';
  
  constructor() { }

  ngOnInit(): void {
  }
}
