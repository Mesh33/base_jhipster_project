import { BaseEntity } from './../../shared';

export const enum Specialite {
    'MEDECIN',
    'OUVREUR'
}

export class Volunteer implements BaseEntity {
    constructor(
        public id?: number,
        public username?: string,
        public specialite?: Specialite,
        public race?: BaseEntity,
    ) {
    }
}
