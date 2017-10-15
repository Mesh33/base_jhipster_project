import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { RaceComponent } from './race.component';
import { RaceDetailComponent } from './race-detail.component';
import { RacePopupComponent } from './race-dialog.component';
import { RaceDeletePopupComponent } from './race-delete-dialog.component';

@Injectable()
export class RaceResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const raceRoute: Routes = [
    {
        path: 'race',
        component: RaceComponent,
        resolve: {
            'pagingParams': RaceResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Races'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'race/:id',
        component: RaceDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Races'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const racePopupRoute: Routes = [
    {
        path: 'race-new',
        component: RacePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Races'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'race/:id/edit',
        component: RacePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Races'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'race/:id/delete',
        component: RaceDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Races'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
