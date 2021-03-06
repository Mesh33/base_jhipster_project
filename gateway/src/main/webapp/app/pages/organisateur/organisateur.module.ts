import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from '../../shared';
import { CourseService } from '../courses/course.service';
import { organisateurRoute } from './organisateur.route';
import { OrganisateurComponent } from './organisateur.component';
import { CourseEditionComponent } from './course-edition.component';

const ENTITY_STATES = [
    ...organisateurRoute,
];

@NgModule({
    imports: [
        GatewaySharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        OrganisateurComponent,
        CourseEditionComponent
    ],
    entryComponents: [
        OrganisateurComponent,
        CourseEditionComponent
    ],
    providers: [
        CourseService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayOrganisateurModule {}
