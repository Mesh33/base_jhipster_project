import { BaseEntity } from './../../shared';

export class Race implements BaseEntity {
    constructor(
        public id?: number,
        public date?: any,
        public place?: string,
        public price?: number,
        public organizer?: BaseEntity,
        public participants?: BaseEntity[],
        public volunteers?: BaseEntity[],
    ) {
    }
}
