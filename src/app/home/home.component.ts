import { Component, OnInit } from '@angular/core';
import {OwnerEntity} from '../shared/models/owner-entity';
import {ICarOwnersService} from '../shared/service/ICar.owners.service';
import {CarEntity} from '../shared/models/car-entity';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  users: OwnerEntity[] = [];
  activeButton: boolean = false;
  selectedUserId: number;
  isValid: boolean = false;

  constructor(private _usersService: ICarOwnersService,
              private _iCarOwnersService: ICarOwnersService,
              private _snackBar: MatSnackBar) {
  this.init();
  }

  deleteUser() {
    this._iCarOwnersService.deleteOwner(this.selectedUserId).subscribe(next => {
      this.info('Користувача видалено.');
      this.activeButton = false;
      this.init();
    }, error => {
      console.error(error);
      this.info('Вибачте, виникла помилка.')
    });
  }

  init() {
    this._usersService.getOwners().subscribe(next =>{
      this.users = next;
      console.log(this.users);
    }, error => {
      console.error(error);
    });
  }

  selectUser(id: number) {
    this.selectedUserId = id;
    this.activeButton = true;
  }

  info(message: string) {
    this._snackBar.open(message, 'ок', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      announcementMessage: message,
      politeness: 'polite',
      direction: 'ltr'
    });
  }

  ngOnInit(): void {
  }

}
