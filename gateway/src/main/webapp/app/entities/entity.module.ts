import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { GatewayRaceModule } from './race/race.module';
import { GatewayOrganizerModule } from './organizer/organizer.module';
import { GatewayParticipantModule } from './participant/participant.module';
import { GatewayVolunteerModule } from './volunteer/volunteer.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        GatewayRaceModule,
        GatewayOrganizerModule,
        GatewayParticipantModule,
        GatewayVolunteerModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayEntityModule {}
