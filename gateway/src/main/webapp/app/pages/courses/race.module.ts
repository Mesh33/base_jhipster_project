import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from '../../shared';
import {
    RaceService,
    RacePopupService,
    RaceComponent,
    RaceDetailComponent,
    RaceDialogComponent,
    RacePopupComponent,
    RaceDeletePopupComponent,
    RaceDeleteDialogComponent,
    courseRoute,
    racePopupRoute,
    RaceNewComponent
} from './';

const ENTITY_STATES = [
    ...courseRoute,
    ...racePopupRoute,
];

@NgModule({
    imports: [
        GatewaySharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        RaceComponent,
        RaceDetailComponent,
        RaceDialogComponent,
        RaceDeleteDialogComponent,
        RacePopupComponent,
        RaceDeletePopupComponent,
        RaceNewComponent,
    ],
    entryComponents: [
        RaceComponent,
        RaceDialogComponent,
        RacePopupComponent,
        RaceDeleteDialogComponent,
        RaceDeletePopupComponent,
        RaceNewComponent,
    ],
    providers: [
        RaceService,
        RacePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayRaceModule {}
