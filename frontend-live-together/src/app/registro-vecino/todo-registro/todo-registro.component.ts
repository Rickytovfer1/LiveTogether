import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-todo-registro',
    templateUrl: './todo-registro.component.html',
    styleUrls: ['./todo-registro.component.scss'],
    standalone: true,
    imports: [
        IonicModule
    ]
})
export class TodoRegistroComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
