import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-nav-lateral',
  templateUrl: './nav-lateral.component.html',
  styleUrls: ['./nav-lateral.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class NavLateralComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
