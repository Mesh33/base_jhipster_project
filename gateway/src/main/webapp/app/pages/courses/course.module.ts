import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from '../../shared';
import {
    CourseService,
    CourseComponent,
    CourseNewComponent,
    CourseDetailComponent,
    courseRoute
} from './';

const ENTITY_STATES = [
    ...courseRoute,
];

@NgModule({
    imports: [
        GatewaySharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CourseComponent,
        CourseNewComponent,
        CourseDetailComponent,
    ],
    entryComponents: [
        CourseComponent,
        CourseNewComponent,
        CourseDetailComponent,
    ],
    providers: [
        CourseService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayCourseModule {}
