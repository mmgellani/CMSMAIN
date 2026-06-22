/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { AdmissionStudentsService, ExaminationExamTypeService, SetupClassService } from '../../../../service';
import { ExamUpdList, IAdmissionAdmissionFormCplVM, IAdmissionStudents, IAdmissionStudentsImage, IExaminationExamType, ISetupClass, IVWAdmissionFormCpl3, IVWStudentFeeProfile, IVWStudentsProfile, StudentsProfileCon } from '../../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import { HighlightSpanKind } from 'typescript';

// import { AdmissionStudentsAddEdit } from '../add-edit';
// import { AdmissionStudentsDelete } from '../delete';

// import { AdmissionStudentEdit } from '../edit-student';

@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': AdmissionStudentsAddEdit,
    //     'edit-model': AdmissionStudentEdit
    // }
})

export class ExamUpdationList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: AdmissionStudentsService;
    private repo: ExaminationExamTypeService = new ExaminationExamTypeService(this.$store)
    private classrepository: SetupClassService;
    examtypelist = [];
    courselist = [];
    private data: Array<IAdmissionStudents> = [];
    private datas: Array<IVWStudentFeeProfile> = [];
    private filterString: string = '';
    private admissionFormId: string = "";
    private classlist: Array<ISetupClass> = [];
    private classid: string = ''
    Hide = false;
    private finallist = [];
    private date: Date = new Date();
    datestring = '';
    cousreName = '';

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    examtyeid = '';
    private installmentNo = 1;

    private studentRecord: Array<ExamUpdList> = [];
    private TempstudentRecord: Array<ExamUpdList> = [];
    private Tempstudent2Record: Array<ExamUpdList> = [];


    private saveStudentRecord: Array<StudentsProfileCon> = [];
    private reposstudent: AdmissionStudentsService;
    private columns = [
        { key: 'examType', caption: 'ExamType' },
        { key: 'month', caption: "Month" },
        { key: 'fullName', caption: "Course" },
        { key: 'total', caption: "TotalMarks" },
        { key: 'obtained', caption: "Obtained" },
        { key: 'checked', caption: "Select All" }
    ];

    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }];

    created() {
        this.repository = new AdmissionStudentsService(this.$store);
        this.reposstudent = new AdmissionStudentsService(this.$store);
        this.classrepository = new SetupClassService(this.$store);
        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2);


        // this.repo.GetFindBy('e=>e.StatusId==1').then(r => {
        //     this.examtypelist = r as Array<IExaminationExamType>
        // })
    }

    GetClass() {
        this.classrepository.GetFindBy('e=>e.StatusId==1').then(r => {
            this.classlist = r as Array<ISetupClass>

        })


    }

    checklength() {

        return this.studentRecord.filter(e => e.checked == true).length;
    }
    save() {
        let smsid = '';
        this.finallist = [];

        this.TempstudentRecord.forEach(element => {
            if (element.checked == true) {
                this.finallist.push(element)



            }
            smsid += `''` + element.examMasterId + `'',`

        });

        smsid = smsid.substring(1, smsid.length - 2);




        var admissionFormId=this.finallist[0].admissionFormId;
        this.repo.UpdateExamData(JSON.stringify(this.finallist)+'?'+smsid+'?'+admissionFormId).then(r => {

            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: r,
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });



        })



    }
    mounted() {
        this.validatePage();
        this.GetClass();
    }

    ReloadData() {
        this.TempstudentRecord = [];



        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2);



        if (this.Hide == false) {
            this.TempstudentRecord = this.studentRecord.filter(e => e.examTypeId == this.examtyeid && e.monthDate == this.datestring)

        }
        if (this.Hide == true) {
            this.TempstudentRecord = this.studentRecord.filter(e => e.examTypeId == this.examtyeid && e.monthDate == this.datestring && e.fullName == this.cousreName)

        }








    }

    datapassing(){
        this.Tempstudent2Record=[];
        this.TempstudentRecord.forEach(element => {
            if (element.checked == true) {
                this.Tempstudent2Record.push(element)



            }
            

        });

    }

    getstudent() {
        this.courselist = [];
        this.studentRecord = [];
        this.reposstudent.GetStudentsExamUpd(this.filterString)
            .then(response => {
                this.studentRecord = response as Array<ExamUpdList>
                if (this.studentRecord.length == 0) {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'No Record found',
                        title: "Success",
                        messageTypeId: PayloadMessageTypes.error
                    });





                }
                else {
                    this.studentRecord.forEach(element => {
                        // if (this.examtypelist.length > 0) {
                        //     if (this.examtypelist.filter(e => e.examTypeId == element.examTypeId).length == 0)
                        //         this.examtypelist.push({
                        //             "examTypeId": element.examTypeId,
                        //             "fullName": element.examTypeName
                        //         }
                        //         )

                        // }
                        // else {
                        //     this.examtypelist.push({
                        //         "examTypeId": element.examTypeId,
                        //         "fullName": element.examType
                        //     }
                        //     )


                        // }
                        if (this.courselist.length > 0) {
                            if (this.courselist.filter(e => e.courseName == element.fullName).length == 0)
                                this.courselist.push({
                                    "courseName": element.fullName

                                }
                                )

                        }
                        else {
                            this.courselist.push({
                                "courseName": element.fullName

                            }
                            )


                        }


                    });



                }

            });
    }
    getAddress(item) {
        var j = '';
        j.toLowerCase().startsWith('error')
        var k = JSON.parse(item);

        return k;

    }

    editStudent(model: StudentsProfileCon) {
        //this.$modal.show('edit-model', { model: model, IsNewRecord: false});
        // var response = confirm('Are you sure to reverse concession?')
        // if (response) {
        var key = model.admissionFormId + '?' + model.challanTypeId + '?' + this.installmentNo + '?' + this.classid;
        this.reposstudent.ReverseConcession(key).then(r => {
            // alert(JSON.stringify(r))
            if (r[0].providedString.toLowerCase().startsWith('error')) {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: r[0].providedString,
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error
                });
            }
            else {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: r[0].providedString,
                    title: "Success",
                    messageTypeId: PayloadMessageTypes.success
                });
            }


        })
        // }
    }
    PopulateExamType()
    {
        this.examtypelist = [];
        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2);

        this.studentRecord.forEach(element => {
            if(element.monthDate==this.datestring)
            {
                if (this.examtypelist.length > 0) {
                    if (this.examtypelist.filter(e => e.examTypeId == element.examTypeId).length == 0)
                        this.examtypelist.push({
                            "examTypeId": element.examTypeId,
                            "fullName": element.examTypeName
                        }
                        )

                }
                else {
                    this.examtypelist.push({
                        "examTypeId": element.examTypeId,
                        "fullName": element.examTypeName
                    }
                    )


                }


                
            }
            
        });


    }
    saveModal(list) {
        this.saveStudentRecord = [];
        this.saveStudentRecord = list;
        // alert(JSON.stringify(this.saveStudentRecord))
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('examUpdationList' in this.user.claims) == true) {
                if (this.user.claims['examUpdationList'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['examUpdationList'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['examUpdationList'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['examUpdationList'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }
    getPhone(item) {
        return JSON.parse(item);
    }

    editModel(model: IVWStudentsProfile) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

}