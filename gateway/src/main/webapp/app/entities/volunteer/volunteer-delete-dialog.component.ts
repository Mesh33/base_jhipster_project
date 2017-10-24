import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Volunteer } from './volunteer.model';
import { VolunteerPopupService } from './volunteer-popup.service';
import { VolunteerService } from './volunteer.service';

@Component({
    selector: 'jhi-volunteer-delete-dialog',
    templateUrl: './volunteer-delete-dialog.component.html'
})
export class VolunteerDeleteDialogComponent {

    volunteer: Volunteer;

    constructor(
        private volunteerService: VolunteerService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.volunteerService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'volunteerListModification',
                content: 'Deleted an volunteer'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-volunteer-delete-popup',
    template: ''
})
export class VolunteerDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private volunteerPopupService: VolunteerPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.volunteerPopupService
                .open(VolunteerDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
