import { BaseEntity } from './../../shared';

export class Race implements BaseEntity {
    constructor(
        public id?: number,
        public place?: string,
        public date?: any,
    ) {
    }
}
