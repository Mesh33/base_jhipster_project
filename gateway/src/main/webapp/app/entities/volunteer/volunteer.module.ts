import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from '../../shared';
import {
    VolunteerService,
    VolunteerPopupService,
    VolunteerComponent,
    VolunteerDetailComponent,
    VolunteerDialogComponent,
    VolunteerPopupComponent,
    VolunteerDeletePopupComponent,
    VolunteerDeleteDialogComponent,
    volunteerRoute,
    volunteerPopupRoute,
} from './';

const ENTITY_STATES = [
    ...volunteerRoute,
    ...volunteerPopupRoute,
];

@NgModule({
    imports: [
        GatewaySharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        VolunteerComponent,
        VolunteerDetailComponent,
        VolunteerDialogComponent,
        VolunteerDeleteDialogComponent,
        VolunteerPopupComponent,
        VolunteerDeletePopupComponent,
    ],
    entryComponents: [
        VolunteerComponent,
        VolunteerDialogComponent,
        VolunteerPopupComponent,
        VolunteerDeleteDialogComponent,
        VolunteerDeletePopupComponent,
    ],
    providers: [
        VolunteerService,
        VolunteerPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayVolunteerModule {}
