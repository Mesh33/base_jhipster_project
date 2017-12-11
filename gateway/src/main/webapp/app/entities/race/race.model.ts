import { BaseEntity } from './../../shared';

export const enum RaceType {
    'MARATHON',
    'SKI'
}

export class Race implements BaseEntity {
    constructor(
        public id?: number,
        public date?: any,
        public place?: string,
        public price?: number,
        public department?: string,
        public raceName?: string,
        public raceType?: RaceType,
        public organisateur?: string,
        public organizer?: BaseEntity,
        public participants?: BaseEntity[],
        public volunteers?: BaseEntity[],
    ) {
    }
}
