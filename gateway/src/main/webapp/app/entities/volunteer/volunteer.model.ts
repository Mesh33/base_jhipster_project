import { BaseEntity } from './../../shared';

export const enum Specialite {
    'MEDECIN',
    'OUVREUR'
}

export class Volunteer implements BaseEntity {
    constructor(
        public id?: number,
        public participant?: string,
        public specialite?: Specialite,
        public race?: BaseEntity,
    ) {
    }
}
