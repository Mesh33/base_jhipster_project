import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { VolunteerComponent } from './volunteer.component';
import { VolunteerDetailComponent } from './volunteer-detail.component';
import { VolunteerPopupComponent } from './volunteer-dialog.component';
import { VolunteerDeletePopupComponent } from './volunteer-delete-dialog.component';

export const volunteerRoute: Routes = [
    {
        path: 'volunteer',
        component: VolunteerComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Volunteers'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'volunteer/:id',
        component: VolunteerDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Volunteers'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const volunteerPopupRoute: Routes = [
    {
        path: 'volunteer-new',
        component: VolunteerPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Volunteers'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'volunteer/:id/edit',
        component: VolunteerPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Volunteers'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'volunteer/:id/delete',
        component: VolunteerDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Volunteers'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
