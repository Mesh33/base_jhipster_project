import {Routes} from '@angular/router';
import { UserRouteAccessService } from '../../shared';

import { CourseComponent } from './course.component';
import { CourseNewComponent } from './course-new.component';

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
    }
];
