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
import { PayloadMessageTypes, IUser } from '../../../../../../model';

import { IAttendanceAttendanceDetail, IAttendanceAttendenceMaster, IAdmissionStudents, IAdmissionAdmissionForm, IAttendanceAttendenceStatus, IAttendanceAttendenceMasterVM, IAdmissionAdmissionFormVM, IRegistrationProgramCourseLink, RegistrationProgramCourseLinkVM } from '../../../../models';
import { AttendanceAttendanceDetailService, AttendanceAttendenceMasterService, AdmissionStudentsService, AttendanceAttendenceStatusService, AdmissionAdmissionFormService, RegistrationProgramCourseLinkService } from '../../../../service';

import * as helper from '../../../../helper';

import { AttendanceAttendenceMasterAddEdit } from '../../AttendenceMaster/add-edit';
import { IAttendanceLeaves, LeaveInfo } from '../../../../models/Attendance/Attendenceleave';
import { State } from 'vuex-class';
import { IRootStoreState } from '../../../../../store';
import { LeaveManagementCommon } from '../addedit-leave';

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
export interface ValtoPass{
    clsid:string;
    progrmdtlid:string;
    adfrmid:string;

}
@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'add-edit-leave': LeaveManagementCommon
    }
})
export class LeaveManagementAddEdit extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    private repository: AttendanceAttendanceDetailService;
    private ProgramCourseLinkrepository: RegistrationProgramCourseLinkService = null;
    private AttendenceMasterrepository: AttendanceAttendenceMasterService;
    private Admissionformrepository: AdmissionAdmissionFormService;
    private AttendenceStatusrepository: AttendanceAttendenceStatusService;

    private obj:ValtoPass={
    clsid:'',
    progrmdtlid:'',
    adfrmid:''
    }


    private AttendenceMasterList: Array<IAttendanceAttendenceMasterVM> = [];
    private Attendecedetailserv: AttendanceAttendanceDetailService = null;
    private ProgramCourseListSelected: Array<SelectedProgramCourse> = [];
    private ProgramCourseList: Array<RegistrationProgramCourseLinkVM> = [];
    private idslist: Array<listclass> = [];

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
    
    private show: boolean = true;

    created() {
        this.repository = new AttendanceAttendanceDetailService(this.$store);
        this.AttendenceMasterrepository = new AttendanceAttendenceMasterService(this.$store);
        this.Admissionformrepository = new AdmissionAdmissionFormService(this.$store);
        this.AttendenceStatusrepository = new AttendanceAttendenceStatusService(this.$store);
        this.ProgramCourseLinkrepository = new RegistrationProgramCourseLinkService(this.$store);
        this.Attendecedetailserv = new AttendanceAttendanceDetailService(this.$store);
       
    }

    beforeModalOpen(event) {

        this.remarks = '';
        this.idslist.push({ "programCourseLinkId": '' })
        this.Tempidslist.push({ "programCourseLinkId": '' })
        this.classid = event.params.ClassID;
        this.programdetailid = event.params.ProgramDetailID;
        this.admissionformid = event.params.AdmissionFormID;
        this.ProgramCourseList = [];
        this.ProgramCourseListSelected = [];
        this.IsNewRecord = event.params.IsNewRecord;

        this.obj.adfrmid=this.admissionformid;
        this.obj.clsid=this.classid;
        this.obj.progrmdtlid=this.programdetailid;
        Object.assign(this.model, event.params.modelVM);
        this.model.fromDate = new Date();
        this.model.toDate = new Date();
        // note
        // Object.assign(this.model, event.params.modelVM);
          // alert(this.programdetailid + '?' + this.classid)
        var key = this.programdetailid + '?' + this.classid;



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
                this.ProgramCourseListSelected.forEach(el => {
                    if (this.Tempidslist.find(s => s.programCourseLinkId == el.programCourseLinkId) == null) {
                        el.isSelected = false;
                    }
                });
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
        

    }

    saveModel() {
     this.show=false;

        if (this.IsNewRecord == true) {


            this.idslist = [];
            this.model.admissionFormId = this.admissionformid;

            var list = this.ProgramCourseListSelected.filter(e => e.isSelected == true);

            list.forEach(element => {
                var temp: listclass = {
                    programCourseLinkId: element.programCourseLinkId
                }
                this.idslist.push(temp);
            });
            this.model.programCourseLinkId = JSON.stringify(this.idslist);
            
            this.model.fromDate = new Date(this.model.fromDate);
            

            this.model.toDate = new Date(this.model.toDate);
            this.infoobj.appliedBy = this.user.userId;
            this.infoobj.appliedDate = new Date();
            this.infoobj.remakrs = this.remarks;
           
            this.model.information = JSON.stringify(this.infoobj);
            var z = JSON.stringify(this.model) + '?' + '0';


        }

        if (this.IsNewRecord == false) {
            this.idslist = []
            this.ProgramCourseListSelected.filter(s => s.isSelected).forEach(e => {
                this.idslist.push({ programCourseLinkId: e.programCourseLinkId })
            })
            this.infoobj.remakrs = this.remarks;

            
            this.model.information = JSON.stringify(this.infoobj);
            this.model.programCourseLinkId = JSON.stringify(this.idslist)
            var z = JSON.stringify(this.model) + '?' + '1';
        }


        this.Attendecedetailserv.InsertLeave(z).then(r => {
            console.log(JSON.stringify(r))
            var res = r as string;
            if (res.search('Successfully') != -1) {
                this.show=true;
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