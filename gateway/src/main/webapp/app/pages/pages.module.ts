import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { GatewayCourseModule } from './courses/course.module';
import { GatewayOrganisateurModule } from './organisateur/organisateur.module';
import { GatewayParticipantModule } from './participant/participant.module';

/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        GatewayCourseModule,
        GatewayOrganisateurModule,
        GatewayParticipantModule,
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayPagesModule {}
