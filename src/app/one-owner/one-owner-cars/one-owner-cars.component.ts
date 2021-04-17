import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CarEntity} from '../../shared/models/car-entity';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {OwnerEntity} from '../../shared/models/owner-entity';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ICarOwnersService} from '../../shared/service/ICar.owners.service';
import * as moment from 'moment';

@Component({
  selector: 'app-one-owner-cars',
  templateUrl: './one-owner-cars.component.html',
  styleUrls: ['./one-owner-cars.component.css']
})
export class OneOwnerCarsComponent implements OnInit {

  carFormGroup: FormGroup;
  @Input() car: CarEntity;
  @Input() canEdit: boolean;
  ownerId: number;
  owner: OwnerEntity;
  @Output() onDelete = new EventEmitter();
  @Output() isValid = new EventEmitter();
  actualYear: number;
  minYear: number = 1990;
  users: OwnerEntity[];

  constructor(private _formBuilder: FormBuilder,
              private _activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar,
              private _iCarOwnersService: ICarOwnersService) {
    _activatedRoute.queryParams.subscribe(value => {
      if ((isNotNullOrUndefined(value['owner_id'])) && parseInt(value['owner_id']) != this.ownerId) {
        // this.canEdit = false;
        this.ownerId = parseInt(value['owner_id']);
        this.init();
        console.log(this.ownerId);
        console.log(this.canEdit);
      }
      if ((isNotNullOrUndefined(value['edit_owner_id'])) && parseInt(value['edit_owner_id']) != this.ownerId) {
        // this.canEdit = true;
        this.ownerId = parseInt(value['edit_owner_id']);
        this.init();
        console.log(this.ownerId);
        console.log(this.canEdit);
      } else if (!isNotNullOrUndefined(value['owner_id']) && (!isNotNullOrUndefined(value['owner_id']))) {
        // this.canEdit = false;
        this.ownerId = null;
        this.owner = new OwnerEntity();
        this.owner.aCars = []
        this.owner.aCars[0] = new CarEntity();
      }
    });
    this.actualYear = moment().year();
    this._iCarOwnersService.getOwners().subscribe(next =>{
      this.users = next;
      console.log(this.users);
    }, error => {
      console.error(error);
    });

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

  deleteCar(o) {
    this.onDelete.emit(o);
  }

  init() {
    if (this.ownerId) {
      this._iCarOwnersService.getOwnerById(this.ownerId).subscribe(next => {
        this.owner = next;
      }, error => {
        console.error(error);
      });
    }
  }

  edit() {
    this.canEdit = true;
  }

  deleteValue(e: string) {
    this.carFormGroup.get(e).reset();
  }

  setFormValue(name: string) {
    if (name === 'carNumber') {
      let carNumber = this.carFormGroup.get('carNumber').value;
      if (!carNumber) {
        this.carFormGroup.get('manufacturerName').setErrors({required: true});
        return;
      }
      let mRe = new RegExp('[A-Z][A-Z][0-9][0-9][0-9][0-9][A-Z][A-Z]$');
      if (!mRe.exec(carNumber)) {
        console.log('incorrect');
        this.carFormGroup.get('carNumber').setErrors({incorrect: true});
        return;
      } else {
        this.carFormGroup.get('carNumber').setErrors(null);
      }
    }
    if (name === 'manufacturerName') {
      let manufacturerName = this.carFormGroup.get('manufacturerName').value;
      if (!manufacturerName) {
        this.carFormGroup.get('manufacturerName').setErrors({required: true});
        return;
      } else {
        this.carFormGroup.get('manufacturerName').setErrors(null);
      }
    }
    if (name === 'model') {
      let model = this.carFormGroup.get('model').value;
      if (!model) {
        this.carFormGroup.get('model').setErrors({required: true});
        return;
      } else {
        this.carFormGroup.get('model').setErrors(null);
      }
    }
    if (name === 'year') {
      let year = this.carFormGroup.get('year').value;
      if (!year) {
        this.carFormGroup.get('year').setErrors({required: true});
        return;
      }
      if (year > this.actualYear || year < this.minYear) {
        this.carFormGroup.get('year').setErrors({incorrect: true});
        return;
      } else {
        this.carFormGroup.get('year').setErrors(null);
      }
    }
    console.log(this.car.id);
    if (!this.car.id) {
      this.car.id = this.genId(this.owner.aCars);
      console.log(this.car.id);
    }
    this.car.carNumber = this.carFormGroup.get('carNumber').value;
    this.car.manufacturerName = this.carFormGroup.get('manufacturerName').value;
    this.car.model = this.carFormGroup.get('model').value;
    this.car.year = this.carFormGroup.get('year').value;
    this.validatorCar(this.carFormGroup);
    this.checkIsInArray();
    console.log(this.car);
    console.log(this.car.carNumber);
    this.validatorCar(this.carFormGroup);

  }

  checkIsInArray() {
    let carNumber = this.car.carNumber;
    this.carFormGroup.get('carNumber').setErrors(null);
    if (this.owner && this.owner.aCars) {
      this.users.forEach(value => {
        value.aCars.forEach(el => {
          if (el.carNumber === carNumber) {
            let indexEl = value.aCars.indexOf(el);
            let indexCar = this.owner.aCars.indexOf(this.car);
            console.log(indexEl);
            console.log(indexCar);
            console.log(indexEl === indexCar);
            if (indexEl !== indexCar) {
              this.carFormGroup.get('carNumber').setErrors({registeredByAnotherUser: true});
              console.log(indexEl != indexCar);
              return;
            } else {
              this.carFormGroup.get('carNumber').setErrors(null);
              return;
            }
          }
          return;
        });
      });
      this.owner.aCars.forEach(el => {
        if (el.carNumber === carNumber) {
          let indexEl = this.owner.aCars.indexOf(el);
          let indexCar = this.owner.aCars.indexOf(this.car);
          console.log(indexEl);
          console.log(indexCar);
          console.log(indexEl === indexCar);
          if (indexEl !== indexCar) {
            // return;
            this.carFormGroup.get('carNumber').setErrors({existCarNumber: true});
            console.log(indexEl != indexCar);
            return;
          } else {
            this.carFormGroup.get('carNumber').setErrors(null);
            return;
          }
        }
        return;
      });
    }
  }

  validatorCar(control: AbstractControl) {

    let carNumber: string = control.get('carNumber').value;
    let manufacturerName: string = control.get('manufacturerName').value;
    let model: string = control.get('model').value;
    let year: string = control.get('year').value;
    if (!carNumber) {
      control.get('carNumber').setErrors({required: true});
      return;
    }

    if (!carNumber || !manufacturerName || !model || !year) {
      if (!carNumber) {
        control.get('carNumber').setErrors({required: true});
      }
      if (!manufacturerName) {
        control.get('manufacturerName').setErrors({required: true});
      }
      if (!model) {
        control.get('model').setErrors({required: true});
      }
      if (!year) {
        control.get('year').setErrors({required: true});
      }
      return;
    } else {
      control.get('carNumber').setErrors(null);
      control.get('manufacturerName').setErrors(null);
      control.get('model').setErrors(null);
      control.get('year').setErrors(null);
    }

    if (carNumber) {
      let mRe = new RegExp('[A-Z][A-Z][0-9][0-9][0-9][0-9][A-Z][A-Z]$');
      if (!mRe.exec(carNumber)) {
        console.log('incorrect');
        control.get('carNumber').setErrors({incorrect: true});
        return;
      } else {
        control.get('carNumber').setErrors(null);
      }
    }
  }

  genId(cars: CarEntity[]): number {
    if (cars) {
      return cars.length > 0 ? Math.max(...cars.map(car => car.id)) + 1 : 11;
    } else {
      return 1;
    }
  }

  ngOnInit(): void {
    this.carFormGroup = this._formBuilder.group({
      carNumber: new FormControl({value: this.car ? this.car.carNumber : '', disabled: !this.canEdit}, Validators.required),
      manufacturerName: new FormControl({value: this.car ? this.car.manufacturerName : '', disabled: !this.canEdit}, Validators.required),
      model: new FormControl({value: this.car ? this.car.model : '', disabled: !this.canEdit}, Validators.required),
      year: new FormControl({value: this.car ? this.car.year : '', disabled: !this.canEdit}, Validators.required),
    });
    if (!this.canEdit) {
      this.carFormGroup.disable();
    }
  }


}
