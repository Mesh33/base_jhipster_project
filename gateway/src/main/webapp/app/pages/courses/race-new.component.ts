import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Race } from './race.model';
import { RaceService } from './race.service';
import { Organizer, OrganizerService } from '../../entities/organizer';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-race-new',
    templateUrl: './race-new.component.html'
})
export class RaceNewComponent implements OnInit {

    race: Race;
    isSaving: boolean;

    organizers: Organizer[];
    dateDp: any;

    constructor(
        private alertService: JhiAlertService,
        private raceService: RaceService,
        private organizerService: OrganizerService,
        private eventManager: JhiEventManager,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.race = new Race();
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
        this.router.navigateByUrl('/');
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

        this.router.navigateByUrl('/');
    }

    private subscribeToSaveResponse(result: Observable<Race>) {
        result.subscribe((res: Race) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Race) {
        this.eventManager.broadcast({ name: 'raceListModification', content: 'OK'});
        this.isSaving = false;
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
