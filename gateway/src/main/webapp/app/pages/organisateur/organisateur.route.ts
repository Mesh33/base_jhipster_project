import {Routes} from '@angular/router';
import { UserRouteAccessService } from '../../shared';

import { OrganisateurComponent } from './organisateur.component';
import { CourseEditionComponent } from './course-edition.component';

export const organisateurRoute: Routes = [
    {
        path: 'organisateur',
        component: OrganisateurComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Courses'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'organisateur/edition/:id',
        component: CourseEditionComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Courses'
        },
        canActivate: [UserRouteAccessService]
    },
];
