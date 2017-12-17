import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Course } from '../courses/course.model';
import { ParticipantService } from '../../entities/participant/participant.service';

import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { JhiAlertService } from 'ng-jhipster';
import { Participant } from '../../entities/participant/participant.model';

@Component({
    selector : 'jhi-page-organisateur',
    templateUrl : './participant-courses.component.html',
    styles: ['dt { font-weight: normal; }']
})

export class ParticipantCoursesComponent implements OnInit {
    participants: Participant[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private participantService: ParticipantService,
        private activatedRoute: ActivatedRoute,
        private alertService: JhiAlertService,
        private principal: Principal
    ) {}

    getParticipants() {
        this.participantService.getByUserName( {
            query: this.currentAccount.login
        }).subscribe( (res) => {
            this.participants = res.json;
            console.log(this.participants);
        })
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.currentAccount = account;
            this.getParticipants();
        });
    }

    trackId(index: number, item: Course) {
        return item.id;
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

}
