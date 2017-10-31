import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Participant } from './participant.model';
import { ParticipantPopupService } from './participant-popup.service';
import { ParticipantService } from './participant.service';
import { Race, RaceService } from '../race';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-participant-dialog',
    templateUrl: './participant-dialog.component.html'
})
export class ParticipantDialogComponent implements OnInit {

    participant: Participant;
    isSaving: boolean;

    races: Race[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private participantService: ParticipantService,
        private raceService: RaceService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.raceService.query()
            .subscribe((res: ResponseWrapper) => { this.races = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.participant.id !== undefined) {
            this.subscribeToSaveResponse(
                this.participantService.update(this.participant));
        } else {
            this.subscribeToSaveResponse(
                this.participantService.create(this.participant));
        }
    }

    private subscribeToSaveResponse(result: Observable<Participant>) {
        result.subscribe((res: Participant) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Participant) {
        this.eventManager.broadcast({ name: 'participantListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.alertService.error(error.message, null, null);
    }

    trackRaceById(index: number, item: Race) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-participant-popup',
    template: ''
})
export class ParticipantPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private participantPopupService: ParticipantPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.participantPopupService
                    .open(ParticipantDialogComponent as Component, params['id']);
            } else {
                this.participantPopupService
                    .open(ParticipantDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
