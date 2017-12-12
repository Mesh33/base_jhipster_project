import {Routes} from '@angular/router';
import { UserRouteAccessService } from '../../shared';

import { CourseComponent } from './course.component';
import { CourseNewComponent } from './course-new.component';
import { CourseDetailComponent} from './course-detail.component';
import { InscriptionComponent} from './inscription.component';

export const courseRoute: Routes = [
    {
        path: 'course',
        component: CourseComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Courses'
        },
        // canActivate: [UserRouteAccessService]
    },
    {
        path: 'new-course',
        component: CourseNewComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Organiser une course'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'course/:id',
        component: CourseDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Races'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'course/:id/inscription',
        component: InscriptionComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Races'
        },
        canActivate: [UserRouteAccessService]
    }
];
