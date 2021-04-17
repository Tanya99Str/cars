import {CarEntity} from './car-entity';

export class OwnerEntity {
  id: number;
  aFirstName: string;
  aLastName: string;
  aMiddleName: string;
  aCars: CarEntity[];
}
