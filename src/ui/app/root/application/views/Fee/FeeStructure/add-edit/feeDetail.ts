/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { ISetupClassCheckBox, IFeeFeeHeadCheckBox, ISetupProgram, ISetupShift, ISetupClass, IFeeFeeHead } from '../../../../models';
import { FeeFeeHeadService, FeeFeeStructureService } from '../../../../service';

import * as helper from '../../../../helper';
import { ISetupZoneCityLinkVM, IFeeFeeStructure } from '../../../../models';

@Component({
    mixins: [validationMixin],
    name: 'fee-detail',
    template: require('./FeeDetail.html'),
    props: ['zoneId', 'sessionId', 'feeHeadList',
        'installmentNo', 'program', 'shiftList', 'classList', 'tempCheckStatus',
        'tempFeeHead', 'saveTrigger','indexId'
    ]
})
export class FeeDetail extends Vue {
    private program: ISetupProgram = this.program
    private zoneId: string = this.zoneId
    private sessionId: string = this.sessionId
    private feeHeadList: Array<IFeeFeeHeadCheckBox> = this.feeHeadList
    private installmentNo: number = this.installmentNo
    private shiftList: Array<ISetupShift> = this.shiftList
    private classList: Array<ISetupClassCheckBox> = this.classList
    private tempCheckStatus: number = this.tempCheckStatus;
    private tempFeeHead: IFeeFeeHead = this.tempFeeHead
    private saveTrigger: boolean = this.saveTrigger
    private values: Array<feestr> = []
    private total: Array<feestr> = [];
    private index: number = 0;
    private indexId:number=this.indexId;
    //for keeping installments total
    private totalInstallments: Array<installStr> = [];

    //for keeping track of old values
    tempFeestrIter: Array<feestr> = [];
    feeArray: Array<IFeeFeeStructure>;

    //for saving data of all fee heads amount in different installments
    private val: Array<installStr> = [];
    i: number = 0;
    //for installments onetime or many time
    feechk: number = 0;
    json: string = "";

    private feeStrRepo: FeeFeeStructureService = new FeeFeeStructureService(this.$store)
    @Watch('indexId')
    executeind() {
        this.initializeValues();
        this.repopulateInstllment();
    }
    @Watch('classList')
    execute6() {
        this.initializeValues();
        this.repopulateInstllment();
    }

    @Watch('feeHeadList')
    execute() {
        this.initializeValues();
        this.repopulateInstllment();
    }

    @Watch('installmentNo')
    execute2() {
        this.repopulateInstllment();
    }

    @Watch('saveTrigger')
    private processSave() {

        this.feeArray = [];
        this.feeArray[0] = { feeStructureId: '', zoneId: '', sessionId: '', programId: '', shiftId: '', classId: '', feeHeadId: '', statusId: 1, feeAmount: 0, loggerId: '', isApproved: false };
        console.log('from watch '+this.saveTrigger)
        if (this.saveTrigger == true) {
            for (let item of this.values) {
                this.feeArray[this.index] = { feeStructureId: '', zoneId: '', sessionId: '', programId: '', shiftId: '', classId: '', feeHeadId: '', statusId: 1, feeAmount: 0, loggerId: '', isApproved: false };
                ++this.index;
            }
            this.index = 0;
            this.json = JSON.stringify(this.values);
            for (let item of this.values) {
                this.feeArray[this.index].feeStructureId = helper.newGuid();
                this.feeArray[this.index].zoneId = this.zoneId;
                this.feeArray[this.index].sessionId = this.sessionId;
                this.feeArray[this.index].programId = item.feName.toString().split(':')[0];
                this.feeArray[this.index].shiftId = item.feName.toString().split(':')[1];
                this.feeArray[this.index].classId = item.feName.toString().split(':')[2];
                this.feeArray[this.index].feeHeadId = item.feName.toString().split(':')[3];
                this.feeArray[this.index].statusId = 1;
                this.feeArray[this.index].feeAmount = item.value;
                this.feeArray[this.index].loggerId = helper.newGuid();

                ++this.index;
            }
            this.json = JSON.stringify(this.feeArray);
            // console.log('fee array')
            // console.log(this.json);
        }
        this.json = this.json + '?' + JSON.stringify(this.val);

        this.feeStrRepo.AddBulk(this.json)
            .then(r => {
                // console.log('installment array')
                // console.log(JSON.stringify(this.val));
                this.$modal.hide('add-edit-model');
                this.$emit("submit");
                this.$emit("enableSave");
            })

    }

    created() {
        console.log(this.saveTrigger)

    }

    initializeValues() {


        var tempArry: number[] = [];

        this.val = [];
        this.total = [];
        var count: number = 0;
        var chck: number = 0;

        //When user uncheck Feehead. tempCheckStatus value will be 0.
        // To remove the feehead from the values array.
        if (this.tempCheckStatus == 0) {
            for (let item of this.values) {
                if (item.feName.toString().split(':')[3] === this.tempFeeHead.feeHeadId) {
                    tempArry.push(this.values.indexOf(item))
                    if (tempArry.length == (this.shiftList.length * this.classList.length)) {
                        break;
                    }
                }
            }

            for (var v = 0; v < tempArry.length; v++) {
                this.values.splice(tempArry[v] - count, 1);
                count++;
            }
        }

        //When user check Feehead. tempCheckStatus value will be 1.
        // To add the feehead from the values array.
        else if (this.tempCheckStatus == 1) {

            //to check wether user has already entered data or not.
            for (var v = 0; v < this.values.length; v++) {
                if (this.values[v].value != 0) {
                    chck = 1;
                    break;
                }
            }
            // when user has not entered the data yet.
            if (chck == 0) {
                this.values = [];

                for (let fhead of this.feeHeadList) {
                    for (let shft of this.shiftList) {
                        for (let clas of this.classList) {

                            this.values.push({ feName: this.program.programId + ":" + shft.shiftId + ':' + clas.classId + ':' + fhead.feeHeadId, value: 0 });
                        }
                    }
                }
            }
            //when user has entered the data.
            // to add the feehead into the values array.
            else if (chck == 1) {
                for (let shft of this.shiftList) {
                    for (let clas of this.classList) {

                        this.values.push({ feName: this.program.programId + ":" + shft.shiftId + ':' + clas.classId + ':' + this.tempFeeHead.feeHeadId, value: 0 });
                    }
                }
            }

        }

        // initializing total array.
        for (let shft of this.shiftList) {
            for (let clas of this.classList) {
                this.total.push({ feName: this.program.programId + ":" + shft.shiftId + ':' + clas.classId, value: 0 });
            }
        }

        this.index = 0;
    }

    //for calculation total amount of all fee heads in a particular class and shift 
    calculateTotal() {
        var i = 0;
        var inc = 0;
        var tempinc = inc;
        var tempTotal = 0;
        var tempVar = this.shiftList.length * this.classList.length;

        for (let shft of this.shiftList) {
            for (let clas of this.classList) {
                tempinc = inc;
                for (var c = 0; c < this.feeHeadList.length; c++) {
                    tempTotal = +tempTotal + +this.values[inc].value
                    inc = inc + tempVar;
                    this.total[i].value = tempTotal;
                }
                inc = tempinc + 1;
                tempTotal = 0;
                i++;
            }

        }


    }

    //for handling installments amount entered by user
    repopulateInstllment() {


        this.totalInstallments = [];

        //initialize totalInstallments array.
        if (this.installmentNo != 0) {
            for (var x = 0; x < this.installmentNo; x++) {
                this.totalInstallments.push({ feestr: new Array<feestr>() });
                for (let shft of this.shiftList) {
                    for (let clas of this.classList) {
                        this.totalInstallments[x].feestr.push({ feName: this.program.programId + ":" + shft.shiftId + ':' + clas.classId + x, value: 0 });
                    }
                }

            }

            //to get the length of feestr on 0th index of totalInstallments array. this is used to iterate the loop in html.
            this.tempFeestrIter = this.totalInstallments[0].feestr;

        }


        this.val = [];
        this.i = 0;

        // Dividing the values to total number of instllments.
        for (var j = 0; j < this.installmentNo; j++) {
            this.val.push({ feestr: new Array<feestr>() });
            for (let fhead of this.feeHeadList) {
                for (let shft of this.shiftList) {
                    for (let clas of this.classList) {
                        if (fhead.feeType == 1 && j == 0) {

                            this.feechk = this.values[this.i].value;
                        }
                        else if (fhead.feeType == 1) {

                            this.feechk = 0;
                        }
                        else {
                            this.feechk = parseFloat((this.values[this.i].value / this.installmentNo).toFixed(2));
                        }
                        // parseFloat((this.values[this.i].value / this.installments).toFixed(2))
                        this.val[j].feestr.push({ feName: this.program.programId + ":" + shft.shiftId + ':' + clas.classId + ':' + fhead.feeHeadId + ':' + j, value: this.feechk });
                        this.i++;
                    }
                }
            }
            this.i = 0;
        }

        this.calculateTotal();
        this.calculateInstallmentTotal();


    }

    //for calculation installment's total amount of all fee heads in a particular class and shift 
    calculateInstallmentTotal() {

        var i = 0;
        var inc = 0;
        var tempinc = inc;
        var tempTotal = 0;
        var tempVar = this.shiftList.length * this.classList.length;

        if (this.installmentNo != 0) {
            for (var z = 0; z < this.installmentNo; z++) {


                for (let shft of this.shiftList) {
                    for (let clas of this.classList) {
                        tempinc = inc;
                        for (var c = 0; c < this.feeHeadList.length; c++) {
                            //installment total
                            tempTotal = +tempTotal + +this.val[z].feestr[inc].value
                            inc = inc + tempVar;

                            this.totalInstallments[z].feestr[i].value = tempTotal;
                        }
                        inc = tempinc + 1;
                        tempTotal = 0;
                        i++;
                    }

                }
                i = 0;
                inc = 0;
            }
            this.tempFeestrIter = this.totalInstallments[0].feestr;

        }


    }

    get shiftSpacing() {
        return 'col-md-' + (12 / this.shiftList.length);
    }

    get classSpacing() {
        return 'col-md-' + (12 / this.classList.length);
    }

    get classShiftSpacing() {
        return 'col-md-' + (12 / (this.classList.length * this.shiftList.length));
    }


}


interface feestr {
    feName: string;
    value: number;
}

interface installStr {
    feestr: feestr[]
}