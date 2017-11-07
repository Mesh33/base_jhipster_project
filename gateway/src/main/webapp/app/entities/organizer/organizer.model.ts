import { BaseEntity } from './../../shared';

export class Organizer implements BaseEntity {
    constructor(
        public id?: number,
        public username?: string,
        public organization?: string,
    ) {
    }
}
