import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { Principal } from '../../shared/auth/principal.service';

import { Course } from './course.model';
import { CourseService } from './course.service';
import { Participant } from '../../entities/participant/participant.model';
import { ParticipantService } from '../../entities/participant/participant.service';
import {BaseEntity} from '../../shared/model/base-entity';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-inscription',
    templateUrl: './inscription.component.html',
    styles: []
})
export class InscriptionComponent implements OnInit, OnDestroy {

    public course: Course;
    public accepted: boolean;
    private subscription: Subscription;
    private participant: Participant;
    private currentAccount: any;
    isSaving: boolean;

    constructor(
        private courseService: CourseService,
        private principal: Principal,
        private route: ActivatedRoute,
        private participantService: ParticipantService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.isSaving = false;
        this.accepted = false;
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    load(id) {
        this.courseService.find(id).subscribe((course) => {
            this.course = course;
            console.log(this.course);
        });
    }

    previousState() {
        window.history.back();
    }

    accept() {
        this.accepted = true;
    }

    pay() {
        /* Ici la verification du paiement ?*/
        this.createParticipant();
    }

    createParticipant() {
        this.participant = new Participant;
        this.participant.race = this.course;
        this.participant.username = this.currentAccount.login;
        this.isSaving = true;
        this.subscribeToSaveResponse(
            this.participantService.create(this.participant));
    }

    private subscribeToSaveResponse(result: Observable<Participant>) {
        result.subscribe((res: Participant) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Participant) {
        this.isSaving = false;
        this.router.navigateByUrl('coureur');
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
