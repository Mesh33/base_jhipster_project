import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Volunteer } from './volunteer.model';
import { VolunteerPopupService } from './volunteer-popup.service';
import { VolunteerService } from './volunteer.service';
import { Race, RaceService } from '../race';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-volunteer-dialog',
    templateUrl: './volunteer-dialog.component.html'
})
export class VolunteerDialogComponent implements OnInit {

    volunteer: Volunteer;
    isSaving: boolean;

    races: Race[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private volunteerService: VolunteerService,
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
        if (this.volunteer.id !== undefined) {
            this.subscribeToSaveResponse(
                this.volunteerService.update(this.volunteer));
        } else {
            this.subscribeToSaveResponse(
                this.volunteerService.create(this.volunteer));
        }
    }

    private subscribeToSaveResponse(result: Observable<Volunteer>) {
        result.subscribe((res: Volunteer) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Volunteer) {
        this.eventManager.broadcast({ name: 'volunteerListModification', content: 'OK'});
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
    selector: 'jhi-volunteer-popup',
    template: ''
})
export class VolunteerPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private volunteerPopupService: VolunteerPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.volunteerPopupService
                    .open(VolunteerDialogComponent as Component, params['id']);
            } else {
                this.volunteerPopupService
                    .open(VolunteerDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
