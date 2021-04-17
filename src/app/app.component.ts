import { Component } from '@angular/core';
import {ICarOwnersService} from './shared/service/ICar.owners.service';
import {OwnerEntity} from './shared/models/owner-entity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cars';
}
