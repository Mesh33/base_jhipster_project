import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { RaceComponent } from './race.component';
import { RaceDetailComponent } from './race-detail.component';
import { RaceDialogComponent} from './race-dialog.component';
import { RaceDeletePopupComponent } from './race-delete-dialog.component';
import { RaceNewComponent } from './race-new.component';

export const courseRoute: Routes = [
    {
        path: 'course',
        component: RaceComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Courses'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'course/:id',
        component: RaceDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Courses'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'course-new',
        component: RaceNewComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Courses'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const racePopupRoute: Routes = [
    {
        path: 'course-new-pop',
        component: RaceDialogComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Courses'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'course/:id/edit',
        component: RaceDialogComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Courses'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'course/:id/delete',
        component: RaceDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Courses'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
