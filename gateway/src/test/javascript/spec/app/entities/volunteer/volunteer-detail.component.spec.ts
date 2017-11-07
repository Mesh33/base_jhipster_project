/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { GatewayTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { VolunteerDetailComponent } from '../../../../../../main/webapp/app/entities/volunteer/volunteer-detail.component';
import { VolunteerService } from '../../../../../../main/webapp/app/entities/volunteer/volunteer.service';
import { Volunteer } from '../../../../../../main/webapp/app/entities/volunteer/volunteer.model';

describe('Component Tests', () => {

    describe('Volunteer Management Detail Component', () => {
        let comp: VolunteerDetailComponent;
        let fixture: ComponentFixture<VolunteerDetailComponent>;
        let service: VolunteerService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GatewayTestModule],
                declarations: [VolunteerDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    VolunteerService,
                    JhiEventManager
                ]
            }).overrideTemplate(VolunteerDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(VolunteerDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(VolunteerService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Volunteer(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.volunteer).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
