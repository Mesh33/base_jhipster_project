import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Race } from './race.model';
import { RacePopupService } from './race-popup.service';
import { RaceService } from './race.service';
import { Organizer, OrganizerService } from '../organizer';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-race-dialog',
    templateUrl: './race-dialog.component.html'
})
export class RaceDialogComponent implements OnInit {

    race: Race;
    isSaving: boolean;

    organizers: Organizer[];
    dateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private raceService: RaceService,
        private organizerService: OrganizerService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.organizerService
            .query({filter: 'race-is-null'})
            .subscribe((res: ResponseWrapper) => {
                if (!this.race.organizer || !this.race.organizer.id) {
                    this.organizers = res.json;
                } else {
                    this.organizerService
                        .find(this.race.organizer.id)
                        .subscribe((subRes: Organizer) => {
                            this.organizers = [subRes].concat(res.json);
                        }, (subRes: ResponseWrapper) => this.onError(subRes.json));
                }
            }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.race.id !== undefined) {
            this.subscribeToSaveResponse(
                this.raceService.update(this.race));
        } else {
            this.subscribeToSaveResponse(
                this.raceService.create(this.race));
        }
    }

    private subscribeToSaveResponse(result: Observable<Race>) {
        result.subscribe((res: Race) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Race) {
        this.eventManager.broadcast({ name: 'raceListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.alertService.error(error.message, null, null);
    }

    trackOrganizerById(index: number, item: Organizer) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-race-popup',
    template: ''
})
export class RacePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private racePopupService: RacePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.racePopupService
                    .open(RaceDialogComponent as Component, params['id']);
            } else {
                this.racePopupService
                    .open(RaceDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
