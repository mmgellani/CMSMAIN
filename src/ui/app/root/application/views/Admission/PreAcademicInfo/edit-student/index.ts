
import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IAdmissionStudents, ISetupBloodGroup, ISetupReligion, ISetupGender, IAddressJsonB, IGuardianJsonB, IAcademicInfo, ISetupDegree, ISetupGroup, ISetupBoard, IAdmissionStudentsEx, PreviousAcademicRecord, IPreAcademicInfo, ProgramCourseList, IAdmissionStudentsExx } from '../../../../models';
import { AdmissionStudentsService, SetupBloodGroupService, SetupReligionService, SetupGenderService, SetupDegreeService, SetupGroupService, SetupPassStatusService, SetupBoardService } from '../../../../service';

import * as helper from '../../../../helper';
import { VueModelDate } from 'vue-model-date';
import { studentprofile } from '../../..';

type ValidateAdmissionStudents = { data: IAdmissionStudents, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateAdmissionStudents> = {
    data: {
        //studentId: { required },
        fullName: { required },
        fatherName: { required },
        studentCNIC: { required },
        // guardians:{required},
        parentCNIC: { required },
        genderId: { required },
        dateOfBirth: { required },
        studentContactNo: { required },
        parentContactNo: { required },
        bloodGroupId: { required },
        religionId: { required },
        address: { required },
        academicInfo: { required }
        // statusId: { required },
        // loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'edit-model',
    template: require('./index.html'),
    directives: {
        'model-date': VueModelDate
    }
})
export class AdmissionPreAcademicInfoEdit extends Vue {
    private isActive: boolean = true;
    private repository: AdmissionStudentsService;
    private bloodGroupRepo: SetupBloodGroupService = new SetupBloodGroupService(this.$store)
    private religionRepo: SetupReligionService = new SetupReligionService(this.$store)
    private genderRepo: SetupGenderService = new SetupGenderService(this.$store)
    private degreeRepo: SetupDegreeService = new SetupDegreeService(this.$store);
    private groupRepo: SetupGroupService = new SetupGroupService(this.$store);
    private PassStatusRepo: SetupPassStatusService = new SetupPassStatusService(
        this.$store
    );
    private BoardRepository: SetupBoardService = new SetupBoardService(
        this.$store
    );

    private bloodGroupList: Array<ISetupBloodGroup> = []
    private religionList: Array<ISetupReligion> = []
    private genderList: Array<ISetupGender> = []
    private degreeList: Array<ISetupDegree> = [];
    private groupList: Array<ISetupGroup> = [];

    private addressJosn: Array<IAddressJsonB> = [];
    private guardianJosn: Array<IGuardianJsonB> = [];
    private academicInfoList: Array<IPreAcademicInfo> = [];
    private preacademicInfo: Array<PreviousAcademicRecord> = [];
    private programCourse: Array<ProgramCourseList> = [];
    private BoardList: Array<ISetupBoard> = [];
    IAddressList: Array<IAddress> = [];
    private tempAdressType = '';
    private degreeId = '';
    private studentId = '';
    private statusId = 0;
    academicsArray: Array<IPreAcademicInfo> = [];


    private data: IAdmissionStudentsExx = {
        campusProgramId: '', guardianName: '', studentId: '', fullName: '', fatherName: '', studentCNIC: '', parentCNIC: '', studentContactNo: '', parentContactNo: '', guardians: '', genderId: '', dateOfBirth: new Date(), address: '', bloodGroupId: '', religionId: '', statusId: 0, loggerId: '', academicInfo: '', image: ''
        , board: '', degreeId: '', institute: '', totalMarks: '', obtainMarks: '', registrationNo: '', groupId: '', rollNo: '', year: ''
    };
    private IsNewRecord: boolean = true;
    private title: string = '';

    created() {
        this.repository = new AdmissionStudentsService(this.$store);

    }


    loadDegree() {
        
        this.degreeRepo.GetFindBy("s=>s.StatusId==1"  ).then(r => {
            this.degreeList = r as Array<ISetupDegree>;
            this.degreeList = this.degreeList.filter(function (r) {
        return r.fullName !=='Ninth' && r.fullName !=='Supply' && r.fullName !=='O-Level' && 
        r.fullName !=='A-Level'&& r.fullName !=='Bachelor' && r.fullName !=='Eight' && r.fullName !=='No Result';
      });
      console.log(this.degreeList);
        });
    }
    loadCourse() {
        this.repository.GetProgramCourse().then(r => {
            this.programCourse = r as Array<ProgramCourseList>;

        });
    }

    beforeModalOpen(event) {
        this.academicInfoList = [];

        Object.assign(this.data, event.params.model);
        this.studentId = this.data.studentId;
        this.loadPreacademic(this.data.studentId);
        this.loadDegree();
        this.loadCourse();
    }
    checkMarks(option1, option2) {
        if (+option2 > +option1) {
            return true;
        }
        else {
            return false;
        }
    }

    loadPreacademic(key) {

        this.academicsArray = [];
        this.preacademicInfo = [];
        this.repository.GetStudentPreAcademic(key).then(r => {
            this.preacademicInfo = r as Array<PreviousAcademicRecord>;
            if (this.preacademicInfo.length == 0) {
                this.IsNewRecord = true;
                this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';

                this.academicsArray.push(
                    {
                        courseId: '',
                        totalMarks: '',
                        obtainMarks: '',
                    })
            }

            else {
                this.IsNewRecord = false;
                this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
                this.degreeId = this.preacademicInfo[0].degreeId
                if (this.preacademicInfo[0].statusId == 1) {
                    this.isActive = true
                }
                else {
                    this.isActive = false
                }

                this.academicInfoList = JSON.parse(this.preacademicInfo[0].academicMarksDetail);
                this.academicInfoList.forEach(element => {
                    this.academicsArray.push({
                        courseId: element.courseId,
                        totalMarks: element.totalMarks,
                        obtainMarks: element.obtainMarks
                    })
                });
            }
        });
    }

    loadPreacademicDegree() {

        this.academicsArray = [];
        this.preacademicInfo = [];
        var key = this.studentId + "?" + this.degreeId;
        this.repository.GetPreAcademicDegreeWise(key).then(r => {
            this.preacademicInfo = r as Array<PreviousAcademicRecord>;
            console.log('here')

            if (this.preacademicInfo.length == 0) {
                this.IsNewRecord = true;
                this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
                this.academicsArray.push(
                    {
                        courseId: '',
                        totalMarks: '',
                        obtainMarks: '',
                    })
            }

            else {
                this.IsNewRecord = false;
                this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
                this.degreeId = this.preacademicInfo[0].degreeId
                if (this.preacademicInfo[0].statusId == 1) {
                    this.isActive = true
                }
                else {
                    this.isActive = false
                }

                this.academicInfoList = JSON.parse(this.preacademicInfo[0].academicMarksDetail);
                this.academicInfoList.forEach(element => {
                    this.academicsArray.push({
                        courseId: element.courseId,
                        totalMarks: element.totalMarks,
                        obtainMarks: element.obtainMarks
                    })
                });
            }
        });
    }

    cancel() {
        this.$modal.hide('edit-model');
        this.academicsArray = [];
    }

    addAcademics() {
        debugger;
        this.academicsArray.push(
            {

                courseId: '',
                totalMarks: '',
                obtainMarks: '',
            }
        )
    }


    deleteAcademics(i) {
        this.academicsArray.splice(i, 1)
    }





    addAddress() {
        this.IAddressList.push({ addressType: 'Temporary', address: '' })
    }

    delAddress(model: IAddress) {
        var index = this.IAddressList.indexOf(model);
        this.IAddressList.splice(index, 1)
    }

    onFileChange(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        this.createImage(files[0]);
    }

    createImage(file) {

        var $this = this;
        helper.resizeImage({ file: file, maxSize: 120 })
            .then(resizeImage => {
                $this.data.image = resizeImage as string;
            });
    }

    removeImage() {
        if (this.data.image.length != 0) {
            this.data.image = '';
        }
    }



    saveModel() {
        debugger;
        if (this.IsNewRecord) {
            this.statusId = 1;

        }
        else {
            if (this.isActive) {
                this.statusId = 1;
            }
            else {
                this.statusId = 0;
            }
        }
        for (var i=0; i < this.academicsArray.length; i++) {
            if (this.academicsArray[i].courseId == '') {
                console.log('kjldsjfldsjfldsjflk')
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: "Please select course",
                    title: "Error",
                    messageTypeId: PayloadMessageTypes.error
                });
                return 0;
            }
        }
        
        var key = this.studentId + "?" + this.degreeId + "?" + JSON.stringify(this.academicsArray) + "?" + this.statusId;

        console.log(key);

        this.repository.InsetPreAcademicInfo(key).then(r => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Record Processed successfully",
                title: "Success",
                messageTypeId: PayloadMessageTypes.success
            });

        });
        this.cancel();

    }
    get allowSubmit() {
        // let error = this.$v.data.$error || this.$v.data.$invalid;
        // return !error;
        return (this.data.fullName.length > 0) &&
            (this.data.fatherName.length > 0) &&
            (this.data.genderId.length > 0) &&
            (this.data.parentCNIC.length > 0) &&
            (this.data.studentCNIC.length > 0) &&
            (this.data.studentContactNo.length > 0) &&
            (this.data.parentContactNo.length > 0) &&
            (this.data.religionId.length > 0) &&
            (this.data.bloodGroupId.length > 0);
    }

    $v: any;
}
export interface IPhoneNumberEx {
    contactNo: string
}
export interface IAddress {
    addressType: string;
    address: string
}