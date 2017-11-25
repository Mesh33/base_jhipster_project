import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Race } from './race.model';
import { RacePopupService } from './race-popup.service';
import { RaceService } from './race.service';

@Component({
    selector: 'jhi-race-delete-dialog',
    templateUrl: './race-delete-dialog.component.html'
})
export class RaceDeleteDialogComponent {

    race: Race;

    constructor(
        private raceService: RaceService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.raceService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'raceListModification',
                content: 'Deleted an race'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-race-delete-popup',
    template: ''
})
export class RaceDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private racePopupService: RacePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.racePopupService
                .open(RaceDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
