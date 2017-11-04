import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { RaceComponent } from './race.component';
import { RaceDetailComponent } from './race-detail.component';
import { RacePopupComponent } from './race-dialog.component';
import { RaceDeletePopupComponent } from './race-delete-dialog.component';

export const raceRoute: Routes = [
    {
        path: 'race',
        component: RaceComponent,
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
