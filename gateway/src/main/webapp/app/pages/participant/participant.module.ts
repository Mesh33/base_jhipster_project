import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from '../../shared';
import { CourseService } from '../courses/course.service';
import { ParticipantService } from '../../entities/participant/participant.service';
import { participantRoute } from './participant.route';
import { ParticipantCoursesComponent } from './participant-courses.component';

const ENTITY_STATES = [
    ...participantRoute,
];

@NgModule({
    imports: [
        GatewaySharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ParticipantCoursesComponent
    ],
    entryComponents: [
        ParticipantCoursesComponent
    ],
    providers: [
        CourseService,
        ParticipantService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayParticipantModule {}
