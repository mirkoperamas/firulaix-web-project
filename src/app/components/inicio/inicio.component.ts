import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css','../general-style-components.css'],
})
export class InicioComponent implements OnInit {

  panelOpenState = false;
  
  constructor(private el: ElementRef) { }

  ngOnInit(): void {
  }


  status: boolean = false;
  
  clickEvent(){
    this.status = !this.status;       
  }

}
