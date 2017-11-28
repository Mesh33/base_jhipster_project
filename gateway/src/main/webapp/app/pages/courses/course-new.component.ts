import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Course} from './course.model';
import { CourseService } from './course.service';
import { Organizer, OrganizerService } from '../../entities/organizer';
import { ResponseWrapper } from '../../shared';
import {Principal} from '../../shared/auth/principal.service';

@Component ({
    selector: 'jhi-course-new',
    templateUrl: './course-new.component.html'
})

export class CourseNewComponent implements OnInit {
    course: Course;
    isSaving: boolean;
    departements = [
        '(01) - Ain',
        '(02) - Aisne',
        '(03) - Allier',
        '(04) - Alpes-de-Haute-Provence',
        '(05) - Hautes-alpes',
        '(06) - Alpes-maritimes',
        '(07) - Ardèche',
        '(08) - Ardennes',
        '(09) - Ariège',
        '(10) - Aube',
        '(11) - Aude',
        '(12) - Aveyron',
        '(13) - Bouches-du-Rhône',
        '(14) - Calvados',
        '(15) - Cantal',
        '(16) - Charente',
        '(17) - Charente-maritime',
        '(18) - Cher',
        '(19) - Corrèze',
        '(2a) - Corse-du-sud',
        '(2b) - Haute-Corse',
        '(21) - Côte-d\'Or',
        '(22) - Côtes-d\'Armor',
        '(23) - Creuse ',
        '(24) - Dordogne',
        '(25) - Doubs',
        '(26) - Drôme',
        '(27) - Eure',
        '(28) - Eure-et-loir',
        '(29) - Finistère',
        '(30) - Gard',
        '(31) - Haute-garonne',
        '(32) - Gers',
        '(33) - Gironde',
        '(34) - Hérault ',
        '(35) - Ille-et-vilaine ',
        '(36) - Indre ',
        '(37) - Indre-et-loire ',
        '(38) - Isère',
        '(39) - Jura',
        '(40) - Landes',
        '(41) - Loir-et-cher',
        '(42) - Loire',
        '(43) - Haute-loire',
        '(44) - Loire-atlantique',
        '(45) - Loiret',
        '(46) - Lot',
        '(47) - Lot-et-garonne',
        '(48) - Lozère',
        '(49) - Maine-et-loire',
        '(50) - Manche',
        '(51) - Marne',
        '(52) - Haute-marne',
        '(53) - Mayenne',
        '(54) - Meurthe-et-moselle',
        '(55) - Meuse',
        '(56) - Morbihan',
        '(57) - Moselle',
        '(58) - Nièvre',
        '(59) - Nord',
        '(60) - Oise',
        '(61) - Orne',
        '(62) - Pas-de-calais',
        '(63) - Puy-de-dôme',
        '(64) - Pyrénées-atlantiques',
        '(65) - Hautes-Pyrénées',
        '(66) - Pyrénées-orientales',
        '(67) - Bas-rhin',
        '(68) - Haut-rhin',
        '(69) - Rhône',
        '(70) - Haute-saône',
        '(71) - Saône-et-loire',
        '(72) - Sarthe',
        '(73) - Savoie',
        '(74) - Haute-savoie',
        '(75) - Paris',
        '(76) - Seine-maritime',
        '(77) - Seine-et-marne',
        '(78) - Yvelines',
        '(79) - Deux-sèvres',
        '(80) - Somme',
        '(81) - Tarn',
        '(82) - Tarn-et-garonne',
        '(83) - Var',
        '(84) - Vaucluse',
        '(85) - Vendée',
        '(86) - Vienne',
        '(87) - Haute-vienne',
        '(88) - Vosges',
        '(89) - Yonne',
        '(90) - Territoire de belfort',
        '(91) - Essonne',
        '(92) - Hauts-de-seine',
        '(93) - Seine-Saint-Denis',
        '(94) - Val-de-marne',
        '(95) - Val-d\'oise'
    ];

    organizers: Organizer[];
    dateDp: any;

    constructor(
        private alertService: JhiAlertService,
        private courseService: CourseService,
        private organizerService: OrganizerService,
        private eventManager: JhiEventManager,
        private router: Router,
        private principal: Principal
    ) {
    }

    ngOnInit() {
        this.course = new Course();
        this.isSaving = false;
        this.principal.identity().then((account) => {
            this.course.organizer = account;
        });
        /*
        this.organizerService
            .query({filter: 'race-is-null'})
            .subscribe((res: ResponseWrapper) => {
                if (!this.course.organizer || !this.course.organizer.id) {
                    this.organizers = res.json;
                } else {
                    this.organizerService
                        .find(this.course.organizer.id)
                        .subscribe((subRes: Organizer) => {
                            this.organizers = [subRes].concat(res.json);
                        }, (subRes: ResponseWrapper) => this.onError(subRes.json));
                }
            }, (res: ResponseWrapper) => this.onError(res.json));
        */
    }

    clear() {
        this.router.navigateByUrl('/');
    }

    save() {
        this.isSaving = true;
        if (this.course.id !== undefined) {
            this.subscribeToSaveResponse(
                this.courseService.update(this.course));
        } else {
            this.subscribeToSaveResponse(
                this.courseService.create(this.course));
        }
        this.router.navigateByUrl('/');
    }

    private subscribeToSaveResponse(result: Observable<Course>) {
        result.subscribe((res: Course) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Course) {
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
