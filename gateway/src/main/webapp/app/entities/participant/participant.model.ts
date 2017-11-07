import { BaseEntity } from './../../shared';

export class Participant implements BaseEntity {
    constructor(
        public id?: number,
        public username?: string,
        public preferedRace?: string,
        public race?: BaseEntity,
    ) {
    }
}
