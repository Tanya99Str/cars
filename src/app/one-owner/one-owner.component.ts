import {Component, OnInit} from '@angular/core';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {ActivatedRoute, Router} from '@angular/router';
import {ICarOwnersService} from '../shared/service/ICar.owners.service';
import {OwnerEntity} from '../shared/models/owner-entity';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CarEntity} from '../shared/models/car-entity';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-one-owner',
  templateUrl: './one-owner.component.html',
  styleUrls: ['./one-owner.component.css']
})
export class OneOwnerComponent implements OnInit {

  ownerId: number;
  owner: OwnerEntity;
  owners: OwnerEntity[];
  ownerOld: OwnerEntity;
  ownerFormGroup: FormGroup;
  canEdit: boolean = false;
  isValid: boolean = false;
  type: 'EDIT' | 'REGISTRATION' | 'NONE' = 'NONE';

  constructor(private _activatedRoute: ActivatedRoute,
              private _iCarOwnersService: ICarOwnersService,
              private _formBuilder: FormBuilder,
              private _snackBar: MatSnackBar,
              public router: Router) {
    this._iCarOwnersService.getOwners().subscribe(next => {
      this.owners = next;
    }, error => {
      console.error(error);
    });
    _activatedRoute.queryParams.subscribe(value => {
      if ((isNotNullOrUndefined(value['owner_id'])) && parseInt(value['owner_id']) != this.ownerId) {
        this.canEdit = false;
        this.ownerId = parseInt(value['owner_id']);
        this.init();
        console.log(this.ownerId);
        console.log(this.canEdit);
      } else if ((isNotNullOrUndefined(value['edit_owner_id'])) && parseInt(value['edit_owner_id']) != this.ownerId) {
        this.canEdit = true;
        this.type = 'EDIT';
        this.ownerId = parseInt(value['edit_owner_id']);
        this.init();
        console.log(this.ownerId);
        console.log(this.canEdit);
      } else if (!isNotNullOrUndefined(value['owner_id']) && (!isNotNullOrUndefined(value['edit_owner_id']))) {
        this.canEdit = true;
        this.type = 'REGISTRATION';
        this.ownerId = null;
        // this.ownerFormGroup.reset();
        this.owner = new OwnerEntity();
        this.owner.aCars = [];
        this.owner.aCars[0] = new CarEntity();
        this.owner.aCars[0].id = this.genIdForCars(this.owner.aCars);
      }
    });

  }

  init() {
    this._iCarOwnersService.getOwnerById(this.ownerId).subscribe(next => {
      this.owner = next;
      this.ownerOld = Object.assign({}, next);
      this.ownerFormGroup.get('firstName').setValue(this.owner.aFirstName);
      this.ownerFormGroup.get('lastName').setValue(this.owner.aLastName);
      this.ownerFormGroup.get('middleName').setValue(this.owner.aMiddleName);
      if (!this.canEdit) {
        this.ownerFormGroup.disable();
      }
      console.log(this.owner);
      console.log(this.owner.aCars);
    }, error => {
      console.error(error);
    });
  }

  reset() {
    // this.owner = Object.assign({}, this.ownerOld);
    this.init();
    this.info('Зміни скасовано.');
    this.router.navigate(['/home']);
  }


  createUser() {
    this.owner.id = this.genId(this.owners);
    if (this.owner.aCars.length==0) {
      console.info('Введіть дані про транспортний засіб.');
      return;
    }
    if (this.ownerFormGroup.valid && this.owner.aCars.length > 0) {
      this._iCarOwnersService.createOwner(this.owner).subscribe(next => {
        this.router.navigate(['/home']);
        this.info('Дані збережено.');
      }, error => {
        console.error(error);
        this.info('Виникла помилка.');
      });
    }
  }

  addNewCar() {
    this.owner.aCars[this.owner.aCars.length] = new CarEntity();
    console.log(this.owner.aCars);
    return this.owner.aCars;

  }

  deleteValue(e: string) {
    this.ownerFormGroup.get(e).reset();
  }

  deleteUser() {
    this._iCarOwnersService.deleteOwner(this.ownerId).subscribe(next => {
      this.info('Користувача видалено.');
    }, error => {
      console.error(error);
      this.info('Вибачте, виникла помилка.');
    });
  }

  deleteCar(o: CarEntity) {
    this.owner.aCars = this.owner.aCars.filter(obj => {
      return obj.carNumber !== o.carNumber;
    });
  }

  addNewOwner() {
    if (this.owner.aCars.length == 0) {
      this.info('Заповніть, будь ласка, дані про автомобіль.');
      return;
    }
    this._iCarOwnersService.editOwner(this.owner).subscribe(next => {
      this.info('Дані успішно збережено!');
      this.router.navigate(['/home']);
      console.log(this.owner);
    }, error => {
      console.error(error);
      this.info('Виникла помилка.');
    });
  }

  setFormValue(name: string) {
    if (name === 'firstName') {
      let firstName = this.ownerFormGroup.get('firstName').value;
      if (!firstName) {
        this.ownerFormGroup.get('firstName').setErrors({required: true});
        return;
      }
      let mRe = new RegExp('([A-Za-z]|[A-Za-z-\?A-Za-z])');
      if (!mRe.exec(firstName)) {
        this.ownerFormGroup.get('firstName').setErrors({incorrect: true});
        return;
      } else {
        this.ownerFormGroup.get('firstName').setErrors(null);
      }
    }
    if (name === 'lastName') {
      let lastName = this.ownerFormGroup.get('lastName').value;
      if (!lastName) {
        this.ownerFormGroup.get('lastName').setErrors({required: true});
        return;
      }
      let mRe = new RegExp('([A-Za-z]|[A-Za-z-\?A-Za-z])');
      if (!mRe.exec(lastName)) {
        this.ownerFormGroup.get('lastName').setErrors({incorrect: true});
        return;
      } else {
        this.ownerFormGroup.get('lastName').setErrors(null);
      }
    }
    if (name === 'middleName') {
      let middleName = this.ownerFormGroup.get('middleName').value;
      if (!middleName) {
        this.ownerFormGroup.get('middleName').setErrors({required: true});
        return;
      }
      let mRe = new RegExp('[A-Za-z]');
      if (!mRe.exec(middleName)) {
        this.ownerFormGroup.get('middleName').setErrors({incorrect: true});
        return;
      } else {
        this.ownerFormGroup.get('middleName').setErrors(null);
      }
    }
    this.owner.aFirstName = this.ownerFormGroup.get('firstName').value;
    this.owner.aLastName = this.ownerFormGroup.get('lastName').value;
    this.owner.aMiddleName = this.ownerFormGroup.get('middleName').value;

  }

  edit() {
    if (this.owner.aCars.length == 0) {
      this.info('Заповніть, будь ласка, дані про автомобіль.');
      return;
    }
    this._iCarOwnersService.editOwner(this.owner).subscribe(next => {
      this.info('Дані успішно оновлено!');
      this.router.navigate(['/home']);
      console.log(this.owner);
    }, error => {
      console.error(error);
      this.info('Виникла помилка.');
    });
  }

  genId(users: OwnerEntity[]): number {
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 11;
  }

  genIdForCars(cars: CarEntity[]): number {
    return cars.length > 0 ? Math.max(...cars.map(car => car.id)) + 1 : 11;
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
    this.ownerFormGroup = this._formBuilder.group({
      firstName: new FormControl({value: this.owner ? this.owner.aFirstName : '', disabled: !this.canEdit}, Validators.required),
      lastName: new FormControl({value: this.owner ? this.owner.aLastName : '', disabled: !this.canEdit}, Validators.required),
      middleName: new FormControl({value: this.owner ? this.owner.aMiddleName : '', disabled: !this.canEdit}, Validators.required),
    });
  }

}
