import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Race } from './race.model';
import { RacePopupService } from './race-popup.service';
import { RaceService } from './race.service';

@Component({
    selector: 'jhi-race-dialog',
    templateUrl: './race-dialog.component.html'
})
export class RaceDialogComponent implements OnInit {

    race: Race;
    isSaving: boolean;
    dateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private raceService: RaceService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
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
