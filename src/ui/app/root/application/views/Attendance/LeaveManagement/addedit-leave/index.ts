/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/
// 

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes, IUser } from '../../../../../../model';

import { IAttendanceAttendanceDetail, IAttendanceAttendenceMaster, IAdmissionStudents, IAdmissionAdmissionForm, IAttendanceAttendenceStatus, IAttendanceAttendenceMasterVM, IAdmissionAdmissionFormVM, IRegistrationProgramCourseLink, RegistrationProgramCourseLinkVM } from '../../../../models';
import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AdmissionStudentsService, AttendanceAttendenceStatusService, AdmissionAdmissionFormService, RegistrationProgramCourseLinkService } from '../../../../service';

import * as helper from '../../../../helper';


import { AttendanceAttendenceMasterAddEdit } from '../../AttendenceMaster/add-edit';
import { IAttendanceLeaves, LeaveInfo } from '../../../../models/Attendance/Attendenceleave';
import { State } from 'vuex-class';
import { IRootStoreState } from '../../../../../store';
import moment from 'moment';

type ValidateAttendanceAttendanceDetail = { model: IAttendanceAttendanceDetail, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateAttendanceAttendanceDetail> = {
    model: {
        attendanceDetailId: { required },
        attendanceMasterId: { required },
        admissionFormId: { required },
        attendenceStatusId: { required },
        statusId: { required },
        loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-leave',
    template: require('./index.html'),
    props: ["passdata", "editModel", "isNewRecord"]

})
export class LeaveManagementCommon extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    private repository: AttendanceAttendanceDetailService;
    private ProgramCourseLinkrepository: RegistrationProgramCourseLinkService = null;
    private AttendenceMasterrepository: AttendanceAttendenceMasterService;
    private Admissionformrepository: AdmissionAdmissionFormService;
    private AttendenceStatusrepository: AttendanceAttendenceStatusService;
    public leaveObject: any = (<any>this).leaveObject;
    private editModel: any = (<any>this).editModel;
    private isNewRecord: any = (<any>this).isNewRecord
    private AttendenceMasterList: Array<IAttendanceAttendenceMasterVM> = [];
    private Attendecedetailserv: AttendanceAttendanceDetailService = null;
    private ProgramCourseListSelected: Array<SelectedProgramCourse> = [];
    private ProgramCourseList: Array<RegistrationProgramCourseLinkVM> = [];
    private idslist: Array<listclass> = [];
    private currentDate: Date = new Date();
    private Tempidslist: Array<listclass> = [];

    private LeaveStudent: Array<LeaveInfo> = [];

    private AdmissionformList: Array<IAdmissionAdmissionFormVM> = [];
    private AttendenceStatusList: Array<IAttendanceAttendenceStatus> = [];

    private data: IAttendanceAttendanceDetail = {
        attendanceDetailId: '', attendanceMasterId: '', admissionFormId: '', attendenceStatusId: '', statusId: 0, loggerId: '',
    };

    private model: IAttendanceLeaves = {
        leaveId: '', admissionFormId: '', fromDate: new Date(), toDate: new Date(), isPartial: false, isApproved: false, programCourseLinkId: '', information: ''
    };

    private infoobj: information = { appliedBy: -1, appliedDate: new Date(), approvedBy: -1, approvedDate: new Date(), remakrs: '' }
    private IsNewRecord: boolean = true;
    private title: string = '';
    private isActive: boolean = true
    private classid: string = '';
    private programdetailid: string = '';
    private admissionformid: string = '';
    private remarks = '';
    private duedate: Date;
    private passdata: any = (<any>this).passdata;
    private roleadmin: boolean = false;


    private datevalue: Date;

    created() {

        this.IsNewRecord = this.isNewRecord == 'true' ? true : false;
        this.repository = new AttendanceAttendanceDetailService(this.$store);
        this.AttendenceMasterrepository = new AttendanceAttendenceMasterService(this.$store);
        this.Admissionformrepository = new AdmissionAdmissionFormService(this.$store);
        this.AttendenceStatusrepository = new AttendanceAttendenceStatusService(this.$store);
        this.ProgramCourseLinkrepository = new RegistrationProgramCourseLinkService(this.$store);
        this.Attendecedetailserv = new AttendanceAttendanceDetailService(this.$store);
        this.beforeModalOpen();





    }

    beforeModalOpen() {
        

        this.remarks = '';
        this.idslist.push({ "programCourseLinkId": '' })
        this.Tempidslist.push({ "programCourseLinkId": '' })
        this.classid = this.passdata.clsid;
        this.programdetailid = this.passdata.progrmdtlid;
        this.admissionformid = this.passdata.adfrmid;
        this.ProgramCourseList = [];
        this.ProgramCourseListSelected = [];

         ///////////by ansa
        //console.log(this.user.roles);
       
        if (this.user.roles.indexOf("admin") >= 0) {
            this.roleadmin = true;
        }

        else {
            this.roleadmin = false;
            this.duedate = new Date(this.currentDate);
            this.duedate.setDate(this.duedate.getDate() - 15);
            
        }
        Object.assign(this.model, this.editModel);
        ////////////

        var key = this.programdetailid + '?' + this.classid;

        if (this.IsNewRecord == false) {
            console.log('skor ha')
            this.Tempidslist = JSON.parse(this.model.programCourseLinkId);
            this.infoobj = JSON.parse(this.model.information);
            this.remarks = this.infoobj.remakrs;

        }

        this.ProgramCourseLinkrepository.GetAllFilterData(key).then(r => {
            this.ProgramCourseList = r as Array<RegistrationProgramCourseLinkVM>

            this.ProgramCourseList.forEach(element => {
                var temp: SelectedProgramCourse = {
                    programCourseLinkId: element.programCourseLinkId,
                    programDetailId: element.programDetailId,
                    classId: element.classId,
                    courseId: element.courseId,
                    statusId: element.statusId,
                    courseName: element.courseName,
                    className: element.className,
                    description: element.description,
                    loggerId: element.loggerId,
                    isSelected: true


                }
                this.ProgramCourseListSelected.push(temp);
            });

            if (!this.IsNewRecord) {
                console.log(this.Tempidslist.length)
                this.ProgramCourseListSelected.forEach(el => {
                    if (this.Tempidslist.find(s => s.programCourseLinkId == el.programCourseLinkId) == null) {
                        el.isSelected = false;
                    }
                });
                console.log('hi')
                console.log(JSON.stringify(this.ProgramCourseListSelected))
            }

        })


        if (this.IsNewRecord == false) {
            console.log('skor ha')
            this.Tempidslist = JSON.parse(this.model.programCourseLinkId);
            this.infoobj = JSON.parse(this.model.information);
            this.remarks = this.infoobj.remakrs;

        }

    }



    CheckAll(option: any) {

 
let count;
        if (option == true) {
             
            this.ProgramCourseListSelected.forEach(element => {
                element.isSelected = false;
            });


        }
        if (option == false) {
              
            this.ProgramCourseListSelected.forEach(element => {
                element.isSelected = true;
            });


        }

    }
    selectDate() {

        this.datevalue = this.model.fromDate;
        this.model.toDate = this.datevalue;

    }


    addNewAttendenceMaster() {
        this.$modal.show('AttendenceMaster-add-edit-model', { IsNewRecord: true });

    }
    loadAttendenceMaster() {
        this.AttendenceMasterrepository.GetFindBy('e=>e.StatusId==1').then(res => {

            this.AttendenceMasterList = res as Array<IAttendanceAttendenceMasterVM>
        });

    }

    cancel() {
        this.model = {
            leaveId: '', admissionFormId: '', fromDate: new Date(), toDate: new Date(), isPartial: false, isApproved: false, programCourseLinkId: '', information: ''
        };

        this.infoobj = { appliedBy: -1, appliedDate: new Date(), approvedBy: -1, approvedDate: new Date(), remakrs: '' }
        this.$modal.hide('add-edit-model');
        this.$modal.hide('view-leave-model');
        this.$emit("submit");

    }



    saveModel() {
debugger


        if (this.IsNewRecord == true) {
            var list = this.ProgramCourseListSelected.filter(e => e.isSelected == true);
            if(this.ProgramCourseListSelected.filter(e => e.isSelected == true).length>0){


            this.idslist = [];
            this.model.admissionFormId = this.admissionformid;

            

            list.forEach(element => {
                var temp: listclass = {
                    programCourseLinkId: element.programCourseLinkId
                }
                this.idslist.push(temp);
            });

            this.model.programCourseLinkId = JSON.stringify(this.idslist);

            this.model.fromDate = new Date(moment(this.model.fromDate).format('YYYY-MM-DD'));
            this.model.toDate = new Date(moment(this.model.toDate).format('YYYY-MM-DD'));

            this.model.toDate = new Date(this.model.toDate);

            this.infoobj.appliedBy = this.user.userId;
            this.model.isApproved = false;
            this.infoobj.appliedDate = new Date();
            this.infoobj.remakrs = this.remarks;
            this.model.information = JSON.stringify(this.infoobj);
            var z = JSON.stringify(this.model) + '?' + '0';


        }
        else 
        {

            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Select Course ',
                title: 'Success',
                messageTypeId: PayloadMessageTypes.warning
            })

        }
    }

        if (this.IsNewRecord == false) {

            if(this.ProgramCourseListSelected.filter(e => e.isSelected == true).length>0){

            this.idslist = []
            this.ProgramCourseListSelected.filter(s => s.isSelected).forEach(e => {
                this.idslist.push({ programCourseLinkId: e.programCourseLinkId })
            })
            this.infoobj.remakrs = this.remarks;
            this.model.fromDate = new Date(moment(this.model.fromDate).format('YYYY-MM-DD'));
            this.model.toDate = new Date(moment(this.model.toDate).format('YYYY-MM-DD'));

            this.model.information = JSON.stringify(this.infoobj);
            this.model.programCourseLinkId = JSON.stringify(this.idslist)
            var z = JSON.stringify(this.model) + '?' + '1';
        }
        else 
        {

            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Select Course ',
                title: 'Success',
                messageTypeId: PayloadMessageTypes.warning
            })

        }
    }
        if (this.remarks.length > 0) {
            if(this.ProgramCourseListSelected.filter(e => e.isSelected == true).length>0){
            this.Attendecedetailserv.InsertLeave(z).then(r => {
                console.log(JSON.stringify(r))
                var res = r as string;
                if (res.search('Successfully') != -1) {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: r,
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                    this.$emit("submit");

                    this.cancel();
                }
                else {

                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: r,
                        title: 'Error',
                        messageTypeId: PayloadMessageTypes.error
                    })
                }



            })
        }  else 
        {

            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Select Course ',
                title: 'Success',
                messageTypeId: PayloadMessageTypes.warning
            })

        }}

        else {

            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Please Enter Leave Description',
                title: 'Success',
                messageTypeId: PayloadMessageTypes.warning
            })

        }


    }

    $v: Vuelidate<any>;
}





export interface SelectedProgramCourse extends RegistrationProgramCourseLinkVM {

    isSelected: boolean


}

export interface information {
    appliedBy: number
    appliedDate: Date
    approvedBy: number
    approvedDate: Date
    remakrs: string


}


export interface listclass {
    programCourseLinkId: string;
}