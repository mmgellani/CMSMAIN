/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';
import { MessageService } from '../../../../service/Message/message-service';

import { IFeeConcessionDetail, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, IStudentToEnrollVM, IRegistrationSectionCourseLinkVM, ISetupClass, ICampusCityVM, ISetupGender, IStudentEnrolledVM } from '../../../../models';
import { FeeConcessionDetailService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, SetupClassService, SetupGenderService, RegistrationSectionCourseLinkService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import { Helper } from '../../../Fee/Helper';
import * as helper from '../../../../helper';


export interface INotificationTypes {
    notificationtype: string;
}
export interface INotificationCredntials {

    sesseion: string;
    campus: string;
    program: string;
    classstudent: string;
    section: string;
    rollno: string;
    notificationObject: {
        notification: string;
        type: string;
        title: string;
        image: string;
    }


}
export interface INotificationTypes {
    notificationtype: string;
}
// export interface ISetupGenderCB {
//     genderId: string;
//     description: string;
//     statusId: number;
//     loggerId: string;
//     isChecked: boolean;

// }
@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class Notification extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;

    private repositoryVM: RegistrationSectionCourseLinkService;


    private datas: Array<IStudentEnrolledVM> = [];
    private datasnotification: Array<INotificationCredntials> = [];
    private notificationtype: Array<INotificationTypes> = [];
    private saveDatasList: Array<IStudentEnrolledVM> = [];
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    typeid = '';
    titletxt = '';
    imagetxt = '';
    private programDetailId = ''
    //private shiftId = ''
    private percentageFrom = 1
    private percentageTo = 99
    private scholarshipCriteriaId = ''
    //private selected:any;
    private campusProgramId = '';
    private Messaage: string = '';
    private classid: string = '';
    private repoClass = new SetupClassService(this.$store);

    //private scholarhipList: Array<IScholarshipApplyVM> = []
    private campusList: Array<ISetupCampus> = []
    classList: Array<ISetupClass> = []
    private sessionList: Array<ISetupSession> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private shiftList: Array<ISetupShift> = []
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []
    private genderRepo: SetupGenderService;

    private genderModel: Array<ISetupGender> = [];
    // private genderModelCB: Array<ISetupGenderCB> = [];
    private idGender: string = "";
    private sectionCourseLinkId: string = "";

    admissionTypeId: string = "";
    private admissionTypeList: Array<ISetupAdmissionType> = [];


    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private admisisonTypeRepo: SetupAdmissionTypeService;
    private notificationRepo: MessageService = new MessageService(this.$store);
    private data: any = [];
    private datanoti: any = [];

    private columns = [
        { key: 'rollNo', caption: 'RollNO' },
        { key: 'refferenceNo', caption: 'Reference No.' },
        { key: 'fullName', caption: 'Student Name' },
        { key: 'sectionId', caption: 'Section' },
        { key: 'action', caption: 'Action', width: 120 }
    ];




    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []

    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.genderRepo = new SetupGenderService(this.$store);
        this.admisisonTypeRepo = new SetupAdmissionTypeService(this.$store);
        this.repositoryVM = new RegistrationSectionCourseLinkService(this.$store);

        this.loadSession();
        this.$watch('sessionId', this.loadCityCampus);
        this.$watch('campusId', this.loadProgramsOfCampus);
        this.$watch('campusProgramId', this.refreshData);
        this.$watch('classid', this.loadSections);
        this.$watch('sectionCourseLinkId', this.refreshData);
        // this.getGeroutnder()
        // this.loadAdmissionType();

    }

    mounted() {
        this.datanoti =
            //["Fee","Exam","Attendence","Text"];
            [{
                typeid: "1",
                typeName: "Admission"
            },
            {
                typeid: "2",
                typeName: "Attendance"
            },
            {
                typeid: "3",
                typeName: "Exam"
            },
            {
                typeid: "4",
                typeName: "Fee"
            },
            {
                typeid: "5",
                typeName: "Text"
            }

            ]

        this.validatePage();
        this.refreshData();


    }

    loadClass() {
        this.classList = [];
        this.classid = '';
        this.sectionCourseLinkId = '';
        this.sectionList = [];
        this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
            this.classList = res as Array<ISetupClass>

        });
    }
    loadCampus() {
        this.campusRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.campusList = r as Array<ISetupCampus>

            })
    }

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }


    loadSections() {
        this.sectionList = [];
        if (this.campusProgramId.length > 0 && this.classid.length > 0) {
            var key = this.campusProgramId + '?' + this.classid
            this.enrollmentRepo.GetSectionList(key)
                .then(r => {
                    this.sectionList = r as Array<IRegistrationSectionCourseLinkVM>;
                    // console.log(this.sectionList==null)
                    if (this.sectionList == null) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Section not Defined',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }

                    this.datas = [];
                    this.sectionCourseLinkId = '';
                })
        }
    }
    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    loadProgramsOfCampus() {
        this.campusProgramId = ''
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            this.refreshData()
        });
    }
    // getGender() {
    //     this.genderModelCB = []
    //     this.genderRepo
    //         .GetAll()
    //         .then(response => {
    //             this.genderModel = response as Array<ISetupGender>
    //             if (this.genderModel.length > 0) {
    //                 this.idGender = this.genderModel[0].genderId
    //             }


    //         });
    // }
    loadAdmissionType() {
        this.admisisonTypeRepo.GetFindBy("s=>s.StatusId==1").then(r => {
            this.admissionTypeList = r as Array<ISetupAdmissionType>;
            if (this.admissionTypeList.length > 0) {
                this.admissionTypeId = this.admissionTypeList[0].admissionTypeId
            }
        });
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('notification' in this.user.claims) == true) {
                if (this.user.claims['notification'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['notification'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['notification'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['notification'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


    SaveData() {

        var where = "";

        if (this.sessionId.length > 0) {
            where = where + " AND \"SessionId\"=''" + this.sessionId + "''";
        }
        if (this.campusId.length > 0) {
            where = where + " AND \"CampusId\"=''" + this.campusId + "''";
        }

        if (this.campusProgramId.length > 0) {
            where = where + " AND \"CampusProgramId\"=''" + this.campusProgramId + "''";
        }
        if (this.classid.length > 0) {
            where = where + " AND \"ClassId\"=''" + this.classid + "''";
        }
        if (this.sectionCourseLinkId.length > 0) {
            where = where + " AND \"SectionCourseLinkId\"=''" + this.sectionCourseLinkId + "''";
        }

        var key = where + '?' + this.user.userId + '?' + this.Messaage;
        if (this.sessionId.length > 0) {
            // alert(where)
            this.notificationRepo.SendNotification(key)
                .then(r => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Notification Successfully Sent for Approval',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                })
        }
    }

    SaveBulkData() {
        // alert("ok")
        var session = "0";
        var campus = "0";
        var CampusProgramId = "0";
        var cclassid = "0";
        var sectionCourseLink = "0";
        var srollno = "0";
        var notifType = "Text";

        //  alert(JSON.stringify(sessionName))

        if (this.sessionId.length > 0) {
            var sessionName = this.sessionList.find(e => e.sessionId == this.sessionId).fullName;

            session = "" + sessionName + "";
        }

        if (this.campusId.length > 0) {
            // var campusName = this.campusCityList.find(e => e.campusId == this.campusId).campusName;

            campus = "" + this.campusId + "";
        }

        if (this.campusProgramId.length > 0) {
            //var programName = this.campusProgramLinkList.find(e => e.campusProgramId == this.campusProgramId).description;

            CampusProgramId = "" + this.campusProgramId + "";
        }
        if (this.classid.length > 0) {
            // var className = this.classList.find(e => e.classId == this.classid).fullName;

            cclassid = "" + this.classid + "";
        }
        if (this.sectionCourseLinkId.length > 0) {
            //var sectionName = this.sectionList.find(e => e.sectionCourseLinkId == this.sectionCourseLinkId).sectionName;

            sectionCourseLink = "" + this.sectionCourseLinkId + "";
        }

        if (this.typeid.length > 0) {
            var notifType2 = this.data.find(e => e.typeid == this.typeid).typeName;
            notifType = "" + notifType2 + "";
        }

        var dataNotification: INotificationCredntials = {
            sesseion: session,
            campus: campus,
            program: CampusProgramId,
            classstudent: cclassid,
            section: sectionCourseLink,
            rollno: srollno,
            notificationObject: {
                notification: this.Messaage,
                type: notifType,
                title: this.titletxt,
                image: this.imagetxt
            }
        }



        // this.datasnotification.push({

        //     "sesseion": "" + session + "",
        //     "campus": "" + campus + "",
        //     "program": "" + CampusProgramId + "",
        //     "classstudent": "" + cclassid + "",
        //     "section": "" + sectionCourseLink + "",
        //     "rollno": "" + srollno + "",
        //     "notificationObject": {
        //         "notification": "" + this.Messaage + "",
        //         "type": "" + notifType + ""
        //     }
        // })


        var key = JSON.stringify(dataNotification) + '?' + this.user.userId + '?' + this.Messaage;
        //alert(key)
        if (this.sessionId.length > 0) {
            this.notificationRepo.BulkNotificationSelection(key)
                .then(r => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Notification sent successfully for approval',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                })

        }
    }
    onFileChange(e) {
        //alert(JSON.stringify(e));
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        this.createImage(files[0]);
    }

    createImage(file) {

        var $this = this;
        helper.resizeImage({ file: file, maxSize: 120 })
            .then(resizeImage => {
                $this.imagetxt = resizeImage as string;
            });
    }

    removeImage() {
        if (this.imagetxt.length != 0) {
            this.imagetxt = '';
        }
    }



    refreshData() {

        //this.datas = [];
        var where = "";

        if (this.sessionId.length > 0) {
            where = where + " AND \"SessionId\"=''" + this.sessionId + "''";
        }
        if (this.campusId.length > 0) {
            where = where + " AND \"CampusId\"=''" + this.campusId + "''";
        }
        if (this.campusProgramId.length > 0) {
            where = where + " AND \"CampusProgramId\"=''" + this.campusProgramId + "''";
        }
        if (this.classid.length > 0) {
            where = where + " AND \"ClassId\"=''" + this.classid + "''";
        }
        if (this.sectionCourseLinkId.length > 0) {
            where = where + " AND \"SectionCourseLinkId\"=''" + this.sectionCourseLinkId + "''";
        }

    }
    check(model: IStudentToEnrollVM) {
        if (model.rollNo.length == 0) {
            model.isSelected = false;
        }
    }
    check2(model: IStudentToEnrollVM) {
        if (model.rollNo.length > 0) {
            this.enableCheckBox(model);
        }

    }
    enableCheckBox(model: IStudentToEnrollVM) {
        var start = Number(model.range.split('-')[0].toString());
        var end = Number(model.range.split('-')[1].toString());
        var rollNo = Number(model.rollNo);

        if ((rollNo >= start) && (rollNo <= end)) {
            model.isDisabled = true;
            model.isDisabled = false;
        } else {
            model.isSelected = false;
            model.isDisabled = true;
        }
    }
    showRange(model: IStudentToEnrollVM) {
        var range = this.sectionList.find(s => s.sectionId == model.sectionId)
        model.range = range.fromSerial + '-' + range.toSerial;
        this.check2(model)

    }
    saveModal(list) {
        this.saveDatasList = [];
        this.saveDatasList = list;
    }
    editModel(model: IScholarshipApplyVM) {
        // this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }


}