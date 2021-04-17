import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {OwnerEntity} from '../models/owner-entity';
import {catchError} from 'rxjs/operators';
import {CarEntity} from '../models/car-entity';

@Injectable({providedIn: 'root'})

export class ICarOwnersService {

  SERVER_URL: string = 'http://localhost:8080/api/';

  constructor(private _http: HttpClient) {
  }

  getOwners(): Observable<OwnerEntity[]> {
    return this._http.get<OwnerEntity[]>(this.SERVER_URL + 'users')
      .pipe(catchError(err => throwError(err)));
  }

  getOwnerById(aId: number): Observable<OwnerEntity> {
    return this._http.get<OwnerEntity>(`${this.SERVER_URL + 'users'}/${aId}`)
      .pipe(catchError(err => throwError(err)));
  }

  createOwner(owner: OwnerEntity): Observable<OwnerEntity> {
    return this._http.post<OwnerEntity>(this.SERVER_URL+ 'users', owner)
      .pipe(catchError(err => throwError(err)));
  }

  deleteOwner(aOwnerId: number): Observable<OwnerEntity[]> {
    return this._http.delete<OwnerEntity[]>(`${this.SERVER_URL + 'users'}/${aOwnerId}`)
      .pipe(catchError(err => throwError(err)));
  }

  editOwner(aOwner: OwnerEntity): Observable<OwnerEntity> {
    return this._http.put<OwnerEntity>(`${this.SERVER_URL + 'users'}/${aOwner.id}`, aOwner)
      .pipe(catchError(err => throwError(err)));
  }

}


