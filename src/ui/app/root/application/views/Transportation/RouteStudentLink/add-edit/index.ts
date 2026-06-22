/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { ITransportationRouteStudentLink, routestudentlinklistVM, routestudentlinkVM, ITransportationRouteInfo, ITransportationRouteDetailInfo, IStudentSubCityVM, IStudentsCampusVM, IRouteStudentLinkEx, ITransportationRouteInfoByStudent } from '../../../../models';
import { TransportationRouteStudentLinkService, TransportationRouteInfoService, TransportationRouteDetailInfoService } from '../../../../service';

import * as helper from '../../../../helper';
import moment from 'moment';

type ValidateTransportationRouteStudentLink = { model: ITransportationRouteStudentLink, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateTransportationRouteStudentLink> = {
    model: {
        routeStudentLinkId: { required },
        routeDetailId: { required },
        admissionFormId: { required },
        exemption: { required },
        startingDtae: { required },
        isChecked: { required },
        statusId: { required },
        loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class TransportationRouteStudentLinkAddEdit extends Vue {
    private repository: TransportationRouteStudentLinkService;
    private data: IRouteStudentLinkEx = {
        routeDetailId: '', admissionFormId: '', studentId: '', rollNo: '', fullName: '', address: '', campusProgramId: '',
        sessionId: ''
        , campusId: ''
        , campusName: ''
        , subCityId: ''
        , subCityName: ''
        , cityId: ''
        , cityName: ''
        , refferenceNo: ''
        , routeId: ''
        , stopName: ''
        , routeTitle: ''
        , startingDtae: new Date()
        , statusId: 0
        , classId: ''
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private routeId = '';
    private routeDetailId = '';
    private routeDetailLinkId = '';
    private loggerId = '';

    private rdate: Date = new Date();
    private vdate: Date = new Date();

    private datas: Array<routestudentlinkVM> = [];
    private dataDate: Array<ITransportationRouteStudentLink> = [];
    private editData: Array<ITransportationRouteStudentLink> = [];

    private studentList: Array<IStudentsCampusVM> = []
    private studentModel: IStudentSubCityVM = {
        refferenceNo: '', genderId: '', fullName: '', subCityId: '',
        academicInfo: '', address: '', admissionFormId: '', admissionTypeId: '', bloodGroupId: '', campusId: '', campusProgramId: '', cityName: '',
        dateOfBirth: '', fatherName: '', guardians: '', loggerId: '', parentCNIC: '', parentContactNo: '', religionId: '', rollNo: '',
        sessionId: '', statusId: 1, studentCNIC: '', studentContactNo: '', studentId: '', studentLoggerId: '', subCityName: '', zoneId: ''
    }


    private routeList: Array<ITransportationRouteInfo> = []
    private routeListEx: Array<ITransportationRouteInfoByStudent> = []

    private routeDetailList: Array<ITransportationRouteDetailInfo> = []

    private isActive: boolean = false;
    private dueDate: Date = new Date();

    private routeRepo: TransportationRouteInfoService = new TransportationRouteInfoService(this.$store)

    private routeDetailRepo: TransportationRouteDetailInfoService = new TransportationRouteDetailInfoService(this.$store)
    private model: ITransportationRouteStudentLink = {
        admissionFormId: '', exemption: 0, isChecked: true, loggerId: '', routeDetailId: '',
        routeStudentLinkId: '', startingDtae: new Date(), statusId: 1
    };
    created() {
        this.repository = new TransportationRouteStudentLinkService(this.$store);
    }

//validation working of route student link
  get  allowsubmit()

    {
         return !(this.data.admissionFormId.length>0 && this.data.routeId.length>0 &&  this.data.routeDetailId.length>0)
    }

   

    beforeModalOpen(event) {
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);

       
       
        // JSON.stringify(this.data))
        this.routeId = this.data.routeId;
        // this.data = event.params.model;
        // alert(JSON.stringify(this.data))

        // this.loadRouteInfo();
        this.loadRouteInfoEx()
        this.loadRouteDetailInfo();
        // this.loadStudentList();
        this.loadEditInfo();
        this.repository.GetStudentsOfCampus(this.data.sessionId + "?" + this.data.campusId + "?" + this.data.campusProgramId + "?" + this.data.classId)
            .then(r => {
                this.studentList = r as Array<IStudentsCampusVM>
              
            })

        if (this.data.statusId == 1) {
            this.isActive = true;
        } else {
            this.isActive = false;
        }
    }
    template(value) {
        
    }
    cancel() {
        this.$modal.hide('add-edit-model');
    }

    loadRouteInfo() {
        this.routeRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.routeList = r as Array<ITransportationRouteInfo>
            })
    }


    loadRouteInfoEx() {
        if(this.data.admissionFormId !== "" && this.data.admissionFormId !== null && this.data.admissionFormId !== undefined){
            this.routeRepo.GetRouteInfoByStudentId(this.data.admissionFormId)
            .then(r => {
                this.routeListEx = r as Array<ITransportationRouteInfoByStudent>
            })
        }
       
    }

    loadRouteDetailInfo() {
        this.routeDetailRepo.GetFindBy('e=>e.RouteId.ToString()=="' + this.data.routeId + '" ')
            .then(r => {
                this.routeDetailList = r as Array<ITransportationRouteDetailInfo>
            })
    }

    // loadStudentList() {

    //     this.datas = [];
    //     if (this.data.zoneId.length > 0 && this.data.sessionId.length > 0 && this.data.cityId.length > 0 && this.data.subCityId.length > 0) {
    //         var key = this.data.zoneId + '?' + this.data.sessionId + '?' + this.data.cityId + '?' + this.data.subCityId;
    //         this.repository.GetAllVM(key)
    //             .then(response => this.datas = (response as Array<routestudentlinkVM>));

    //     }
    // }

    loadEditInfo() {
        this.editData = [];
        this.repository.GetFindBy('e=>e.AdmissionFormId.ToString()=="' + this.data.admissionFormId + '" ')
            .then(response => {
                this.editData = (response as Array<ITransportationRouteStudentLink>);

                if (this.editData) {
                    if (this.editData.length > 0) {
                        this.routeDetailLinkId = this.editData[0].routeStudentLinkId;
                        this.loggerId = this.editData[0].loggerId;


                    }
                }
            });
    }



    saveModel() {
        
        if (this.IsNewRecord) {
           
            
            this.model.admissionFormId = this.data.admissionFormId;
            this.model.exemption = 0;
            this.model.isChecked = true;
            this.model.loggerId = helper.newGuid();
            this.model.routeDetailId = this.data.routeDetailId;
            this.model.routeStudentLinkId = helper.newGuid();
            
            this.model.startingDtae = new Date(helper.formateDate(this.data.startingDtae));

            this.model.statusId = 1;
            var dated = this.dueDate.getFullYear() + '/' + (this.dueDate.getMonth() + 1) + '/' + this.dueDate.getDate();
            var key = JSON.stringify(this.model) + "?" + dated ;
            
            this.repository.AddBulk(key)
                .then(r => {
                    //alert(JSON.stringify(r))
                    if(r=="Added Successfully") {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text:r,
                        title:'',
                        messageTypeId: PayloadMessageTypes.success
                    });
                    } 
                    else
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text:r,
                        title:'',
                        messageTypeId: PayloadMessageTypes.warning
                    });
                })


        } else {

            if (this.isActive == true) {
                this.model.statusId = 1;
            } else {
                this.model.statusId = 0;
            }
            this.model.admissionFormId = this.data.admissionFormId;
            this.model.exemption = 0;
            this.model.isChecked = true;
            this.model.loggerId = this.loggerId;
            this.model.routeDetailId = this.data.routeDetailId;
            this.model.routeStudentLinkId = this.routeDetailLinkId;
            this.model.startingDtae = new Date(helper.formateDate(this.data.startingDtae));
            this.repository.Update(this.model)
                .then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been updated successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                }));
        }

        this.cancel();
    }
    $v: Vuelidate<any>;
}