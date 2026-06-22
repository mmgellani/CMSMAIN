import { SmsApproval } from './../application/views/Message/SmsApproval/list/index';
import { RouteConfig as VueRouteConfig } from 'vue-router';
import { PageForbidden, Login, PageNotFound, Search, Verify } from '../../components';

import { AreaLayout } from '../layout/layout'
import { AreaLayoutEx } from '../layout/layout-ex';
//import { AreaLayout } from '../sing-layout/layout';

import { Home } from '../home/home';
import { Profile } from '../profile/profile';
// import { Signup } from '../signup/signup';
import { RouteNames } from './route-names';

import * as view from '../application/views';

// import { FullFee } from '../Cms360/views/Fee/FullFee/list/index';



export const RouteConfig: VueRouteConfig[] = [
    <VueRouteConfig>{
        component: AreaLayout,
        path: '/',
        meta: { private: true },
        children: [
            { component: Home, name: RouteNames.home, path: '', alias: '/home' },
            { component: Profile, name: RouteNames.profile, path: '/profile' },
            { component: Search, name: RouteNames.search, path: '/search/:searchText' },
            { component: Search, name: RouteNames.search + 'default', path: '/search' },
            { component: Verify, name: RouteNames.login.verify, path: '/verification' },

            { component: view.RolePrevilagesList, name: RouteNames.Views.RolePrevilages, path: '/roleprevilages' },
            { component: view.RoleUserLogList, name: RouteNames.Views.UserLog, path: '/userLog' },
            { component: view.SecurityClaimUpd, name: RouteNames.Views.SecurityClaimsUpd, path: '/securityclaims' },
            { component: view.SectionRightLink, name: RouteNames.Views.SectionRightLink, path: '/sectionRightLink' },
            { component: view.MaskRightLink, name: RouteNames.Views.MaskRightLink, path: '/maskRightLink' },

            // { component: view.UserRecord, name: RouteNames.Views.UserRecord, path: '/user' },
            { component: view.AdmissionAdmissionFormListBr, name: RouteNames.Views.admissionAdmissionFormBr, path: '/admissionAdmissionFormBr' },
            { component: view.BulkCopyProgramDetail, name: RouteNames.Views.bulkCopyProgramDetail, path: '/bulkCopyProgramDetail' },

            { component: view.AdmissionAdmissionFormList, name: RouteNames.Views.admissionAdmissionForm, path: '/admissionAdmissionForm' },
            { component: view.Helper, name: RouteNames.Views.helper, path: '/helper' },
            { component: view.AdmissionBulitanSaleList, name: RouteNames.Views.admissionBulitanSale, path: '/admissionBulitanSale' },
            { component: view.AdmissionInquiryList, name: RouteNames.Views.admissionInquiry, path: '/admissionInquiry' },
            { component: view.AdmissionEligibilityCriteriaList, name: RouteNames.Views.admissionEligibilityCriteria, path: '/admissionEligibilityCriteria' },
            { component: view.AdmissionSaleTypeList, name: RouteNames.Views.admissionSaleType, path: '/admissionSaleType' },
            { component: view.ProgramFeeAdjustmentList, name: RouteNames.Views.programFeeAdjustment, path: '/programFeeAdjustment' },

            { component: view.AdmissionStudentsList, name: RouteNames.Views.admissionStudents, path: '/admissionStudents' },
            { component: view.AdmissionPreAcademicInfoList, name: RouteNames.Views.admissionPreAcademicInfo, path: '/admissionPreAcademicInfo' },
            { component: view.AdmissionStudentsImageList, name: RouteNames.Views.admissionStudentsImage, path: '/admissionStudentsImage' },
            { component: view.studentprofile, name: RouteNames.Views.studentprofile, path: '/studentprofile' },


            { component: view.ProgramTransfer, name: RouteNames.Views.ProgramTransfer, path: '/ProgramTransfer' },
            { component: view.ProgramTransferBulk, name: RouteNames.Views.ProgramTransferBulk, path: '/ProgramTransferBulk' },
            { component: view.CampusTransferBulk, name: RouteNames.Views.CampusTransferBulk, path: '/CampusTransferBulk' },

            { component: view.StateChange, name: RouteNames.Views.StateChange, path: '/StateChange' },
            { component: view.SessionDurationList, name: RouteNames.Views.sessionDuration, path: '/sessionDuration' },

            { component: view.AttendanceAttendanceDetailList, name: RouteNames.Views.attendanceAttendanceDetail, path: '/attendanceAttendanceDetail' },
            { component: view.AttendanceAttendenceMasterList, name: RouteNames.Views.attendanceAttendenceMaster, path: '/attendanceAttendenceMaster' },
            { component: view.AttendanceAttendenceStatusList, name: RouteNames.Views.attendanceAttendenceStatus, path: '/attendanceAttendenceStatus' },
            { component: view.AttendenceDashboard, name: RouteNames.Views.attendanceAttendenceDashboard, path: '/attendanceAttendenceDashboard' },
            { component: view.AttendenceDashboard2, name: RouteNames.Views.attendanceAttendenceDashboard2, path: '/attendanceAttendenceDashboard2' },

            { component: view.ConcessionDashboard, name: RouteNames.Views.concessionDashboard, path: '/concessionDashboard' },
            { component: view.AdmissionDashboard, name: RouteNames.Views.admissionDashboard, path: '/admissionDashboard' },
            { component: view.AdmissionComaprisonDashboard, name: RouteNames.Views.admissionComaprisonDashboard, path: '/admissionComaprisonDashboard' },
            { component: view.AssessmentCategory, name: RouteNames.Views.assessmentCategory, path: '/assessmentCategory' },
            { component: view.AssessmentSchedule, name: RouteNames.Views.assessmentSchedule, path: '/assessmentSchedule' },

            { component: view.AdmissionComaprisonDashboardCampusWise, name: RouteNames.Views.admissionComaprisonDashboard, path: '/admissionComaprisonDashboardCampusWise' },
            { component: view.AdmissionComaprisonDashboardCampusWiseClone, name: RouteNames.Views.admissionComaprisonDashboardCampusWiseClone, path: '/admissionComaprisonDashboardCampusWiseClone' },

            { component: view.ComparisonDashboard, name: RouteNames.Views.comparisonDashboard, path: '/comparisonDashboard' },

            { component: view.FeePaidDashboard, name: RouteNames.Views.feePaidDashboard, path: '/feePaidDashboard' },
            { component: view.NotificationDashboard, name: RouteNames.Views.surveyDashboard, path: '/surveyDashboard' },
            // { component: view.NotificationDash, name: RouteNames.Views.notificationDash, path: '/notificationDashboard2' },

            { component: view.SurveyDash, name: RouteNames.Views.SurveyDash, path: '/CMSStudentCount' },
            { component: view.SurveyDashDecember, name: RouteNames.Views.SurveyDashDecember, path: '/CMSStudentCountDecember2021' },
            { component: view.SurveyDashApril, name: RouteNames.Views.SurveyDashDecember, path: '/CMSStudentCountApril2022' },

            { component: view.SurveyDashDecember22, name: RouteNames.Views.SurveyDashDecember22, path: '/CMSStudentCountDecember2022' },
            { component: view.SurveyDashJuly23Statistics, name: RouteNames.Views.SurveyDashJuly23Statistics, path: '/CMSStudentCountJuly2023Statistics' },
            { component: view.SurveyDashjan22, name: RouteNames.Views.SurveyDashjan22, path: '/CMSStudentCountjan2022' },
            { component: view.SurveyDashjuly23, name: RouteNames.Views.SurveyDashjuly23, path: '/CMSStudentCountjuly2023' },
            { component: view.SurveyDashboardJanuary24, name: RouteNames.Views.SurveyDashboardJanuary24, path: '/SurveyDashboardJanuary24' },
            { component: view.SurveyDashboardJanuary26, name: RouteNames.Views.SurveyDashboardJanuary26, path: '/SurveyDashboardJanuary26' },

            { component: view.SurveyDashboardJanuary25, name: RouteNames.Views.SurveyDashboardJanuary25, path: '/SurveyDashboardJanuary25' },
            { component: view.SurveyDashJune24Statistics, name: RouteNames.Views.SurveyDashJune24Statistics, path: '/CMSStudentCountJune2024Statistics' },

            { component: view.SurveyDashJan26Statistics, name: RouteNames.Views.SurveyDashJan26Statistics, path: '/CMSStudentCountJan2026Statistics' },
            { component: view.SurveyDashJan25Statistics, name: RouteNames.Views.SurveyDashJan25Statistics, path: '/CMSStudentCountJan2025Statistics' },
         
            { component: view.SurveyDashEbooks24Statistics, name: RouteNames.Views.SurveyDashEbooks24Statistics, path: '/CMSStudentCountEbook2024Statistics' },
            { component: view.SurveyDashjune24, name: RouteNames.Views.SurveyDashjune24, path: '/CMSStudentCountjune2024' },
            { component: view.SurveyDashEbook24, name: RouteNames.Views.SurveyDashEbook24, path: '/CMSStudentCountEbook2024' },

            { component: view.LevelProgramClassMap, name: RouteNames.Views.LevelProgramClassMap, path: '/LevelProgramClassMap' },
            { component: view.AssessmentSectionMap, name: RouteNames.Views.AssessmentSectionMap, path: '/AssessmentSectionMap' },

            { component: view.AssessmentScheduling, name: RouteNames.Views.assessmentScheduling, path: '/AssessmentScheduling' },
            { component: view.AdmissionRollNoSlip, name: RouteNames.Views.admissionRollNoSlip, path: '/AdmissionRollNoSlip' },

            { component: view.RevenueDashboard, name: RouteNames.Views.revenueDashboard, path: '/revenueDashboard' },
            // { component: view.TeacherDashboard, name: RouteNames.Views.teacherDashBoard, path: '/teacherDashBoard' },
            { component: view.AcademicHolidayType, name: RouteNames.Views.academicholidaytype, path: '/holidaytype' },
            { component: view.AcademicHolidays, name: RouteNames.Views.academicholidays, path: '/holidays' },
            { component: view.AcademicEvents, name: RouteNames.Views.academicevents, path: '/events' },
            { component: view.CalendarConfirmation, name: RouteNames.Views.calendarConfirmation, path: '/calendarConfirmation' },

            { component: view.SmsToStudents, name: RouteNames.Views.smstostudent, path: '/smstostudent' },


            { component: view.TeacherTimeTable, name: RouteNames.Views.teacherTimeTable, path: '/viewTimeTable' },
            { component: view.TeacherAttendanceReport, name: RouteNames.Views.teacherAttendanceReport, path: '/teacherAttendanceReport' },

            { component: view.AcademicCalendarNew, name: RouteNames.Views.academicCalendarNew, path: '/academicCalendar' },
            { component: view.TeacherExamReport, name: RouteNames.Views.teacherExamReport, path: '/academicCalendarOld' },
            { component: view.AcademicCalendarType, name: RouteNames.Views.academicCalendarType, path: '/academicCalendarType' },
            { component: view.AcademicCalendarMaster, name: RouteNames.Views.academicCalendarMaster, path: '/academicCalendarMaster' },
            { component: view.AcademicCalendarReport, name: RouteNames.Views.academicCalendarReport, path: '/academicCalendarReport' },
            { component: view.AcademicSectionMap, name: RouteNames.Views.academicSectionMap, path: '/academicSectionMap' },

            { component: view.PushNotification, name: RouteNames.Views.pushNotification, path: '/pushNotification' },

            { component: view.PushNotificationCampus, name: RouteNames.Views.pushNotificationCampus, path: '/pushNotificationCampus' },

            { component: view.StudentRoster, name: RouteNames.Views.studentRoster, path: '/studentRoster' },
            { component: view.AttendanceRegister, name: RouteNames.Views.AttendanceRegister, path: '/attendanceRegister' },
            { component: view.StudentAttendance, name: RouteNames.Views.StudentAttendance, path: '/studentAttendance' },
            { component: view.AdmissionStudentFeeInfo, name: RouteNames.Views.admissionStudentFeeInfo, path: '/admissionStudentFeeInfo' },

            { component: view.UserCreation, name: RouteNames.Views.enrollmentBatch, path: '/enrollmentBatch' },
            { component: view.MicrosoftStdPassword, name: RouteNames.Views.microsoftStdPassword, path: '/microsoftStdPassword' },
            { component: view.ssatStudentData, name: RouteNames.Views.ssatStudentData, path: '/ssatStudentData' },
            { component: view.UserCreation, name: RouteNames.Views.UserCreation, path: '/UserCreation' },

            { component: view.AttendanceBulk, name: RouteNames.Views.attendanceBulk, path: '/attendanceBulk' },
            { component: view.AttendanceTeacher, name: RouteNames.Views.attendanceTeacher, path: '/attendanceTeacher' },
            { component: view.AttendanceTeacherBulk, name: RouteNames.Views.attendanceTeacherBulk, path: '/attendanceTeacherBulk' },

            { component: view.AttendanceTeacherUser, name: RouteNames.Views.attendanceTeacher, path: '/attendanceTeacherUser' },
            { component: view.DayClose, name: RouteNames.Views.dayClose, path: '/dayClose' },
            { component: view.MarkDayEnd, name: RouteNames.Views.markDayEnd, path: '/markDayEnd' },
            { component: view.DailyAttendanceStatus, name: RouteNames.Views.DailyAttendanceStatus, path: '/dailyAttendanceStatus' },

            { component: view.AttendanceBulkDetail, name: RouteNames.Views.attendanceBulkDetail, path: '/attendanceBulkDetail' },
            { component: view.LeaveManagement, name: RouteNames.Views.leaveManagement, path: '/leaveManagement' },
            { component: view.LeaveManagementTesting, name: RouteNames.Views.leaveManagementtest, path: '/leaveManagementtest' },
            { component: view.LeaveApproval, name: RouteNames.Views.leaveApproval, path: '/leaveApproval' },

            { component: view.BoardBoardCampusList, name: RouteNames.Views.boardCampus, path: '/boardCampus' },
            { component: view.BoardRegistrationCode, name: RouteNames.Views.registrationCode, path: '/registrationCode' },
            { component: view.BoardCampusStudentLinkList, name: RouteNames.Views.boardCampusStudentLink, path: '/boardCampusStudentLink' },
            { component: view.SessionBoardExamTypeList, name: RouteNames.Views.SessionBoardExamTypeList, path: '/SessionBoardExamTypeList' },
            { component: view.BoardProgramCampusList, name: RouteNames.Views.BoardProgramCampusList, path: '/BoardProgramCampusList' },
            { component: view.ReturnTypeList, name: RouteNames.Views.returnTypeList, path: '/returnTypeList' },

            { component: view.BoardStudentBoardLinkList, name: RouteNames.Views.BoardStudentBoardLinkList, path: '/BoardStudentBoardLinkList' },
            { component: view.BoardStudentRegistrationNo, name: RouteNames.Views.boardStudentRegistrationNo, path: '/boardStudentRegistrationNo' },
            { component: view.BoardUniversityExamEntry, name: RouteNames.Views.boardUniversityExamEntry, path: '/boardUniversityExamEntry' },
            { component: view.BoardUniversitySearchStudent, name: RouteNames.Views.boardUniversitySearchStudent, path: '/boardUniversitySearchStudent' },
            { component: view.OnlineFormApprovalList, name: RouteNames.Views.onlineFormApproval, path: '/onlineFormApproval' },

            { component: view.BoardUniversityRollNo, name: RouteNames.Views.boardUniversityRollNo, path: '/boardUniversityRollNo' },
            { component: view.BoardUniversityResultCard, name: RouteNames.Views.boardUniversityResultCard, path: '/boardUniversityResultCard' },




            { component: view.SessionBoardFeeList, name: RouteNames.Views.sessionBoardFeeList, path: '/sessionBoardFeeList' },
            { component: view.BoardFee, name: RouteNames.Views.boardFee, path: '/boardFee' },

            { component: view.SmartAttendence, name: RouteNames.Views.SmartAttendance, path: '/smartAttendence' },


            { component: view.AttendanceApproval, name: RouteNames.Views.attendanceApproval, path: '/attendanceApproval' },
            { component: view.AttendanceApproval, name: RouteNames.Views.attendanceApproval, path: '/attendanceApproval' },

            { component: view.AttendanceApprovalRemove, name: RouteNames.Views.attendanceApprovalRemove, path: '/attendanceApprovalRemove' },
            { component: view.AttendanceHistoryList, name: RouteNames.Views.attendanceHistory, path: '/attendanceHistory' },
            { component: view.StruckoffReinstate, name: RouteNames.Views.struckoffReinstate, path: '/struckoffReinstate' },
            { component: view.ExamBulk, name: RouteNames.Views.examBulk, path: '/examBulk' },
            { component: view.ExamScheduleDetail, name: RouteNames.Views.examScheduleDetail, path: '/examScheduleDetail' },

            // { component: view.ExaminationCampusGradingPolicyLinkList, name: RouteNames.Views.examinationCampusGradingPolicyLink, path: '/examinationCampusGradingPolicyLink' },
            { component: view.ExaminationExamDetailList, name: RouteNames.Views.examinationExamDetail, path: '/examinationExamDetail' },
            { component: view.ExaminationExamMasterList, name: RouteNames.Views.examinationExamMaster, path: '/examinationExamMaster' },
            { component: view.ExaminationExamTypeList, name: RouteNames.Views.examinationExamType, path: '/examinationExamType' },
            { component: view.LevelDefinition, name: RouteNames.Views.LevelDefinition, path: '/LevelDefinition' },
            { component: view.AssessmentReport, name: RouteNames.Views.AssessmentReport, path: '/AssessmentReport' },
            { component: view.ExaminationGradingPolicyList, name: RouteNames.Views.examinationGradingPolicy, path: '/examinationGradingPolicy' },
            { component: view.ExaminationGradingPolicyBulkList, name: RouteNames.Views.gradingPolicyBulk, path: '/gradingPolicyBulk' },
            { component: view.ExaminationExamSectionLink, name: RouteNames.Views.examinationExamSectionLink, path: '/examinationExamSectionLink' },
            { component: view.ExaminationExamScheduleList, name: RouteNames.Views.examinationExamSchedule, path: '/examinationExamSchedule' },
            { component: view.FailCriteria, name: RouteNames.Views.failCriteria, path: '/failCriteria' },
            { component: view.TeacherEvaulation, name: RouteNames.Views.failCriteria, path: '/teacherEvaluation' },

            { component: view.GradingCriteria, name: RouteNames.Views.gradingCriteria, path: '/gradingCriteria' },
            { component: view.ExaminationCampusFailCriteriaMappingList, name: RouteNames.Views.campusFailCriteriaMapping, path: '/campusFailCriteriaMapping' },
            { component: view.ExaminationCampusGradingMappingList, name: RouteNames.Views.campusGradingMapping, path: '/campusGradingMapping' },
            { component: view.TeacherExam, name: RouteNames.Views.teacherExam, path: '/teacherExam' },

            { component: view.TeacherExam2, name: RouteNames.Views.teacherExam2, path: '/teacherExam2' },


            // { component: view.CampusGradingMapping, name: RouteNames.Views.campusGradingMapping, path: '/campusGradingMapping' },
            { component: view.ExaminationReports, name: RouteNames.Views.examinationReports, path: '/examinationReports' },
            { component: view.TransportationReports, name: RouteNames.Views.transportationReports, path: '/transportationReports' },
            { component: view.ExaminationReports2, name: RouteNames.Views.examinationReports2, path: '/examinationReports2' },
            { component: view.ExaminationReportsEx, name: RouteNames.Views.examinationReportsEx, path: '/examinationReportsEx' },


            { component: view.ExamUnApproval, name: RouteNames.Views.examUnApproval, path: '/examUnApproval' },
            { component: view.ExamUnApprovalExam2, name: RouteNames.Views.examUnApprovalexam2, path: '/examUnApprovalexam2' },


            { component: view.ExamApproval, name: RouteNames.Views.examApproval, path: '/examApproval' },
            { component: view.ExamSMSApproval, name: RouteNames.Views.examSMSApproval, path: '/examSMSApproval' },
            { component: view.ExamApprovalExam2, name: RouteNames.Views.examApprovalexam2, path: '/examApprovalexam2' },

            { component: view.ExamDeletion, name: RouteNames.Views.examDeletion, path: '/examDeletion' },
            { component: view.ExamDeletion2, name: RouteNames.Views.examDeletion, path: '/examDeletion2' },

            { component: view.ExamResultApproval, name: RouteNames.Views.examResultApproval, path: '/examResultApproval' },
            { component: view.FeeBankList, name: RouteNames.Views.feeBank, path: '/feeBank' },
            { component: view.CreditNotes, name: RouteNames.Views.creditnotes, path: '/CreditNotes' },
            { component: view.StudentFeedback, name: RouteNames.Views.studentfeedback, path: '/studentfeedback' },
            { component: view.WithdrawnConcessionReversal, name: RouteNames.Views.withdrawnConcessionReversal, path: '/WithdrawnConcessionReversal' },
            { component: view.applyConcessionOnInstallment, name: RouteNames.Views.applyConcessionOnInstallment, path: '/applyConcessionOnInstallment' },
            { component: view.FeeCampusBankLinkList, name: RouteNames.Views.feeCampusBankLink, path: '/feeCampusBankLink' },
            { component: view.AdhocChallanLinkList, name: RouteNames.Views.adhocChallanLink, path: '/adhocChallanLink' },

            { component: view.FeeCampusChallanNoteLinkList, name: RouteNames.Views.feeCampusChallanNoteLink, path: '/feeCampusChallanNoteLink' },
            { component: view.FeeChallanNoteList, name: RouteNames.Views.feeChallanNote, path: '/feeChallanNote' },
            { component: view.FeeChallanTypeList, name: RouteNames.Views.feeChallanType, path: '/feeChallanType' },
            { component: view.FeeChallanValidityList, name: RouteNames.Views.feeChallanValidity, path: '/feeChallanValidity' },
            { component: view.FeeConcessionList, name: RouteNames.Views.feeConcession, path: '/feeConcession' },
            { component: view.FeeConcessionBulkList, name: RouteNames.Views.feeConcessionBulk, path: '/feeConcessionBulk' },
            { component: view.FeeApplyConcessionBulk, name: RouteNames.Views.feeApplyConcessionBulk, path: '/feeApplyConcessionBulk' },
            { component: view.FeeApplyConcessionBulkPre, name: RouteNames.Views.applyBulkChallanPre, path: '/applyBulkChallanPre' },
            { component: view.FeeApplyConcession, name: RouteNames.Views.feeApplyConcession, path: '/feeApplyConcession' },
            { component: view.FinanceData, name: RouteNames.Views.financeData, path: '/financeData' },

            { component: view.StudentFeeConfirmation, name: RouteNames.Views.feeConfirmation, path: '/feeConfirmation' },
                        { component: view.ChallanReversal, name: RouteNames.Views.challanReversal, path: '/challanReversal' },


            
            { component: view.StudentRefundChallan, name: RouteNames.Views.refundchallan, path: '/refundchallan' },

            { component: view.StudentFeeChallanSearch, name: RouteNames.Views.feeChallanSearch, path: '/feeChallanSearch' },
            { component: view.StudentFeeDetailDescriptionList, name: RouteNames.Views.StudentFeeDetailDescription, path: '/StudentFeeDetailDescription' },
            { component: view.ChallanCancel, name: RouteNames.Views.challanCancel, path: '/ChallanCancel' },
            { component: view.SectionFine, name: RouteNames.Views.sectionFine, path: '/SectionFine' },

            { component: view.StudentChangePaidDate, name: RouteNames.Views.changePaidDate, path: '/changePaidDate' },
            { component: view.AttendanceFineGenerate, name: RouteNames.Views.attendanceFineGenerate, path: '/attendanceFineGenerate' },


            { component: view.ChangeDueDate, name: RouteNames.Views.changeDueDate, path: '/changeDueDate' },

            { component: view.feeSubInstallment, name: RouteNames.Views.feeSubInstallment, path: '/feeSubInstallment' },
            { component: view.feeExemption, name: RouteNames.Views.fullfeeChallan, path: '/fullfeeChallan' },
            // { component: view.SingleConcession, name: RouteNames.Views.singleConcession, path: '/singleConcession' },
            { component: view.PreviousFee, name: RouteNames.Views.previousFee, path: '/previousFee' },
            { component: view.ConcesssionReNew, name: RouteNames.Views.concessionRenew, path: '/concessionRenew' },
            { component: view.ClassTransfer, name: RouteNames.Views.ClassTransfer, path: '/ClassTransfer' },



            { component: view.FeeApplyScholarship, name: RouteNames.Views.feeApplyScholarship, path: '/feeApplyScholarship' },
            { component: view.FeeExemptionManually, name: RouteNames.Views.feeExemptionManually, path: '/feeExemptionManually' },
            { component: view.FeeMultipleSubInstallments, name: RouteNames.Views.multiplesubinstallments, path: '/mulitplesubinstallments' },


            { component: view.ReverseConcessionList, name: RouteNames.Views.feeReverseConcessionList, path: '/feeReverseConcessionList' },
            { component: view.ExamUpdationList, name: RouteNames.Views.examUpdationList, path: '/examUpdationList' },
            { component: view.ExamUpdationListES, name: RouteNames.Views.examUpdationListES, path: '/examUpdationListES' },


            { component: view.FeeConcessionDetailList, name: RouteNames.Views.feeConcessionDetail, path: '/feeConcessionDetail' },
            { component: view.FeeContinuationPolicyList, name: RouteNames.Views.feeContinuationPolicy, path: '/feeContinuationPolicy' },
            { component: view.FeeFeeActivityList, name: RouteNames.Views.feeFeeActivity, path: '/feeFeeActivity' },
            { component: view.FeeFeeHeadList, name: RouteNames.Views.feeFeeHead, path: '/feeFeeHead' },
            { component: view.SetupConcessionRemarksList, name: RouteNames.Views.setupConcessionRemarks, path: '/setupConcessionRemarks' },
            { component: view.FeeFeeStructureList, name: RouteNames.Views.feeFeeStructure, path: '/feeFeeStructure' },
            { component: view.FeeFeeStructureApprovalList, name: RouteNames.Views.feeFeeStructureApproval, path: '/feeFeeStructureApproval' },

            { component: view.MinimumPaidDateList, name: RouteNames.Views.minimumPaidDate, path: '/minimumPaidDate' },


            { component: view.FeeFeeStructureSingleList, name: RouteNames.Views.feeFeeStructureSingle, path: '/feeFeeStructureSingle' },
            { component: view.FeeFeeStructureDetailList, name: RouteNames.Views.feeFeeStructureDetail, path: '/feeFeeStructureDetail' },
            { component: view.FeeScholarshipCriteriaList, name: RouteNames.Views.feeScholarshipCriteria, path: '/feeScholarshipCriteria' },
            { component: view.FeeStudentChallanList, name: RouteNames.Views.feeStudentChallan, path: '/feeStudentChallan' },
            { component: view.FeeStudentChallanPaidDateList, name: RouteNames.Views.feeStudentChallanPaidList, path: '/feeStudentChallanPaidList' },
            { component: view.CustomChallanList, name: RouteNames.Views.customChallan, path: '/customChallan' },
            { component: view.EducationChallanList, name: RouteNames.Views.educationChallanList, path: '/educationChallan' },

            { component: view.ChallanValidityUpdate, name: RouteNames.Views.FeeChallanValidityUpdate, path: '/FeeChallanValidityUpdate' },

            { component: view.FeeTBLGradesList, name: RouteNames.Views.feeTBLGrades, path: '/feeTBLGrades' },

            // { component: view.FeeStudentFeeStructureList, name: RouteNames.Views.feeStudentFeeStructure, path: '/feeStudentFeeStructure' },
            { component: view.HumanResourceDepartmentsList, name: RouteNames.Views.humanResourceDepartments, path: '/humanResourceDepartments' },
            { component: view.UpdMicroPassList, name: RouteNames.Views.updmicropass, path: '/updmicropass' },

            { component: view.HumanResourceDesignationsList, name: RouteNames.Views.humanResourceDesignations, path: '/humanResourceDesignations' },
            { component: view.HumanResourceStaffList, name: RouteNames.Views.humanResourceStaff, path: '/humanResourceStaff' },
            { component: view.TeacherHod, name: RouteNames.Views.Teacherhod, path: '/Teacherhod' },
            { component: view.StaffCourseList, name: RouteNames.Views.staffCourse, path: '/staffCourse' },
            { component: view.HumanResourceStaffProfile, name: RouteNames.Views.staffCourse, path: '/staffProfile' },


            { component: view.ProfileStaff, name: RouteNames.Views.profileStaff, path: '/profileStaff' },
            { component: view.RegistrationCourseList, name: RouteNames.Views.registrationCourse, path: '/registrationCourse' },
            { component: view.RegistrationEmailProgramList, name: RouteNames.Views.registrationEmailProgram, path: '/registrationEmailProgram' },
            { component: view.EmailTemplateList, name: RouteNames.Views.emailTemplate, path: '/emailTemplate' },

            { component: view.CampusEmailMapping, name: RouteNames.Views.CampusEmailMapping, path: '/CampusEmailMapping' },

            // { component: view.RegistrationEnrollmentsList, name: RouteNames.Views.registrationEnrollments, path: '/registrationEnrollments' },
            { component: view.RegistrationProgramCourseLinkList, name: RouteNames.Views.registrationProgramCourseLink, path: '/registrationProgramCourseLink' },
            { component: view.RegistrationSectionCourseLinkList, name: RouteNames.Views.registrationSectionCourseLink, path: '/registrationSectionCourseLink' },
            { component: view.RegistrationSectionsList, name: RouteNames.Views.registrationSections, path: '/registrationSections' },
            { component: view.RegistrationEnrollmentBulkList, name: RouteNames.Views.enrollmentBulk, path: '/enrollmentBulk' },
            { component: view.AdmissionDuplicateRemoveList, name: RouteNames.Views.admissionDuplicateRemove, path: '/admissionDuplicateRemove' },
            { component: view.ElMigrationList, name: RouteNames.Views.elMigration, path: '/elMigration' },
            { component: view.ElUpdationList, name: RouteNames.Views.elUpdation, path: '/elUpdation' },
            { component: view.KinShipList, name: RouteNames.Views.kinshipstd, path: '/kinshipstd' },
            { component: view.ConcessStdList, name: RouteNames.Views.concessstd, path: '/concessstdd' },
            { component: view.ConcessKinshipStdList, name: RouteNames.Views.concesskinsstdd, path: '/concesskinsstdd' },




            { component: view.RegistrationSectionChangeList, name: RouteNames.Views.sectionChange, path: '/sectionChange' },
            { component: view.RegistrationSectionChangeBulkList, name: RouteNames.Views.sectionChangeBulk, path: '/sectionChangeBulk' },

            { component: view.RegistrationClassPromotionList, name: RouteNames.Views.classPromotion, path: '/classPromotion' },

            { component: view.RegistrationClassTransferList, name: RouteNames.Views.transferClass, path: '/transferClass' },


            { component: view.StudentUserGen, name: RouteNames.Views.studentUserGen, path: '/registrationStudentUserGen' },

            { component: view.EnrollmentReverse, name: RouteNames.Views.enrollmentReverse, path: '/enrollmentReverse' },

            { component: view.SetupAddressList, name: RouteNames.Views.setupAddress, path: '/setupAddress' },
            { component: view.Franchise, name: RouteNames.Views.franchise, path: '/franchise' },

            { component: view.SetupAdmissionTypeList, name: RouteNames.Views.setupAdmissionType, path: '/setupAdmissionType' },
            { component: view.SetupBloodGroupList, name: RouteNames.Views.setupBloodGroup, path: '/setupBloodGroup' },
            { component: view.SetupBoardList, name: RouteNames.Views.setupBoard, path: '/setupBoard' },
            { component: view.SetupBoardTypeList, name: RouteNames.Views.setupBoardType, path: '/setupBoardType' },
            { component: view.SetupBuildingList, name: RouteNames.Views.setupBuilding, path: '/setupBuilding' },
            { component: view.SetupBuildingAddressLinkList, name: RouteNames.Views.setupBuildingAddressLink, path: '/setupBuildingAddressLink' },
            { component: view.SetupBusinessGroupList, name: RouteNames.Views.setupBusinessGroup, path: '/setupBusinessGroup' },
            { component: view.SetupBusinessUnitList, name: RouteNames.Views.setupBusinessUnit, path: '/setupBusinessUnit' },
            { component: view.AssessmentType, name: RouteNames.Views.assessmentType, path: '/assessmentType' },
            { component: view.AssessmentSchemeDefinition, name: RouteNames.Views.assessmentSchemeDefinition, path: '/assessmentSchemeDefinition' },



            { component: view.SetupCampusList, name: RouteNames.Views.setupCampus, path: '/setupCampus' },
            { component: view.SetupCampusBuildingLinkList, name: RouteNames.Views.setupCampusBuildingLink, path: '/setupCampusBuildingLink' },
            { component: view.SetupCampusProgramLinkList, name: RouteNames.Views.setupCampusProgramLink, path: '/setupCampusProgramLink' },
            { component: view.SetupCityList, name: RouteNames.Views.setupCity, path: '/setupCity' },
            { component: view.SetupClassList, name: RouteNames.Views.setupClass, path: '/setupClass' },
            { component: view.SetupCollectorList, name: RouteNames.Views.setupCollector, path: '/setupCollector' },
            { component: view.SetupCountryList, name: RouteNames.Views.setupCountry, path: '/setupCountry' },
            { component: view.SetupGenderList, name: RouteNames.Views.setupGender, path: '/setupGender' },
            { component: view.SetupInstitutionList, name: RouteNames.Views.setupInstitution, path: '/setupInstitution' },
            { component: view.SetupInstitutionTypeList, name: RouteNames.Views.setupInstitutionType, path: '/setupInstitutionType' },
            { component: view.SetupMediumList, name: RouteNames.Views.setupMedium, path: '/setupMedium' },
            { component: view.DashboardSurveyList, name: RouteNames.Views.dashboardSurvey, path: '/dashboardSurveyMaster' },
            { component: view.DashboardSurveyDetailList, name: RouteNames.Views.dashboardSurveydetail, path: '/dashboardSurveyDetail' },

            { component: view.SetupExtraCourseList, name: RouteNames.Views.setupExtraCourse, path: '/setupExtraCourse' },


            { component: view.SetupMonthList, name: RouteNames.Views.setupMonth, path: '/setupMonth' },
            { component: view.SetupNationalityList, name: RouteNames.Views.setupNationality, path: '/setupNationality' },
            { component: view.SetupPossessionList, name: RouteNames.Views.setupPossession, path: '/setupPossession' },
            { component: view.SetupPossessionTypeList, name: RouteNames.Views.setupPossessionType, path: '/setupPossessionType' },
            { component: view.SetupProgramList, name: RouteNames.Views.setupProgram, path: '/setupProgram' },
            { component: view.SetupProgramDetailsList, name: RouteNames.Views.setupProgramDetails, path: '/setupProgramDetails' },
            { component: view.SetupProvinceList, name: RouteNames.Views.setupProvince, path: '/setupProvince' },
            { component: view.SetupReligionList, name: RouteNames.Views.setupReligion, path: '/setupReligion' },
            { component: view.SetupRoomList, name: RouteNames.Views.setupRoom, path: '/setupRoom' },
            { component: view.SetupRoomBuildingLinkList, name: RouteNames.Views.setupRoomBuildingLink, path: '/setupRoomBuildingLink' },
            { component: view.SetupRoomTypeList, name: RouteNames.Views.setupRoomType, path: '/setupRoomType' },
            { component: view.SetupSectionList, name: RouteNames.Views.setupSection, path: '/setupSection' },
            { component: view.SetupSubCityList, name: RouteNames.Views.setupSubCity, path: '/setupSubCity' },

            { component: view.SetupDegreeList, name: RouteNames.Views.setupDegree, path: '/setupDegree' },
            { component: view.SetupGroupList, name: RouteNames.Views.setupGroup, path: '/setupGroup' },
            { component: view.SetupPassStatusList, name: RouteNames.Views.setupPassStatus, path: '/setupPassStatus' },
            { component: view.SetupSessionList, name: RouteNames.Views.setupSession, path: '/setupSession' },
            { component: view.SetupShiftList, name: RouteNames.Views.setupShift, path: '/setupShift' },
            { component: view.SetupStatusList, name: RouteNames.Views.setupStatus, path: '/setupStatus' },
            { component: view.SetupTermList, name: RouteNames.Views.setupTerm, path: '/setupTerm' },
            { component: view.SetupZoneList, name: RouteNames.Views.setupZone, path: '/setupZone' },
            { component: view.SetupZoneCityLinkList, name: RouteNames.Views.setupZoneCityLink, path: '/setupZoneCityLink' },
            { component: view.TimeTableSlotsList, name: RouteNames.Views.timeTableSlots, path: '/timeTableSlots' },
            { component: view.TimeTableSlotTimingsList, name: RouteNames.Views.timeTableSlotTimings, path: '/timeTableSlotTimings' },
            { component: view.TimeTableTimeTableList, name: RouteNames.Views.timeTableTimeTable, path: '/timeTableTimeTable' },
            { component: view.TimeTableClose, name: RouteNames.Views.timeTableTimeTable, path: '/timeTableClose' },
            { component: view.SubstituteTimeTableTimeTableList, name: RouteNames.Views.substituteTimeTable, path: '/substituteTimeTable' },
            { component: view.ManageUserList, name: RouteNames.Views.userlist, path: '/userlist' },
            { component: view.ManageUser, name: RouteNames.Views.manageUserEx, path: "user/:id", props: true },
            { component: view.ReadRole, name: RouteNames.Views.readRoleEx, path: "role/:id", props: true },
            { component: view.CreateRole, name: RouteNames.Views.createRoleEx, path: "role/create/:id", props: true },
            { component: view.UpdateRole, name: RouteNames.Views.updateRoleEx, path: "role/update/:id", props: true },

            { component: view.RoleList, name: RouteNames.Views.roleList, path: '/roleList' },

            { component: view.TimeTableTimeTableMergeList, name: RouteNames.Views.timetableMerge, path: '/timetableMerge' },
            // { component: view.TimeTableTimeTableBulkList, name: RouteNames.Views.timeTableTimeTableBulk, path: '/timeTableTimeTableBulk' },
            { component: view.TimeTableDayOffBulkList, name: RouteNames.Views.TimeTableDayOffBulkList, path: '/TimeTableDayOffBulkList' },
            { component: view.RemoveDayOffBulkList, name: RouteNames.Views.RemoveDayOffBulkList, path: '/RemoveDayOffBulkList' },
            { component: view.DayOff, name: RouteNames.Views.dayOff, path: '/dayOff' },
            { component: view.SectionIncharge, name: RouteNames.Views.Sectionincharge, path: '/sectionIncharge' },

            { component: view.ELChaptersList, name: RouteNames.Views.elChapters, path: '/elChapters' },
            { component: view.ELModelPapersList, name: RouteNames.Views.elModelPapers, path: '/elModelPapers' },
            { component: view.ELModelPapersQuestionsList, name: RouteNames.Views.elModelPapersQuestions, path: '/elModelPapersQuestions' },
            { component: view.ELQuestionsList, name: RouteNames.Views.elQuestions, path: '/elQuestions' },
            { component: view.ELTopicsList, name: RouteNames.Views.elTopics, path: '/elTopics' },
            { component: view.MCQsQuestionList, name: RouteNames.Views.MCQsQuestionList, path: '/MCQsQuestionList' },
            { component: view.BoardsList, name: RouteNames.Views.Boards, path: '/Boards' },
            { component: view.VideosList, name: RouteNames.Views.Videos, path: '/Videos' },
            { component: view.TopicsList, name: RouteNames.Views.Topics, path: '/Topics' },
            { component: view.TopicsVideoList, name: RouteNames.Views.TopicsVideo, path: '/TopicsVideo' },
            { component: view.BoardProgramClassCourseLinkList, name: RouteNames.Views.BoardProgramClassCourseLinkList, path: '/BoardProgramClassCourseLink' },
            { component: view.ChapterLinksList, name: RouteNames.Views.ChapterLinksList, path: '/ChapterLinks' },

            { component: view.MCQsAnswersList, name: RouteNames.Views.MCQsAnswers, path: '/MCQsAnswers' },

            { component: view.AdmissionReports, name: RouteNames.Views.admissionReports, path: '/admissionReports' },
            { component: view.ConcessionReports, name: RouteNames.Views.concessionReports, path: '/concessionReports' },
            { component: view.FeeReports, name: RouteNames.Views.feeReports, path: '/feeReports' },
            { component: view.FinanceReports, name: RouteNames.Views.financeReports, path: '/financeReports' },

            { component: view.AttendanceReports, name: RouteNames.Views.attendanceReports, path: '/attendanceReports' },
            { component: view.EnrolledReports, name: RouteNames.Views.enrolledReports, path: '/enrolledReports' },
            { component: view.CustomFee, name: RouteNames.Views.customFee, path: '/customFee' },
            { component: view.CustomSms, name: RouteNames.Views.customSms, path: '/customSms' },
            { component: view.SmsApproval, name: RouteNames.Views.smsapproval, path: '/smsapproval' },
            { component: view.Notification, name: RouteNames.Views.notification, path: '/notification' },
            { component: view.NotificationApproval, name: RouteNames.Views.NotificationApproval, path: '/notificationApproval' },

            { component: view.MessageSMSAPIList, name: RouteNames.Views.messageSMSAPIList, path: '/messageSMSAPIList' },
            { component: view.MessageTemplate, name: RouteNames.Views.messageTemplate, path: '/messageTemplate' },
            // { component: view.FullFee, name: RouteNames.Views.fullFee, path: '/fullFee' },

            //Transportation Schema//
            { component: view.TransportationVehicleInfoList, name: RouteNames.Views.vehicleInfo, path: '/vehicleInfo' },
            { component: view.TransportationRouteInfoList, name: RouteNames.Views.routeInfo, path: '/routeInfo' },
            { component: view.TransportationBusStopInfoList, name: RouteNames.Views.busStopInfo, path: '/busStopInfo' },
            { component: view.TransportationRouteDetailInfoList, name: RouteNames.Views.routeDetailInfo, path: '/routeDetailInfo' },
            { component: view.TransportationRouteStopLinkList, name: RouteNames.Views.routeStopLink, path: '/routeStopLink' },
            { component: view.TransportationRouteStudentLinkList, name: RouteNames.Views.routeStudentLink, path: '/routeStudentLink' },
            { component: view.StudentFeeConfirmationEx, name: RouteNames.Views.feeConfirmationEx, path: '/feeConfirmationEx' },

            { component: view.RegistrationEnrollmentBulkWithoutPaidList, name: RouteNames.Views.registrationEnrollmentBulkWithoutPaidList, path: '/enrollmentBulkWithoutPaid' },
            { component: view.RegistrationEnrollmentBulkWithoutPaidListEx, name: RouteNames.Views.registrationEnrollmentBulkWithoutPaidListEx, path: '/enrollmentBulkWithoutPaidEx' },
            { component: view.AdmissionAdmissionFormListEx, name: RouteNames.Views.admissionAdmissionFormEx, path: '/admissionAdmissionFormDirectEnroll' },

            { component: view.AttendancePercentage, name: RouteNames.Views.AttendancePercentage, path: '/AttendancePercentage' },

            //seating plan

            { component: view.seatingPlanDateSheetList, name: RouteNames.Views.seatingPlanDateSheetList, path: '/seatingPlanDateSheetList' },
            { component: view.seatingPlanDateSheetDetailList, name: RouteNames.Views.seatingPlanDateSheetDetailList, path: '/seatingPlanDateSheetDetailList' },
            { component: view.SeatingPlanStudent, name: RouteNames.Views.SeatingPlanStudent, path: '/SeatingPlanStudent' },
            { component: view.CityConfigurationQuiz, name: RouteNames.Views.cityConfigurationQuiz, path: '/cityConfigurationQuiz' },
            { component: view.LeagueConfigurationQuiz, name: RouteNames.Views.leagueConfigurationQuiz, path: '/leagueConfigurationQuiz' },
            { component: view.QuizDashBoard, name: RouteNames.Views.quizDashboard, path: '/quizDashboard' },

        ]
    },
    {
        component: AreaLayoutEx,
        path: '/',
        meta: { private: true },
        children: [
            { component: view.AttendanceTeacher, name: RouteNames.Views.attendanceTeacher, path: '/attendanceTeacherEx' },
        ]
    },
    { component: Login, name: RouteNames.login.home, path: '/login' },
    // { component: Signup, name: RouteNames.signup, path: '/signup' },
    { component: PageForbidden, name: RouteNames.forbidden, path: '/forbidden' },
    { component: PageNotFound, path: '*' }
];