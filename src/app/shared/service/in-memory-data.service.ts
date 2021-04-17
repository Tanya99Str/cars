import {InMemoryDbService} from 'angular-in-memory-web-api';
import {Injectable} from '@angular/core';
import {OwnerEntity} from '../models/owner-entity';

@Injectable({
  providedIn: 'root'
})

export class InMemoryDataService implements InMemoryDbService {
  constructor() { }

  createDb() {
    let  users =  [
      {  id:  1,  aFirstName: 'Наталья', aLastName: 'Петрова', aMiddleName: 'Игоревне',
        aCars: [
        {id: 1, carNumber: 'AX1111HP', manufacturerName: 'Nissan', model: 'Nissan Qashqai', year: '2008'},
        {id: 2, carNumber: 'AA2222AA', manufacturerName: 'Mazda', model: 'Mazda CX-5', year: '2020'}
      ]},
      {  id:  2,  aFirstName: 'Олег', aLastName: 'Степанов', aMiddleName: 'Игоревич',
        aCars: [
          {id: 1, carNumber: 'AZ1225DH', manufacturerName: 'Nissan', model: 'Nissan Qashqai', year: '2008'},
        ]},
      {  id:  3,  aFirstName: 'Олег', aLastName: 'Олегов', aMiddleName: 'Олегович',
        aCars: [
          {id: 1, carNumber: 'AA4587BB', manufacturerName: 'BMW', model: 'BMW X5', year: '2015'},
        ]},
      {  id:  4,  aFirstName: 'Олег', aLastName: 'Олегов', aMiddleName: 'Олегович',
        aCars: [
          {id: 1, carNumber: 'AA4587BB', manufacturerName: 'BMW', model: 'BMW X5', year: '2015'},
        ]},
    ];

    return {users};

  }

  genId(owners: OwnerEntity[]): number {
    return owners.length > 0 ? Math.max(...owners.map(owner => owner.id)) + 1 : 11;
  }
}
