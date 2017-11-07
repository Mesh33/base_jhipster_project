/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { GatewayTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { RaceDetailComponent } from '../../../../../../main/webapp/app/entities/race/race-detail.component';
import { RaceService } from '../../../../../../main/webapp/app/entities/race/race.service';
import { Race } from '../../../../../../main/webapp/app/entities/race/race.model';

describe('Component Tests', () => {

    describe('Race Management Detail Component', () => {
        let comp: RaceDetailComponent;
        let fixture: ComponentFixture<RaceDetailComponent>;
        let service: RaceService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [RaceDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    RaceService,
                    JhiEventManager
                ]
            }).overrideTemplate(RaceDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RaceDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RaceService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Race(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.race).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
