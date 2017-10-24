import { BaseEntity } from './../../shared';

export class Organizer implements BaseEntity {
    constructor(
        public id?: number,
        public participant?: string,
    ) {
    }
}
