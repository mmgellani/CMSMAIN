/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { AdmissionsCount, FeeStudentChallanCount, EnrollmentsCount, ISetupSession } from '../../../models';
import { AdmissionAdmissionFormService, SetupSessionService } from '../../../service';

@Component({
    name: 'form-collection-single',
    template: require('./index.html'),
})
export class FormCollectionSingle extends Vue {

    private data: Array<AdmissionsCount> = [];
    private paidData: Array<FeeStudentChallanCount> = [];
    private EnrollData: Array<EnrollmentsCount> = [];
    private admissionCount: number = 0;
    private paidChallanCount: number = 0;
    private enrollmentCount: number = 0;
    private admissionCountDaily: number = 0;
    private paidChallanCountDaily: number = 0;
    private enrollmentCountDaily: number = 0;
    private dataList = []

    private admissionRepository: AdmissionAdmissionFormService;
    private sessionId: string = '';
    private sessionList: Array<ISetupSession> = [];
    private repositorySession: SetupSessionService;

    created() {
        this.admissionRepository = new AdmissionAdmissionFormService(this.$store);
        this.repositorySession = new SetupSessionService(this.$store);
    }
    mounted() {
        this.getSession();
    }

    getSession() {
        this.sessionList = [];
        this.repositorySession
            .GetFindBy("e => e.StatusId == 1")
            .then(
                response => {
                    this.sessionList = response as Array<ISetupSession>
                    this.sessionList.sort((a: any, b: any) => b.fullName - a.fullName);
                    this.sessionId = this.sessionList[0].sessionId;
                    this.refreshData();
                }
            );
    }

    refreshData() {
        this.data = [];
        this.paidData = [];
        this.EnrollData = [];
        this.admissionCount = 0;
        this.paidChallanCount = 0;
        this.enrollmentCount = 0;
        //var key = this.sessionId + '?' + this.cityId + '?' + this.programDetailId;
        this.admissionRepository.GetCityWiseAllEx(this.sessionId)
            .then(r => {

                this.data = r.admissionForm as Array<AdmissionsCount>;
                this.paidData = r.studentChallan as Array<FeeStudentChallanCount>;
                this.EnrollData = r.enrollments as Array<EnrollmentsCount>;
                this.admissionCount = this.data[0].admissionCount;
                this.paidChallanCount = this.paidData[0].paidChallanCount;
                this.enrollmentCount = this.EnrollData[0].enrollmentCount;
                this.admissionRepository.GetAdmissionDateWiseFx(this.sessionId)
                    .then(r => {

                        this.data = r.admissionForm as Array<AdmissionsCount>;
                        this.paidData = r.studentChallan as Array<FeeStudentChallanCount>;
                        this.EnrollData = r.enrollments as Array<EnrollmentsCount>;
                        this.admissionCountDaily = this.data[0].admissionCount;
                        this.paidChallanCountDaily = this.paidData[0].paidChallanCount;
                        this.enrollmentCountDaily = this.EnrollData[0].enrollmentCount;


                    })

            })

    }


}