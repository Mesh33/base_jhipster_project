import { Routes } from '@angular/router';
import { UserRouteAccessService } from '../../shared';

import { ParticipantCoursesComponent } from './participant-courses.component';

export const participantRoute: Routes = [
    {
        path: 'coureur',
        component: ParticipantCoursesComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Courses'
        },
        canActivate: [UserRouteAccessService]
    },
];
