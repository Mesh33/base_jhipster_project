import {Routes} from '@angular/router';
import { UserRouteAccessService } from '../../shared';

import { CourseComponent } from './course.component';

export const courseRoute: Routes = [
    {
        path: 'course',
        component: CourseComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Courses'
        },
        // canActivate: [UserRouteAccessService]
    }
];
