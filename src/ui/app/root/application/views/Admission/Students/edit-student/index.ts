import * as helper from '../../../../helper';

import { AdmissionStudentsService, SetupBloodGroupService, SetupBoardService, SetupDegreeService, SetupGenderService, SetupGroupService, SetupPassStatusService, SetupReligionService,SetupClassService } from '../../../../service';
import { IAcademicInfo, IAddressJsonB, IAdmissionStudents, IAdmissionStudentsEx, IGuardianJsonB, ISetupBloodGroup, ISetupBoard, ISetupDegree, ISetupGender, ISetupGroup, ISetupReligion ,ISetupClass} from '../../../../models';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, required } from 'vuelidate/lib/validators';

import Component from 'vue-class-component';
import { IPhoneNumber } from '../../../Setup/Address/add-edit';
import { MessageService } from '../../../../service/Message/message-service';

import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';
import { VueModelDate } from 'vue-model-date';

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
export class AdmissionStudentEdit extends Vue {
    private isActive: boolean = true;
    private  showDeleteConfirm : boolean = false;
        service: MessageService = new MessageService(this.$store)
    
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

    private addressJosn: Array<IAddressJsonB> = []
    private parentContactJosn: Array<IPhoneNumber> = []
    private studentContactJosn: Array<IPhoneNumber> = []
    private guardianJosn: Array<IGuardianJsonB> = []
    private academicInfoList: Array<IAcademicInfo> = [];
    private BoardList: Array<ISetupBoard> = [];
      private classList: Array<ISetupClass> = [];
    
    IPhoneList: Array<IPhoneNumber> = [];
    IAddressList: Array<IAddress> = [];
    private tempAdressType = '';
    academicsArray: Array<IAcademicInfo> = [];
attachmentsArray: Array<any> = [];
deleteIndex: number | null
hoverIndex: number | null


studentdata: Array<any> = [];
currentTab: 'Personal';
    private allowSubmitnew: boolean = true;

  private classRepository: SetupClassService = null;


    private data: IAdmissionStudentsEx = {
        guardianName: '', studentId: '', fullName: '', fatherName: '', studentCNIC: '', parentCNIC: '', studentContactNo: '', parentContactNo: '', guardians: '', genderId: '', dateOfBirth: new Date(), address: '', bloodGroupId: '', religionId: '', statusId: 0, loggerId: '', academicInfo: '', image: ''
        , board: '', degreeId: '', institute: '', totalMarks: '', obtainMarks: '', registrationNo: '', groupId: '', rollNo: '', year: ''
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
  maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }]


//   mounted() {
//     debugger;
//     this.loadClass();
// }
    created() {
        this.repository = new AdmissionStudentsService(this.$store);
        this.loadBloodGroup();
            this.classRepository = new SetupClassService(this.$store);

        this.loadGenderList();
        this.loadReligion();
        this.loadDegree();
        this.loadGroup();
        this.loadBoard();
        // this.loadClass();
        //     this.attachmentsArray.push(this.getEmptyAttachment());

    }


// onTabChange(newTab) {
//     alert('sadfdsfasdfds');
//     debugger;
//     this.currentTab = newTab;

//     // Attachments tab â†’ disable save
//     if (newTab === 'Attachments') {
//       this.allowSubmitnew = false;
//     } else {
//       this.allowSubmitnew = true; // baki tabs â†’ enable save
//     }
//   }


    onAttachmentsTabOpen() {
        debugger;
    console.log('Attachments tab opened');

    if (this.classList.length === 0) {
        this.loadClass();
    }

    if (this.attachmentsArray.length === 0) {
        this.attachmentsArray.push(this.getEmptyAttachment());
    }
}

   getEmptyAttachment() {
  return {
    classId: null,
    installNo: null,
    base64: '',
    fileName: '',
    pdfFile: false,
    fileUrl: '',
    uploading: false,
    uploaded: false,
    saved: false
  }
}

onAttachmentChange(event: any, index: number) {
    debugger;

  const file = event.target.files[0];
  if (!file) return;


   const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg'
  ];

  // âŒ Invalid file type check
  if (allowedTypes.indexOf(file.type) === -1){
    this.$store.dispatch(StoreTypes.updateStatusBar, {
      text: 'Invalid file type. Only PDF, PNG, or JPG files are allowed.',
      title: 'Error',
      messageTypeId: PayloadMessageTypes.error
    });

    // input reset (important)
    event.target.value = '';
    return;
  }
  const item = this.attachmentsArray[index];
  
console.log ('file size',file.size)
  // Size check
 if (file.size / 1024 > 250){
    this.$store.dispatch(StoreTypes.updateStatusBar, {
      text: 'Maximum file size should be 250KB',
      title: 'Error',
      messageTypeId: PayloadMessageTypes.error
    });
    return;
  }

  item.fileName = file.name;
item.pdfFile = file.type === 'application/pdf';
  item.uploading = true;

  // Preview
  const reader = new FileReader();
  reader.onload = (e: any) => {
    item.base64 = e.target.result;
    this.uploadAttachmentFile(item); // ðŸ‘ˆ IMMEDIATE UPLOAD
  };
  reader.readAsDataURL(file);
}

  hoverZoom(event: any) {
    const img = event.currentTarget;
    
    // Save original position if not already saved
    if (!img.dataset.originalPosition) {
      img.dataset.originalPosition = img.style.position || 'static';
      img.dataset.originalTop = img.style.top || 'auto';
      img.dataset.originalLeft = img.style.left || 'auto';
      img.dataset.originalZ = img.style.zIndex || 'auto';
      img.dataset.originalBoxShadow = img.style.boxShadow || 'none';
    }

    // Get current position on screen
    const rect = img.getBoundingClientRect();

    // Apply zoom and floating above content
    img.style.transform = 'scale(6)';       // Zoom factor
    img.style.position = 'fixed';           // float above all rows
    img.style.top = rect.top + 'px';
    img.style.left = rect.left + 'px';
    img.style.zIndex = '9999';
    img.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
  }
  hoverReset(event: any) {
    const img = event.currentTarget;
    
    // Revert back to original style
    img.style.transform = 'scale(1)';
    img.style.position = img.dataset.originalPosition;
    img.style.top = img.dataset.originalTop;
    img.style.left = img.dataset.originalLeft;
    img.style.zIndex = img.dataset.originalZ;
    img.style.boxShadow = img.dataset.originalBoxShadow;
  }




uploadAttachmentFile(item: any) {

  const ext = item.pdfFile ? '.pdf' : '.png';
  const guid = helper.newGuid();
  const fileName = guid + ext;

  // ðŸ‘‡ Final URL
  item.fileUrl =
    'https://emsuploads.cms.edu.pk/Notification/' + fileName;

  this.service.UpLoadFileEx(fileName + '?' + item.base64)
    .then(() => {
      item.uploaded = true;
      item.uploading = false;
    })
    .catch(() => {
      item.uploading = false;
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: 'File upload failed',
        title: 'Error',
        messageTypeId: PayloadMessageTypes.error
      });
    });
}

    addAttachmentRow() {
  this.attachmentsArray.unshift(this.getEmptyAttachment());
}

// removeAttachmentRow(index: number) {
//     this.attachmentsArray.splice(index, 1);
// }
removeAttachmentImage(index: number) {
  const item = this.attachmentsArray[index];

  // Clear image / pdf preview
  item.base64 = '';
  item.fileUrl = '';
  item.fileName = '';
  item.pdfFile = false;

  // Reset upload state
  item.uploaded = false;
  item.uploading = false;

  // Optional: file input reset (safety)
  this.$forceUpdate();
}

 openDeleteModal(index) {
    debugger;
  this.showDeleteConfirm =true;
  }

   closeDeleteConfirm() {
    this.showDeleteConfirm = false
    this.deleteIndex = null
  }

  confirmDelete() {
    this.removeAttachmentRow(this.deleteIndex)
    this.deleteIndex = null
    this.$modal.hide('delete-model')
  }

  cancelDelete() {
    this.deleteIndex = null
    this.$modal.hide('delete-model')
  }

removeAttachmentRow(index: number) {
    debugger;
  const item = this.attachmentsArray[index];

  if (item.saved && item.studentChallanAttachmentId) {
    // Call API to mark as deleted (StatusId = 0)
    this.repository.DeleteStudentAttachments(item.studentChallanAttachmentId)
      .then(() => {
        // Remove item from list after successful update
        this.attachmentsArray.splice(index, 1);

        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Attachment deleted successfully',
          title: 'Success',
          messageTypeId: PayloadMessageTypes.success
        });
    this.showDeleteConfirm = false

            this.loadstudentdata(this.data.studentId);

      })
      .catch(() => {
        this.$store.dispatch(StoreTypes.updateStatusBar, {
          text: 'Failed to delete attachment',
          title: 'Error',
          messageTypeId: PayloadMessageTypes.error
        });
      });
  } else {
    // New / unsaved attachment â€” just remove locally
    this.attachmentsArray.splice(index, 1);
  }
}



saveAttachmentRow(item: any) {
  if (!item.classId || !item.installNo || !item.uploaded) {
    this.$store.dispatch(StoreTypes.updateStatusBar, {
      text: 'Complete all fields & upload file',
      title: 'Validation',
      messageTypeId: PayloadMessageTypes.error
    });
    return;
  }

debugger;
  let alreadyExists = false;

if (this.studentdata && this.studentdata.length > 0) {
  alreadyExists = this.studentdata.some((row: any) =>
    row.classId === item.classId &&
    row.installmentNo === parseInt(item.installNo, 10) &&
    row.statusId === 1
  );
}

if (alreadyExists) {
  this.$store.dispatch(StoreTypes.updateStatusBar, {
    text: 'Same Class & Installment already exists',
    title: 'Duplicate Record',
    messageTypeId: PayloadMessageTypes.error
  });
  return;
}
  const payload = {
    admissionFormId: this.data.studentId,
    classId: item.classId,
    installmentNo: parseInt(item.installNo, 10),
    Image: item.fileUrl,
    FileName:item.fileName
  };

  this.repository.InsertStudentAttachment(payload).then(() => {
    this.$store.dispatch(StoreTypes.updateStatusBar, {
      text: 'Record has been inserted successfully',
      title: 'Success',
      messageTypeId: PayloadMessageTypes.success
    });
debugger;
    item.saved = true;

    // Add a NEW empty row after save
    this.addAttachmentRow();
    this.attachmentsArray[0].classId = '';
this.attachmentsArray[0].installNo = '';
   // this.cancel();
    this.loadstudentdata(this.data.studentId);
  });
}



// loadstudentdata(admissionFormId) {

//     debugger;
//   this.repository.GetStudentAttachments(admissionFormId).then(r => {
//     if (r && r.data) {
//       // Map API data to attachmentsArray
//       this.attachmentsArray = r.data.map(item => ({
//         classId: item.classId,
//         installNo: item.installmentNo,
//         base64: '',              
//         fileName: '',            
//         pdfFile: false,          
//         fileUrl: item.image,
//         uploading: false,
//         uploaded: true,          
//         saved: true,             
//         fullName: item.fullName
//       }));

//       // âœ… Add new empty row **at the start**
//       this.attachmentsArray.unshift({ ...this.getEmptyAttachment() });
//     }
//   });
// }

loadstudentdata(admissionFormId) {
    this.repository.GetStudentAttachments(admissionFormId).then(r => {
        debugger;
        if (r && r.length) {
            debugger;

    this.studentdata = r || [];
            // Clear existing attachments
            this.attachmentsArray.splice(0);

            // Push saved attachments
r.forEach(item => {
    this.attachmentsArray.push({
        classId: item.classId,
        installNo: item.installmentNo,
        base64: '',                                  // optional preview
        fileName: item.fileName || item.image.split('/').pop(),  // friendly name if available
        pdfFile: item.image.toLowerCase().endsWith('.pdf'),
        fileUrl: item.image,
        uploading: false,
        uploaded: true,
        saved: true,
        studentChallanAttachmentId:item.studentChallanAttachmentId,
        fullName: item.fullName
    });
});


            // Add a new empty row at the top
            this.attachmentsArray.unshift({ ...this.getEmptyAttachment() });
        }

        else
        {
            debugger;
            this.studentdata =[];
        }
    });
}




     loadClass() {
        debugger;
      //  this.addParam(this.checkclass, 'classId');
        this.classRepository.GetFindBy("e=>e.StatusId==1").then(r => {
          this.classList = r as Array<ISetupClass>;
        });
      }
    loadBloodGroup() {
        this.bloodGroupRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.bloodGroupList = r as Array<ISetupBloodGroup>
            })
    }
    loadReligion() {
        this.religionRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.religionList = r as Array<ISetupReligion>
            })
    }
    loadGenderList() {
        this.genderRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.genderList = r as Array<ISetupGender>
            })
    }
    loadDegree() {
        this.degreeRepo.GetFindBy("s=>s.StatusId==1").then(r => {
            this.degreeList = r as Array<ISetupDegree>;

        });
    }
    loadGroup() {
        this.groupRepo.GetFindBy("s=>s.StatusId==1").then(r => {
            this.groupList = r as Array<ISetupGroup>;
        });
    }
    loadBoard() {
        this.BoardRepository.GetFindBy("s=>s.StatusId==1").then(r => {
            this.BoardList = r as Array<ISetupBoard>;
        });
    }
    
    beforeModalOpen(event) {
        this.academicInfoList = [];
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
    this.loadstudentdata(this.data.studentId);

         this.attachmentsArray = [];

    // add first row
    this.attachmentsArray.push(this.getEmptyAttachment());

    // load class list
    if (this.classList.length === 0) {
        this.loadClass();
    }

        if (this.IsNewRecord) {

        }
        else {

            if (this.data.statusId == 1) {
                this.isActive = true
            }
            else {
                this.isActive = false
            }

            this.IPhoneList = [];
            this.IAddressList = [];
            this.parentContactJosn = [];
            this.studentContactJosn = [];


            let parentContactlist: Array<IPhoneNumber> = JSON.parse(this.data.parentContactNo)
            parentContactlist.forEach(element => {
                this.parentContactJosn.push({ phoneNo: element.phoneNo })
            });

            if (this.data.academicInfo.length < 3) {

                this.academicsArray.push(
                    {

                        degreeId: '',
                        registrationNo: '',
                        board: '',
                        year: '',
                        totalMarks: 0,
                        obtainMarks: 0,
                        classLevel: 0,
                        institute: '',
                        passStatusId: '',
                        groupId: '',
                        rollNo: ''

                    }


                )
            }

            else {

                this.academicInfoList = JSON.parse(this.data.academicInfo);

                this.academicInfoList.forEach(element => {

                    this.academicsArray.push({
                        degreeId: element.degreeId,
                        registrationNo: element.registrationNo,
                        board: element.board,
                        year: element.year,
                        totalMarks: element.totalMarks,
                        obtainMarks: element.obtainMarks,
                        classLevel: element.classLevel,
                        institute: element.institute,
                        passStatusId: element.passStatusId,
                        groupId: element.groupId,
                        rollNo: element.rollNo
                    })





                });
            }


            

    
            let studentContactlist: Array<IPhoneNumber> = JSON.parse(this.data.studentContactNo)
            studentContactlist.forEach(element => {
                this.studentContactJosn.push({ phoneNo: element.phoneNo })
            });

            // let guardianNames: Array<IGuardianJsonB> = JSON.parse(this.data.guardianName)
            // if (guardianNames.length > 0) {
            //     this.data.guardianName = guardianNames[0].name
            // }
            // studentContactlist.forEach(element => {
            //     this.studentContactJosn.push({ phoneNo: element.phoneNo })
            // });
            let Addresslist: Array<IAddress> = JSON.parse(this.data.address)
            Addresslist.forEach(element => {
                this.IAddressList.push({
                    addressType: element.addressType,
                    address: element.address
                })
            });




            // let address: Array<IAddressJsonB> = JSON.parse(this.data.address)

            // this.data.address = address[0].address;
            // let parentContactJosn: Array<IPhoneNumber> = JSON.parse(this.data.parentContactNo)
            // this.data.parentContactNo = parentContactJosn[0].phoneNo;
            // let studentContactNo: Array<IPhoneNumber> = JSON.parse(this.data.studentContactNo)
            // this.data.studentContactNo = studentContactNo[0].phoneNo;
            let guardianJosn: Array<IGuardianJsonB> = JSON.parse(this.data.guardians)
            //  alert(guardianJosn[0].name)
            if (guardianJosn[0].name == '') {
                this.data.guardians = ''
            }
            else {
                this.data.guardians = guardianJosn[0].name;

            }
            let addressJson: Array<IAddressJsonB> = JSON.parse(this.data.address)
            var mailingAddress = addressJson.find(s => s.addressType.toLowerCase().startsWith('mail'))
            if (mailingAddress.address == '') {
                this.data.address = ''
                this.tempAdressType = mailingAddress.addressType;
            }
            else {

                this.data.address = mailingAddress.address;
                this.tempAdressType = mailingAddress.addressType;


            }

            // alert(this.data.guardians)

        }
    }

    cancel() {
        this.$modal.hide('edit-model');
        this.academicsArray = [];
    }

    addAcademics() {
        if (this.academicsArray.length <= 2) {
            this.academicsArray.push(
                {

                    degreeId: '',
                    registrationNo: '',
                    board: '',
                    year: '',
                    totalMarks: 0,
                    obtainMarks: 0,
                    classLevel: 0,
                    institute: '',
                    passStatusId: '',
                    groupId: '',
                    rollNo: ''

                }


            )
        }
        else {

            alert('limit exceed')
        }
    }

    addParentPhoneNo() {
        this.parentContactJosn.push({ phoneNo: '' })
    }
    deleteAcademics(i) {
        this.academicsArray.splice(i, 1)
    }

    delParentPhoneNo(model: IPhoneNumber) {
        var index = this.parentContactJosn.indexOf(model);
        this.parentContactJosn.splice(index, 1)
    }

    addStudentPhoneNo() {
        this.studentContactJosn.push({ phoneNo: '' })
    }

    delStudentPhoneNo(model: IPhoneNumber) {
        var index = this.studentContactJosn.indexOf(model);
        this.studentContactJosn.splice(index, 1)
    }

    addAddress() {
        this.IAddressList.push({ addressType: 'Temporary', address: '' })
    }

    delAddress(model: IAddress) {
        var index = this.IAddressList.indexOf(model);
        this.IAddressList.splice(index, 1)
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
                $this.data.image = resizeImage as string;
            });
    }

    removeImage() {
        if (this.data.image.length != 0) {
            this.data.image = '';
        }
    }



    saveModel() {


        // this.addressJosn = []
        this.parentContactJosn = []
        this.studentContactJosn = []
        this.guardianJosn = []
        // this.addressJosn.push({ addressType: "", address: this.data.address })
        this.parentContactJosn.push({ phoneNo: this.data.parentContactNo })
        this.studentContactJosn.push({ phoneNo: this.data.studentContactNo })
        this.guardianJosn.push({ name: this.data.guardianName })
        this.data.address = JSON.stringify(this.IAddressList)
        this.data.guardians = JSON.stringify(this.guardianJosn)

        //    var index= this.IAddressList.indexOf(this.IAddressList.find(s=>s.addressType==this.tempAdressType))
        //    this.IAddressList.splice(index,1);
        //     this.IAddressList.push({address:this.data.address,addressType:this.tempAdressType})
        //     console.log(this.IAddressList)

        // alert(this.data.guardians)
        // this.data.parentContactNo = JSON.stringify(this.parentContactJosn)
        // this.data.studentContactNo = JSON.stringify(this.studentContactJosn)
        if (this.IsNewRecord) {

            this.data.studentId = helper.newGuid();
            this.data.loggerId = helper.newGuid();
            this.data.statusId = 1;
            this.data.dateOfBirth = new Date(this.data.dateOfBirth)

            //console.log(JSON.stringify(this.data))
            this.repository.AddOne(this.data)
                .then(() => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Record has been inserted successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                    this.cancel();
                });
        } else {
            if (this.isActive == true) {
                this.data.statusId = 1
            }
            else {
                this.data.statusId = 0
            }

            this.data.dateOfBirth = new Date(this.data.dateOfBirth)
            this.data.address = JSON.stringify(this.IAddressList);

            this.data.academicInfo = JSON.stringify(this.academicInfoList);
            this.data.parentContactNo = JSON.stringify(this.parentContactJosn)
            this.data.studentContactNo = JSON.stringify(this.studentContactJosn)
            this.data.academicInfo = JSON.stringify(this.academicsArray);
            this.academicsArray = [];

            this.repository.Update(this.data)
                .then(() => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Record has been updated successfully',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.success
                    })
                    this.cancel();
                });
        }

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
            (this.data.bloodGroupId.length > 0) 
            
    }

    $v: any;
}
export interface IPhoneNumber {
    contactNo: string
}
export interface IAddress {
    addressType: string;
    address: string
}