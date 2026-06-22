  import { resolve } from "url";

  const Helper = (resolve) =>
    (require as any)(["./Fee/Helper"], function(module) {
      resolve(module.Helper);
    });
  const AdmissionDuplicateRemoveList = (resolve) =>
    (require as any)(["./Admission/DuplicateRemove/list"], function(module) {
      resolve(module.AdmissionDuplicateRemoveList);
    });
  const ElMigrationList = (resolve) =>
    (require as any)(["./Migration/ElMigration/list"], function(module) {
      resolve(module.ElMigrationList);
    });
  const KinShipList = (resolve) =>
    (require as any)(["./Admission/KinshipStudent/list"], function(module) {
      resolve(module.KinShipList);
    });
  const ConcessStdList = (resolve) =>
    (require as any)(["./Admission/ConcessionStudent/list"], function(module) {
      resolve(module.ConcessStdList);
    });
  const OnlineFormApprovalList = (resolve) =>
    (require as any)(["./Admission/OnlineFormApproval/list"], function(module) {
      resolve(module.OnlineFormApprovalList);
    });
  const ConcessKinshipStdList = (resolve) =>
    (require as any)(["./Admission/ConcessionKinshipStudentBulk/list"], function(
      module
    ) {
      resolve(module.ConcessKinshipStdList);
    });

  const ElUpdationList = (resolve) =>
    (require as any)(["./Migration/ElUpdation/list"], function(module) {
      resolve(module.ElUpdationList);
    });

  const AdmissionAdmissionFormList = (resolve) =>
    (require as any)(["./Admission/AdmissionForm/list"], function(module) {
      resolve(module.AdmissionAdmissionFormList);
    });
  const AdmissionAdmissionFormListBr = (resolve) =>
    (require as any)(["./Admission/AdmissionFormBr/list"], function(module) {
      resolve(module.AdmissionAdmissionFormListBr);
    });
  const BulkCopyProgramDetail = (resolve) =>
    (require as any)(["./Setup/BulkCopyProgramDetail/list"], function(module) {
      resolve(module.BulkCopyProgramDetail);
    });
  const AdmissionEligibilityCriteriaList = (resolve) =>
    (require as any)(["./Admission/EligibilityCriteria/list"], function(module) {
      resolve(module.AdmissionEligibilityCriteriaList);
    });
  const AdmissionBulitanSaleList = (resolve) =>
    (require as any)(["./Admission/BulitanSale/list"], function(module) {
      resolve(module.AdmissionBulitanSaleList);
    });
  const AdmissionInquiryList = (resolve) =>
    (require as any)(["./Admission/Inquiry/list"], function(module) {
      resolve(module.AdmissionInquiryList);
    });

  const AdmissionReports = (resolve) =>
    (require as any)(["./Reports/AdmissionReports/index"], function(module) {
      resolve(module.AdmissionReports);
    });
  const AdmissionSaleTypeList = (resolve) =>
    (require as any)(["./Admission/SaleType/list"], function(module) {
      resolve(module.AdmissionSaleTypeList);
    });
  const ProgramFeeAdjustmentList = (resolve) =>
    (require as any)(["./Admission/ProgramFeeAdjustment/list"], function(module) {
      resolve(module.ProgramFeeAdjustmentList);
    });

  const AdmissionStudentsImageList = (resolve) =>
    (require as any)(["./Admission/StudentsImage/list"], function(module) {
      resolve(module.AdmissionStudentsImageList);
    });
  const AdmissionStudentsList = (resolve) =>
    (require as any)(["./Admission/Students/list"], function(module) {
      resolve(module.AdmissionStudentsList);
    });
  const AttendanceApproval = (resolve) =>
    (require as any)(["./Attendance/attendanceApproval/list"], function(module) {
      resolve(module.AttendanceApproval);
    });
  const SmartAttendence = (resolve) =>
    (require as any)(["./Attendance/SmartAttendence/list"], function(module) {
      resolve(module.SmartAttendence);
    });

  const AttendanceApprovalRemove = (resolve) =>
    (require as any)(["./Attendance/attendanceApprovalRemove/list"], function(
      module
    ) {
      resolve(module.AttendanceApprovalRemove);
    });
  const AttendanceAttendanceDetailList = (resolve) =>
    (require as any)(["./Attendance/AttendanceDetail/list"], function(module) {
      resolve(module.AttendanceAttendanceDetailList);
    });
  const SessionDurationList = (resolve) =>
    (require as any)(["./Attendance/SessionDuration/list"], function(module) {
      resolve(module.SessionDurationList);
    });

  const AttendanceAttendenceMasterList = (resolve) =>
    (require as any)(["./Attendance/AttendenceMaster/list"], function(module) {
      resolve(module.AttendanceAttendenceMasterList);
    });
  const AttendanceAttendenceStatusList = (resolve) =>
    (require as any)(["./Attendance/AttendenceStatus/list"], function(module) {
      resolve(module.AttendanceAttendenceStatusList);
    });
  const AttendanceBulk = (resolve) =>
    (require as any)(["./Attendance/attendanceBulk/list"], function(module) {
      resolve(module.AttendanceBulk);
    });
  const AttendanceBulkDetail = (resolve) =>
    (require as any)(["./Attendance/attendanceBulkDetail/list"], function(
      module
    ) {
      resolve(module.AttendanceBulkDetail);
    });
  const AttendanceReports = (resolve) =>
    (require as any)(["./Reports/AttendanceReports/index"], function(module) {
      resolve(module.AttendanceReports);
    });
  const AttendanceTeacher = (resolve) =>
    (require as any)(["./Attendance/AttendanceTeacher/list"], function(module) {
      resolve(module.AttendanceTeacher);
    });
  const AttendanceTeacherBulk = (resolve) =>
    (require as any)(["./Attendance/AttendanceTeacherBulk/list"], function(
      module
    ) {
      resolve(module.AttendanceTeacherBulk);
    });

  const AttendanceTeacherUser = (resolve) =>
    (require as any)(["./Attendance/AttendanceTeacherUser/list"], function(
      module
    ) {
      resolve(module.AttendanceTeacherUser);
    });

  // Dashboards
  const QuizDashBoard = (resolve) =>
    (require as any)(["./QuizDashboard/QuizDashboard/list"], function(module) {
      resolve(module.QuizDashBoard);
    });
  const AttendenceDashboard = (resolve) =>
    (require as any)(["./Attendance/AttendenceDashboard/list"], function(module) {
      resolve(module.AttendenceDashboard);
    });
  const AttendenceDashboard2 = (resolve) =>
    (require as any)(["./Attendance/AttendenceDashboard2/list"], function(
      module
    ) {
      resolve(module.AttendenceDashboard2);
    });
  const ConcessionDashboard = (resolve) =>
    (require as any)(["./Fee/ConcessionDashboard/list"], function(module) {
      resolve(module.ConcessionDashboard);
    });
  const AdmissionDashboard = (resolve) =>
    (require as any)(["./Admission/AdmissionDashboard/list"], function(module) {
      resolve(module.AdmissionDashboard);
    });
  const AdmissionComaprisonDashboard = (resolve) =>
    (require as any)(["./Admission/AdmissionComaprisonDashboard/list"], function(
      module
    ) {
      resolve(module.AdmissionComaprisonDashboard);
    });
  const AssessmentCategory = (resolve) =>
    (require as any)(["./Assessment/AssessmentCategory/list"], function(module) {
      resolve(module.AssessmentCategory);
    });
  const AssessmentSchedule = (resolve) =>
    (require as any)(["./Assessment/AssessmentSchedule/list"], function(module) {
      resolve(module.AssessmentSchedule);
    });

  const AdmissionComaprisonDashboardCampusWise = resolve => (require as any)(['./Admission/AdmissionComaprisonDashboardCampusWise/list'], function (module) { resolve(module.AdmissionComaprisonDashboardCampusWise) });
  const AdmissionComaprisonDashboardCampusWiseClone = resolve => (require as any)(['./Admission/AdmissionComaprisonDashboardCampusWiseClone/list'], function (module) { resolve(module.AdmissionComaprisonDashboardCampusWiseClone) });

  const FeePaidDashboard = resolve => (require as any)(['./Fee/FeePaidDashboard/list'], function (module) { resolve(module.FeePaidDashboard) });
  const RevenueDashboard = resolve => (require as any)(['./Fee/RevenueDashboard/list'], function (module) { resolve(module.RevenueDashboard) });
  const ComparisonDashboard = resolve => (require as any)(['./Dashboard/comparison'], function (module) { resolve(module.ComparisonDashboard) });

  const AcademicHolidayType = (resolve) =>
    (require as any)(["./TimeTable/HolidayType/list"], function(module) {
      resolve(module.AcademicHolidayType);
    });
  const AcademicHolidays = (resolve) =>
    (require as any)(["./TimeTable/Holidays/list"], function(module) {
      resolve(module.AcademicHolidays);
    });
  const AcademicEvents = (resolve) =>
    (require as any)(["./TimeTable/Events/list"], function(module) {
      resolve(module.AcademicEvents);
    });
  const AcademicCalendarType = (resolve) =>
    (require as any)(["./TimeTable/AcademicCalendarType/list"], function(module) {
      resolve(module.AcademicCalendarType);
    });
  const AcademicSectionMap = (resolve) =>
    (require as any)(["./HumanResource/AcademicSectionMap/list"], function(
      module
    ) {
      resolve(module.AcademicSectionMap);
    });

  const ChangeDueDate = (resolve) =>
    (require as any)(["./Fee/ChangeDueDate/list"], function(module) {
      resolve(module.ChangeDueDate);
    });
  const ConcessionReports = (resolve) =>
    (require as any)(["./Reports/ConcessionReports/index"], function(module) {
      resolve(module.ConcessionReports);
    });
  const ConcesssionReNew = (resolve) =>
    (require as any)(["./Fee/ConcessionRenew/list"], function(module) {
      resolve(module.ConcesssionReNew);
    });
  const CustomChallanList = (resolve) =>
    (require as any)(["./Fee/CustomChallan/list"], function(module) {
      resolve(module.CustomChallanList);
    });
  const EducationChallanList = (resolve) =>
    (require as any)(["./Fee/EducationChallan/list"], function(module) {
      resolve(module.EducationChallanList);
    });

  const CustomFee = (resolve) =>
    (require as any)(["./Fee/CustomFee/list"], function(module) {
      resolve(module.CustomFee);
    });
  const CustomSms = (resolve) =>
    (require as any)(["./Message/Sms/list"], function(module) {
      resolve(module.CustomSms);
    });
  const PushNotification = (resolve) =>
    (require as any)(["./Message/pushNotification/list"], function(module) {
      resolve(module.PushNotification);
    });
  const PushNotificationCampus = (resolve) =>
    (require as any)(["./Message/pushNotificationCampus/list"], function(module) {
      resolve(module.PushNotificationCampus);
    });

  const SmsApproval = (resolve) =>
    (require as any)(["./Message/SmsApproval/list"], function(module) {
      resolve(module.SmsApproval);
    });
  const Notification = (resolve) =>
    (require as any)(["./Message/Notification/list"], function(module) {
      resolve(module.Notification);
    });
  const NotificationApproval = (resolve) =>
    (require as any)(["./Message/NotificaitonApproval/list"], function(module) {
      resolve(module.NotificationApproval);
    });
  const SmsToStudents = (resolve) =>
    (require as any)(["./Message/SmsToStudents/list"], function(module) {
      resolve(module.SmsToStudents);
    });

  const MCQsQuestionList = (resolve) =>
    (require as any)(["./EL/MCQsQuestion/list"], function(module) {
      resolve(module.MCQsQuestionList);
    });
  const BoardsList = (resolve) =>
    (require as any)(["./EL/Boards/list"], function(module) {
      resolve(module.BoardsList);
    });
  const VideosList = (resolve) =>
    (require as any)(["./EL/Videos/list"], function(module) {
      resolve(module.VideosList);
    });
  const TopicsList = (resolve) =>
    (require as any)(["./EL/ELTopics/list"], function(module) {
      resolve(module.TopicsList);
    });
  const TopicsVideoList = (resolve) =>
    (require as any)(["./EL/TopicsVideo/list"], function(module) {
      resolve(module.TopicsVideoList);
    });
  const BoardProgramClassCourseLinkList = (resolve) =>
    (require as any)(["./EL/BoardProgramClassCourseLink/list"], function(module) {
      resolve(module.BoardProgramClassCourseLinkList);
    });

  const MCQsAnswersList = (resolve) =>
    (require as any)(["./EL/MCQsAnswers/list"], function(module) {
      resolve(module.MCQsAnswersList);
    });
  const ChapterLinksList = (resolve) =>
    (require as any)(["./EL/ChapterLinks/list"], function(module) {
      resolve(module.ChapterLinksList);
    });

  const ELChaptersList = (resolve) =>
    (require as any)(["./EL/Chapters/list"], function(module) {
      resolve(module.ELChaptersList);
    });
  const ELModelPapersList = (resolve) =>
    (require as any)(["./EL/ModelPapers/list"], function(module) {
      resolve(module.ELModelPapersList);
    });
  const ELModelPapersQuestionsList = (resolve) =>
    (require as any)(["./EL/ModelPapersQuestions/list"], function(module) {
      resolve(module.ELModelPapersQuestionsList);
    });
  const ELQuestionsList = (resolve) =>
    (require as any)(["./EL/Questions/list"], function(module) {
      resolve(module.ELQuestionsList);
    });
  const ELTopicsList = (resolve) =>
    (require as any)(["./EL/Topics/list"], function(module) {
      resolve(module.ELTopicsList);
    });
  const EnrolledReports = (resolve) =>
    (require as any)(["./Reports/EnrolledReports/index"], function(module) {
      resolve(module.EnrolledReports);
    });
  const EnrollmentReverse = (resolve) =>
    (require as any)(["./Registration/EnrollmentReverse/list"], function(module) {
      resolve(module.EnrollmentReverse);
    });
  const ExamApproval = (resolve) =>
    (require as any)(["./Examination/ExamApproval/list"], function(module) {
      resolve(module.ExamApproval);
    });
  const ExamSMSApproval = (resolve) =>
    (require as any)(["./Examination/ExamSMSApproval"], function(module) {
      resolve(module.ExamSMSApproval);
    });
  const ExamApprovalExam2 = (resolve) =>
    (require as any)(["./Examination/ExamApprovalExam2/list"], function(module) {
      resolve(module.ExamApprovalExam2);
    });

  const ExamDeletion = (resolve) =>
    (require as any)(["./Examination/ExamDeletion/list"], function(module) {
      resolve(module.ExamDeletion);
    });
  const ExamDeletion2 = (resolve) =>
    (require as any)(["./Examination/ExamDeletion2/list"], function(module) {
      resolve(module.ExamDeletion2);
    });

  const ExamUnApproval = (resolve) =>
    (require as any)(["./Examination/ExamUnApproval/list"], function(module) {
      resolve(module.ExamUnApproval);
    });
  const ExamUnApprovalExam2 = (resolve) =>
    (require as any)(["./Examination/ExamUnApprovalExam2/list"], function(
      module
    ) {
      resolve(module.ExamUnApprovalExam2);
    });

  const ExamScheduleDetail = (resolve) =>
    (require as any)(["./Examination/ExamScheduleDetail/list"], function(module) {
      resolve(module.ExamScheduleDetail);
    });

  const ExamBulk = (resolve) =>
    (require as any)(["./Examination/ExamBulk/list"], function(module) {
      resolve(module.ExamBulk);
    });
  const ExaminationCampusGradingPolicyLinkList = (resolve) =>
    (require as any)(["./Examination/CampusGradingPolicyLink/list"], function(
      module
    ) {
      resolve(module.ExaminationCampusGradingPolicyLinkList);
    });
  const ExaminationExamDetailList = (resolve) =>
    (require as any)(["./Examination/ExamDetail/list"], function(module) {
      resolve(module.ExaminationExamDetailList);
    });
  const ExaminationExamMasterList = (resolve) =>
    (require as any)(["./Examination/ExamMaster/list"], function(module) {
      resolve(module.ExaminationExamMasterList);
    });
  const ExaminationExamScheduleList = (resolve) =>
    (require as any)(["./Examination/ExamSchedule/list"], function(module) {
      resolve(module.ExaminationExamScheduleList);
    });
  const ExaminationExamSectionLink = (resolve) =>
    (require as any)(["./Examination/ExamSectionLink/list"], function(module) {
      resolve(module.ExaminationExamSectionLink);
    });
  const ExaminationExamTypeList = (resolve) =>
    (require as any)(["./Examination/ExamType/list"], function(module) {
      resolve(module.ExaminationExamTypeList);
    });
  const LevelDefinition = (resolve) =>
    (require as any)(["./Assessment/LevelDefinition/list"], function(module) {
      resolve(module.LevelDefinition);
    });
  const AssessmentReport = (resolve) =>
    (require as any)(["./Assessment/AssessmentReport/list"], function(module) {
      resolve(module.AssessmentReport);
    });

  const ExaminationGradingPolicyList = (resolve) =>
    (require as any)(["./Examination/GradingPolicy/list"], function(module) {
      resolve(module.ExaminationGradingPolicyList);
    });
  const ExaminationReports = (resolve) =>
    (require as any)(["./Reports/ExaminationReports/index"], function(module) {
      resolve(module.ExaminationReports);
    });
  const ExaminationReports2 = (resolve) =>
    (require as any)(["./Reports/ExaminationReports2/index"], function(module) {
      resolve(module.ExaminationReports2);
    });
  const ExaminationReportsEx = (resolve) =>
    (require as any)(["./Reports/ExaminationReportsEx/index"], function(module) {
      resolve(module.ExaminationReportsEx);
    });

  const ExamResultApproval = (resolve) =>
    (require as any)(["./Examination/ExamResultApproval/list"], function(module) {
      resolve(module.ExamResultApproval);
    });
  const FailCriteria = (resolve) =>
    (require as any)(["./Examination/FailCriteria/list"], function(module) {
      resolve(module.FailCriteria);
    });
  const TeacherEvaulation = (resolve) =>
    (require as any)(["./HumanResource/TeacherEvaluation/list"], function(
      module
    ) {
      resolve(module.TeacherEvaulation);
    });
  const FeeApplyConcession = (resolve) =>
    (require as any)(["./Fee/ApplyConcession/list"], function(module) {
      resolve(module.FeeApplyConcession);
    });
  const CreditNotes = (resolve) =>
    (require as any)(["./Fee/CreditNotes"], function(module) {
      resolve(module.CreditNotes);
    });
  const StudentFeedback = (resolve) =>
    (require as any)(["./Dashboard/StudentFeedback/list"], function(module) {
      resolve(module.StudentFeedback);
    });
  const WithdrawnConcessionReversal = (resolve) =>
    (require as any)(["./Fee/WithdrawnConcessionReversal"], function(module) {
      resolve(module.WithdrawnConcessionReversal);
    });
  const applyConcessionOnInstallment = (resolve) =>
    (require as any)(["./Fee/applyConcessionOnInstallment"], function(module) {
      resolve(module.applyConcessionOnInstallment);
    });
  const FeeApplyConcessionBulk = (resolve) =>
    (require as any)(["./Fee/ApplyConcessionBulk/list"], function(module) {
      resolve(module.FeeApplyConcessionBulk);
    });
  const FeeApplyConcessionBulkPre = (resolve) =>
    (require as any)(["./Fee/ApplyConcessionBulkPre/list"], function(module) {
      resolve(module.FeeApplyConcessionBulkPre);
    });
  const FeeApplyScholarship = (resolve) =>
    (require as any)(["./Fee/ApplyScholarship/list"], function(module) {
      resolve(module.FeeApplyScholarship);
    });
  const FeeBankList = (resolve) =>
    (require as any)(["./Fee/Bank/list"], function(module) {
      resolve(module.FeeBankList);
    });
  const FeeCampusBankLinkList = (resolve) =>
    (require as any)(["./Fee/CampusBankLink/list"], function(module) {
      resolve(module.FeeCampusBankLinkList);
    });
    
    const AdhocChallanLinkList = (resolve) =>
    (require as any)(["./Fee/AdhocChallan/list"], function(module) {
      resolve(module.AdhocChallanLinkList);
    });
  const FeeCampusChallanNoteLinkList = (resolve) =>
    (require as any)(["./Fee/CampusChallanNoteLink/list"], function(module) {
      resolve(module.FeeCampusChallanNoteLinkList);
    });
  const FeeChallanNoteList = (resolve) =>
    (require as any)(["./Fee/ChallanNote/list"], function(module) {
      resolve(module.FeeChallanNoteList);
    });
  const FeeChallanTypeList = (resolve) =>
    (require as any)(["./Fee/ChallanType/list"], function(module) {
      resolve(module.FeeChallanTypeList);
    });
  const FeeChallanValidityList = (resolve) =>
    (require as any)(["./Fee/ChallanValidity/list"], function(module) {
      resolve(module.FeeChallanValidityList);
    });
  const FeeConcessionBulkList = (resolve) =>
    (require as any)(["./Fee/ConcessionBulk/list"], function(module) {
      resolve(module.FeeConcessionBulkList);
    });
  const FeeConcessionDetailList = (resolve) =>
    (require as any)(["./Fee/ConcessionDetail/list"], function(module) {
      resolve(module.FeeConcessionDetailList);
    });
  const FeeConcessionList = (resolve) =>
    (require as any)(["./Fee/Concession/list"], function(module) {
      resolve(module.FeeConcessionList);
    });
  const FeeContinuationPolicyList = (resolve) =>
    (require as any)(["./Fee/ContinuationPolicy/list"], function(module) {
      resolve(module.FeeContinuationPolicyList);
    });
  const feeExemption = (resolve) =>
    (require as any)(["./Fee/feeExemption/list"], function(module) {
      resolve(module.feeExemption);
    });
  const FeeExemptionManually = (resolve) =>
    (require as any)(["./Fee/FeeExemptionManually/list"], function(module) {
      resolve(module.FeeExemptionManually);
    });
  const FeeMultipleSubInstallments = (resolve) =>
    (require as any)(["./Fee/MultipleSubInstallments/list"], function(module) {
      resolve(module.FeeMultipleSubInstallments);
    });

  const ChallanCancel = (resolve) =>
    (require as any)(["./Fee/ChallanCancel/list"], function(module) {
      resolve(module.ChallanCancel);
    });
  const StudentFeeDetailDescriptionList = (resolve) =>
    (require as any)(["./Fee/StudentFeeDetailDescription/list"], function(
      module
    ) {
      resolve(module.StudentFeeDetailDescriptionList);
    });
  const SectionFine = (resolve) =>
    (require as any)(["./Fee/SectionFine/list"], function(module) {
      resolve(module.SectionFine);
    });
  const ReverseConcessionList = (resolve) =>
    (require as any)(["./Fee/ConcessionReverse/list"], function(module) {
      resolve(module.ReverseConcessionList);
    });
  const ExamUpdationList = (resolve) =>
    (require as any)(["./Examination/ExamUpdation/list"], function(module) {
      resolve(module.ExamUpdationList);
    });
  const ExamUpdationListES = (resolve) =>
    (require as any)(["./Examination/ExamUpdationES/list"], function(module) {
      resolve(module.ExamUpdationListES);
    });

  const FeeFeeActivityList = (resolve) =>
    (require as any)(["./Fee/FeeActivity/list"], function(module) {
      resolve(module.FeeFeeActivityList);
    });
  const FeeFeeHeadList = (resolve) =>
    (require as any)(["./Fee/FeeHead/list"], function(module) {
      resolve(module.FeeFeeHeadList);
    });
  const FeeFeeStructureApprovalList = (resolve) =>
    (require as any)(["./Fee/FeeStructureApproval/list"], function(module) {
      resolve(module.FeeFeeStructureApprovalList);
    });

  const MinimumPaidDateList = (resolve) =>
    (require as any)(["./Fee/MinimumPaidDate/list"], function(module) {
      resolve(module.MinimumPaidDateList);
    });

  const FeeFeeStructureDetailList = (resolve) =>
    (require as any)(["./Fee/FeeStructureDetail/list"], function(module) {
      resolve(module.FeeFeeStructureDetailList);
    });
  const FinanceData = (resolve) =>
    (require as any)(["./Fee/FinanceData/list"], function(module) {
      resolve(module.FinanceData);
    });
  const FeeFeeStructureList = (resolve) =>
    (require as any)(["./Fee/FeeStructure/list"], function(module) {
      resolve(module.FeeFeeStructureList);
    });
  const FeeFeeStructureSingleList = (resolve) =>
    (require as any)(["./Fee/FeeStructureSingle/list"], function(module) {
      resolve(module.FeeFeeStructureSingleList);
    });
  const FeeReports = (resolve) =>
    (require as any)(["./Reports/FeeReports/index"], function(module) {
      resolve(module.FeeReports);
    });

    const FinanceReports = (resolve) =>
      (require as any)(["./Reports/FinanceReports/index"], function(module) {
        resolve(module.FinanceReports);
      });
  const FeeScholarshipCriteriaList = (resolve) =>
    (require as any)(["./Fee/ScholarshipCriteria/list"], function(module) {
      resolve(module.FeeScholarshipCriteriaList);
    });
  const FeeStudentChallanList = (resolve) =>
    (require as any)(["./Fee/StudentChallan/list"], function(module) {
      resolve(module.FeeStudentChallanList);
    });
  const FeeStudentChallanPaidDateList = (resolve) =>
    (require as any)(["./Fee/StudentChallanPaidDate/list"], function(module) {
      resolve(module.FeeStudentChallanPaidDateList);
    });
  const FeeStudentFeeStructureList = (resolve) =>
    (require as any)(["./Fee/StudentFeeStructure/list"], function(module) {
      resolve(module.FeeStudentFeeStructureList);
    });
  const ChallanValidityUpdate = (resolve) =>
    (require as any)(["./Fee/ChallanValidityUpdate/list"], function(module) {
      resolve(module.FeeChallanValidityUpdateList);
    });
  const feeSubInstallment = (resolve) =>
    (require as any)(["./Fee/SubInstallment/list"], function(module) {
      resolve(module.feeSubInstallment);
    });
  const FeeTBLGradesList = (resolve) =>
    (require as any)(["./Fee/TBLGrades/list"], function(module) {
      resolve(module.FeeTBLGradesList);
    });
  const Franchise = (resolve) =>
    (require as any)(["./Setup/Franchise/list"], function(module) {
      resolve(module.Franchise);
    });
  const GradingCriteria = (resolve) =>
    (require as any)(["./Examination/GradingCriteria/list"], function(module) {
      resolve(module.GradingCriteria);
    });
  const HumanResourceDepartmentsList = (resolve) =>
    (require as any)(["./HumanResource/Departments/list"], function(module) {
      resolve(module.HumanResourceDepartmentsList);
    });
  const UpdMicroPassList = (resolve) =>
    (require as any)(["./HumanResource/UpdateMicroPass/list"], function(module) {
      resolve(module.UpdMicroPassList);
    });

  const HumanResourceDesignationsList = (resolve) =>
    (require as any)(["./HumanResource/Designations/list"], function(module) {
      resolve(module.HumanResourceDesignationsList);
    });
  const HumanResourceStaffList = (resolve) =>
    (require as any)(["./HumanResource/Staff/list"], function(module) {
      resolve(module.HumanResourceStaffList);
    });
  const LeaveManagement = (resolve) =>
    (require as any)(["./Attendance/LeaveManagement/list"], function(module) {
      resolve(module.LeaveManagement);
    });
  const LeaveManagementTesting = (resolve) =>
    (require as any)(["./Attendance/LeaveManagementTesting/list"], function(
      module
    ) {
      resolve(module.LeaveManagementTesting);
    });
  const LeaveApproval = (resolve) =>
    (require as any)(["./Attendance/LeaveApproval/list"], function(module) {
      resolve(module.LeaveApproval);
    });
  const StaffCourseList = (resolve) =>
    (require as any)(["./HumanResource/StaffCourse/list"], function(module) {
      resolve(module.StaffCourseList);
    });
  const HumanResourceStaffProfile = (resolve) =>
    (require as any)(["./HumanResource/StaffProfile/list"], function(module) {
      resolve(module.HumanResourceStaffProfile);
    });

  const MessageSMSAPIList = (resolve) =>
    (require as any)(["./Message/SMSAPI/list"], function(module) {
      resolve(module.MessageSMSAPIList);
    });
  const MessageTemplate = (resolve) =>
    (require as any)(["./Message/SmsTemplate/list"], function(module) {
      resolve(module.MessageTemplate);
    });
  const PreviousFee = (resolve) =>
    (require as any)(["./Fee/PreviousFee/list"], function(module) {
      resolve(module.PreviousFee);
    });
  const ProfileStaff = (resolve) =>
    (require as any)(["./HumanResource/ProfileStaff/list"], function(module) {
      resolve(module.ProfileStaff);
    });
  const ProgramTransfer = (resolve) =>
    (require as any)(["./Admission/ProgramTransfer/list"], function(module) {
      resolve(module.ProgramTransfer);
    });
  const ProgramTransferBulk = (resolve) =>
    (require as any)(["./Admission/ProgramTransferBulk/list"], function(module) {
      resolve(module.ProgramTransferBulk);
    });
    const CampusTransferBulk = (resolve) =>
    (require as any)(["./Admission/CampusTransferBulk/list"], function(module) {
      resolve(module.CampusTransferBulk);
    });
  const RegistrationCourseList = (resolve) =>
    (require as any)(["./Registration/Course/list"], function(module) {
      resolve(module.RegistrationCourseList);
    });
  const RegistrationEmailProgramList = (resolve) =>
    (require as any)(["./Registration/EmailProgramLink/list"], function(module) {
      resolve(module.RegistrationEmailProgramList);
    });
  const EmailTemplateList = (resolve) =>
    (require as any)(["./Registration/EmailTemplate/list"], function(module) {
      resolve(module.EmailTemplateList);
    });

  const CampusEmailMapping = (resolve) =>
    (require as any)(["./Registration/CampusEmailMapping/list"], function(
      module
    ) {
      resolve(module.CampusEmailMapping);
    });

  const RegistrationEnrollmentBulkList = (resolve) =>
    (require as any)(["./Registration/EnrollmentBulk/list"], function(module) {
      resolve(module.RegistrationEnrollmentBulkList);
    });
  const RegistrationEnrollmentBulkWithoutPaidList = (resolve) =>
    (require as any)(["./Migration/EnrollmentBulkWithoutPaid/list"], function(
      module
    ) {
      resolve(module.RegistrationEnrollmentBulkWithoutPaidList);
    });
  const RegistrationEnrollmentBulkWithoutPaidListEx = (resolve) =>
    (require as any)(["./Migration/EnrollmentBulkWithoutPaid/listEx"], function(
      module
    ) {
      resolve(module.RegistrationEnrollmentBulkWithoutPaidListEx);
    });
  const RegistrationEnrollmentsList = (resolve) =>
    (require as any)(["./Registration/Enrollments/list"], function(module) {
      resolve(module.RegistrationEnrollmentsList);
    });
  const RegistrationProgramCourseLinkList = (resolve) =>
    (require as any)(["./Registration/ProgramCourseLink/list"], function(module) {
      resolve(module.RegistrationProgramCourseLinkList);
    });
  const RegistrationSectionChangeList = (resolve) =>
    (require as any)(["./Registration/SectionChange/list"], function(module) {
      resolve(module.RegistrationSectionChangeList);
    });
  const RegistrationSectionChangeBulkList = (resolve) =>
    (require as any)(["./Registration/SectionChangeBulk/list"], function(module) {
      resolve(module.RegistrationSectionChangeBulkList);
    });

  const RegistrationClassPromotionList = (resolve) =>
    (require as any)(["./Registration/ClassPromotion/list"], function(module) {
      resolve(module.RegistrationClassPromotionList);
    });
  const RegistrationClassTransferList = (resolve) =>
    (require as any)(["./Registration/ClassTransfer/list"], function(module) {
      resolve(module.RegistrationClassTransferList);
    });

  const RegistrationSectionCourseLinkList = (resolve) =>
    (require as any)(["./Registration/SectionCourseLink/list"], function(module) {
      resolve(module.RegistrationSectionCourseLinkList);
    });
  const RegistrationSectionsList = (resolve) =>
    (require as any)(["./Registration/Sections/list"], function(module) {
      resolve(module.RegistrationSectionsList);
    });

  const EnrollmentBatch = (resolve) =>
    (require as any)(["./Registration/EnrollmentBatch/list"], function(module) {
      resolve(module.EnrollmentBatch);
    });
  const MicrosoftStdPassword = (resolve) =>
    (require as any)(["./Registration/MicrosoftStdPassword/list"], function(
      module
    ) {
      resolve(module.MicrosoftStdPassword);
    });
  const ssatStudentData = (resolve) =>
    (require as any)(["./Registration/ssatStudentData/list"], function(module) {
      resolve(module.ssatStudentData);
    });

  const UserCreation = (resolve) =>
    (require as any)(["./Registration/UserCreation/list"], function(module) {
      resolve(module.UserCreation);
    });

  const StudentUserGen = (resolve) =>
    (require as any)(["./Registration/StudentUserGen/list"], function(module) {
      resolve(module.StudentUserGen);
    });
  const TeacherDashboard = (resolve) =>
    (require as any)(["./HumanResource/TeacherDashboard/list"], function(module) {
      resolve(module.TeacherDashboard);
    });
  const TeacherTimeTable = (resolve) =>
    (require as any)(["./HumanResource/TeacherTimeTable/list"], function(module) {
      resolve(module.TeacherTimeTable);
    });
  const TeacherAttendanceReport = (resolve) =>
    (require as any)(["./HumanResource/TeacherAttendanceReport/list"], function(
      module
    ) {
      resolve(module.TeacherAttendanceReport);
    });
  const TeacherExamReport = (resolve) =>
    (require as any)(["./HumanResource/TeacherExamReport/list"], function(
      module
    ) {
      resolve(module.TeacherExamReport);
    });
  const AcademicCalendarNew = (resolve) =>
    (require as any)(["./HumanResource/AcademicCalendarNew/list"], function(
      module
    ) {
      resolve(module.AcademicCalendarNew);
    });
  const AcademicCalendarMaster = (resolve) =>
    (require as any)(["./HumanResource/AcademicCalendarMaster/list"], function(
      module
    ) {
      resolve(module.AcademicCalendarMaster);
    });
  const AcademicCalendarReport = (resolve) =>
    (require as any)(["./HumanResource/AcademicCalendarReport/list"], function(
      module
    ) {
      resolve(module.AcademicCalendarReport);
    });
  const CalendarConfirmation = (resolve) =>
    (require as any)(["./HumanResource/CalendarConfirmation/list"], function(
      module
    ) {
      resolve(module.CalendarConfirmation);
    });

  const StudentRoster = (resolve) =>
    (require as any)(["./HumanResource/StudentRoster/list"], function(module) {
      resolve(module.StudentRoster);
    });
  const AttendanceRegister = (resolve) =>
    (require as any)(["./HumanResource/AttendanceRegister/list"], function(
      module
    ) {
      resolve(module.AttendanceRegister);
    });
  const StudentAttendance = (resolve) =>
    (require as any)(["./HumanResource/StudentAttendance/list"], function(
      module
    ) {
      resolve(module.StudentAttendance);
    });

  const RolePrevilagesList = (resolve) =>
    (require as any)(["./Role/RolePrevilages/list"], function(module) {
      resolve(module.RolePrevilagesList);
    });
  const RoleUserLogList = (resolve) =>
    (require as any)(["./Role/UserLog/list"], function(module) {
      resolve(module.RoleUserLogList);
    });
  const SectionRightLink = (resolve) =>
    (require as any)(["./Role/SectionRightLink/list"], function(module) {
      resolve(module.SectionRightLink);
    });
  const MaskRightLink = (resolve) =>
    (require as any)(["./Role/MaskRightLink/list"], function(module) {
      resolve(module.MaskRightLink);
    });
  const ManageUserList = (resolve) =>
    (require as any)(["./Role/users/user-list"], function(module) {
      resolve(module.ManageUserList);
    });
  const ManageUser = (resolve) =>
    (require as any)(["./Role/users/user"], function(module) {
      resolve(module.ManageUser);
    });

  const RoleList = (resolve) =>
    (require as any)(["./Role/roles/actions/list"], function(module) {
      resolve(module.RoleList);
    });
  const ReadRole = (resolve) =>
    (require as any)(["./Role/roles/actions/read"], function(module) {
      resolve(module.ReadRole);
    });
  const CreateRole = (resolve) =>
    (require as any)(["./Role/roles/actions/create"], function(module) {
      resolve(module.CreateRole);
    });
  const UpdateRole = (resolve) =>
    (require as any)(["./Role/roles/actions/update"], function(module) {
      resolve(module.UpdateRole);
    });

  const SecurityClaimUpd = (resolve) =>
    (require as any)(["./Role/SecurityClaimUpd/list"], function(module) {
      resolve(module.SecurityClaimUpd);
    });
  const SetupAddressList = (resolve) =>
    (require as any)(["./Setup/Address/list"], function(module) {
      resolve(module.SetupAddressList);
    });
  const SetupAdmissionTypeList = (resolve) =>
    (require as any)(["./Setup/AdmissionType/list"], function(module) {
      resolve(module.SetupAdmissionTypeList);
    });
  const SetupBloodGroupList = (resolve) =>
    (require as any)(["./Setup/BloodGroup/list"], function(module) {
      resolve(module.SetupBloodGroupList);
    });
  const SetupBoardList = (resolve) =>
    (require as any)(["./Setup/Board/list"], function(module) {
      resolve(module.SetupBoardList);
    });
  const SetupBoardTypeList = (resolve) =>
    (require as any)(["./Setup/BoardType/list"], function(module) {
      resolve(module.SetupBoardTypeList);
    });
  const SetupBuildingAddressLinkList = (resolve) =>
    (require as any)(["./Setup/BuildingAddressLink/list"], function(module) {
      resolve(module.SetupBuildingAddressLinkList);
    });
  const SetupBuildingList = (resolve) =>
    (require as any)(["./Setup/Building/list"], function(module) {
      resolve(module.SetupBuildingList);
    });
  const SetupBusinessGroupList = (resolve) =>
    (require as any)(["./Setup/BusinessGroup/list"], function(module) {
      resolve(module.SetupBusinessGroupList);
    });
  const SetupBusinessUnitList = (resolve) =>
    (require as any)(["./Setup/BusinessUnit/list"], function(module) {
      resolve(module.SetupBusinessUnitList);
    });
  const AssessmentType = (resolve) =>
    (require as any)(["./Assessment/AssessmentType/list"], function(module) {
      resolve(module.AssessmentType);
    });
  const AssessmentSchemeDefinition = (resolve) =>
    (require as any)(["./Assessment/AssessmentSchemeMaster/list"], function(
      module
    ) {
      resolve(module.AssessmentSchemeDefinition);
    });
  const AssessmentSchemeDetail = (resolve) =>
    (require as any)(["./Assessment/AssessmentSchemeDetail/list"], function(
      module
    ) {
      resolve(module.AssessmentSchemeDetail);
    });

  const SetupCampusBuildingLinkList = (resolve) =>
    (require as any)(["./Setup/CampusBuildingLink/list"], function(module) {
      resolve(module.SetupCampusBuildingLinkList);
    });
  const SetupCampusList = (resolve) =>
    (require as any)(["./Setup/Campus/list"], function(module) {
      resolve(module.SetupCampusList);
    });
  const SetupCampusProgramLinkList = (resolve) =>
    (require as any)(["./Setup/CampusProgramLink/list"], function(module) {
      resolve(module.SetupCampusProgramLinkList);
    });
  const SetupCityList = (resolve) =>
    (require as any)(["./Setup/City/list"], function(module) {
      resolve(module.SetupCityList);
    });
  const SetupClassList = (resolve) =>
    (require as any)(["./Setup/Class/list"], function(module) {
      resolve(module.SetupClassList);
    });
  const SetupCollectorList = (resolve) =>
    (require as any)(["./Setup/Collector/list"], function(module) {
      resolve(module.SetupCollectorList);
    });
  const SetupConcessionRemarksList = (resolve) =>
    (require as any)(["./Setup/ConcessionRemarks/list"], function(module) {
      resolve(module.SetupConcessionRemarksList);
    });
  const SetupCountryList = (resolve) =>
    (require as any)(["./Setup/Country/list"], function(module) {
      resolve(module.SetupCountryList);
    });
  const SetupDegreeList = (resolve) =>
    (require as any)(["./Setup/Degree/list"], function(module) {
      resolve(module.SetupDegreeList);
    });
  const SetupGenderList = (resolve) =>
    (require as any)(["./Setup/Gender/list"], function(module) {
      resolve(module.SetupGenderList);
    });
  const SetupGroupList = (resolve) =>
    (require as any)(["./Setup/Group/list"], function(module) {
      resolve(module.SetupGroupList);
    });
  const SetupInstitutionList = (resolve) =>
    (require as any)(["./Setup/Institution/list"], function(module) {
      resolve(module.SetupInstitutionList);
    });
  const SetupInstitutionTypeList = (resolve) =>
    (require as any)(["./Setup/InstitutionType/list"], function(module) {
      resolve(module.SetupInstitutionTypeList);
    });
  const SetupMediumList = (resolve) =>
    (require as any)(["./Setup/Medium/list"], function(module) {
      resolve(module.SetupMediumList);
    });
  const DashboardSurveyList = (resolve) =>
    (require as any)(["./Dashboard/SurveyMaster/list"], function(module) {
      resolve(module.DashboardSurveyList);
    });
  const DashboardSurveyDetailList = (resolve) =>
    (require as any)(["./Dashboard/SurveyDetail/list"], function(module) {
      resolve(module.DashboardSurveyDetailList);
    });

  const SetupExtraCourseList = (resolve) =>
    (require as any)(["./Setup/ExtraCourse/list"], function(module) {
      resolve(module.SetupExtraCourseList);
    });

  const SetupMonthList = (resolve) =>
    (require as any)(["./Setup/Month/list"], function(module) {
      resolve(module.SetupMonthList);
    });
  const SetupNationalityList = (resolve) =>
    (require as any)(["./Setup/Nationality/list"], function(module) {
      resolve(module.SetupNationalityList);
    });
  const SetupPassStatusList = (resolve) =>
    (require as any)(["./Setup/PassStatus/list"], function(module) {
      resolve(module.SetupPassStatusList);
    });
  const SetupPossessionList = (resolve) =>
    (require as any)(["./Setup/Possession/list"], function(module) {
      resolve(module.SetupPossessionList);
    });
  const SetupPossessionTypeList = (resolve) =>
    (require as any)(["./Setup/PossessionType/list"], function(module) {
      resolve(module.SetupPossessionTypeList);
    });
  const SetupProgramDetailsList = (resolve) =>
    (require as any)(["./Setup/ProgramDetails/list"], function(module) {
      resolve(module.SetupProgramDetailsList);
    });
  const SetupProgramList = (resolve) =>
    (require as any)(["./Setup/Program/list"], function(module) {
      resolve(module.SetupProgramList);
    });
  const SetupProvinceList = (resolve) =>
    (require as any)(["./Setup/Province/list"], function(module) {
      resolve(module.SetupProvinceList);
    });
  const SetupReligionList = (resolve) =>
    (require as any)(["./Setup/Religion/list"], function(module) {
      resolve(module.SetupReligionList);
    });
  const SetupRoomBuildingLinkList = (resolve) =>
    (require as any)(["./Setup/RoomBuildingLink/list"], function(module) {
      resolve(module.SetupRoomBuildingLinkList);
    });
  const SetupRoomList = (resolve) =>
    (require as any)(["./Setup/Room/list"], function(module) {
      resolve(module.SetupRoomList);
    });
  const SetupRoomTypeList = (resolve) =>
    (require as any)(["./Setup/RoomType/list"], function(module) {
      resolve(module.SetupRoomTypeList);
    });
  const SetupSectionList = (resolve) =>
    (require as any)(["./Setup/Section/list"], function(module) {
      resolve(module.SetupSectionList);
    });
  const SetupSessionList = (resolve) =>
    (require as any)(["./Setup/Session/list"], function(module) {
      resolve(module.SetupSessionList);
    });

  //const SetupBatchList= resolve => (require as any)(['./Setup/Batch/list'], function (module) { resolve(module.SetupBatchList) });
  const SetupShiftList = (resolve) =>
    (require as any)(["./Setup/Shift/list"], function(module) {
      resolve(module.SetupShiftList);
    });
  const SetupStatusList = (resolve) =>
    (require as any)(["./Setup/Status/list"], function(module) {
      resolve(module.SetupStatusList);
    });
  const SetupSubCityList = (resolve) =>
    (require as any)(["./Setup/SubCity/list"], function(module) {
      resolve(module.SetupSubCityList);
    });
  const SetupTermList = (resolve) =>
    (require as any)(["./Setup/Term/list"], function(module) {
      resolve(module.SetupTermList);
    });
  const SetupZoneCityLinkList = (resolve) =>
    (require as any)(["./Setup/ZoneCityLink/list"], function(module) {
      resolve(module.SetupZoneCityLinkList);
    });
  const SetupZoneList = (resolve) =>
    (require as any)(["./Setup/Zone/list"], function(module) {
      resolve(module.SetupZoneList);
    });
  const SingleConcession = (resolve) =>
    (require as any)(["./Fee/SingleConcession/list"], function(module) {
      resolve(module.SingleConcession);
    });
  const StateChange = (resolve) =>
    (require as any)(["./Admission/StateChange/list"], function(module) {
      resolve(module.StateChange);
    });
  const StruckoffReinstate = (resolve) =>
    (require as any)(["./Admission/StruckoffReinstate/list"], function(module) {
      resolve(module.StruckoffReinstate);
    });
  const StudentChangePaidDate = (resolve) =>
    (require as any)(["./Fee/ChangePaidDate/list"], function(module) {
      resolve(module.StudentChangePaidDate);
    });
    
  const StudentFeeConfirmation = (resolve) =>
    (require as any)(["./Fee/FeeConfirmation/list"], function(module) {
      resolve(module.StudentFeeConfirmation);
    });

     const ChallanReversal = (resolve) =>
    (require as any)(["./Fee/ChallanReversal"], function(module) {
      resolve(module.ChallanReversal);
    });
  const StudentRefundChallan = (resolve) =>
    (require as any)(["./Fee/Refundchallan/list"], function(module) {
      resolve(module.StudentRefundChallan);
    });

  const StudentFeeConfirmationEx = (resolve) =>
    (require as any)(["./Transportation/FeeConfirmationEx/list"], function(
      module
    ) {
      resolve(module.StudentFeeConfirmationEx);
    });
  const studentprofile = (resolve) =>
    (require as any)(["./Admission/studentprofile"], function(module) {
      resolve(module.studentprofile);
    });
  const TimeTableSlotsList = (resolve) =>
    (require as any)(["./TimeTable/Slots/list"], function(module) {
      resolve(module.TimeTableSlotsList);
    });
  const TimeTableSlotTimingsList = (resolve) =>
    (require as any)(["./TimeTable/SlotTimings/list"], function(module) {
      resolve(module.TimeTableSlotTimingsList);
    });
  // const TimeTableTimeTableBulkList = resolve => (require as any)(['./TimeTable/DayOffBulk/list'], function (module) { resolve(module.TimeTableDayOffBulkList) });
  const TimeTableTimeTableList = (resolve) =>
    (require as any)(["./TimeTable/TimeTable/list"], function(module) {
      resolve(module.TimeTableTimeTableList);
    });
  const TimeTableClose = (resolve) =>
    (require as any)(["./TimeTable/TimeTableClose/list"], function(module) {
      resolve(module.TimeTableClose);
    });

  const SubstituteTimeTableTimeTableList = (resolve) =>
    (require as any)(["./TimeTable/SubstituteTimeTable/list"], function(module) {
      resolve(module.SubstituteTimeTableTimeTableList);
    });
  const NotificationDashboard = (resolve) =>
    (require as any)(["./Admission/NotificationDashboard/list"], function(
      module
    ) {
      resolve(module.NotificationDashboard);
    });
  const NotificationDash = (resolve) =>
    (require as any)(["./Admission/NotificationDash/list"], function(module) {
      resolve(module.NotificationDash);
    });

  const SurveyDash = (resolve) =>
    (require as any)(["./Admission/surveyDashboard2/list"], function(module) {
      resolve(module.SurveyDash);
    });

  const SurveyDashDecember = resolve => (require as any)(['./Admission/surveyDashboardDecember/list'], function (module) { resolve(module.SurveyDashDecember) });
  const SurveyDashApril = resolve => (require as any)(['./Admission/surveyDashboardApril/list'], function (module) { resolve(module.SurveyDashApril) });
  const SurveyDashDecember22 = resolve => (require as any)(['./Admission/surveyDashboardDecember22/list'], function (module) { resolve(module.SurveyDashDecember22) });
  const SurveyDashJuly23Statistics = resolve => (require as any)(['./Admission/surveyDashboardJuly23/list'], function (module) { resolve(module.SurveyDashJuly23Statistics) });
  const SurveyDashJune24Statistics = resolve => (require as any)(['./Admission/surveyDashBoardjune24/list'], function (module) { resolve(module.SurveyDashJune24Statistics) });
  const SurveyDashEbooks24Statistics = resolve => (require as any)(['./Admission/surveyDashBoardEbooks24/list'], function (module) { resolve(module.SurveyDashEbooks24Statistics) });
  const SurveyDashJan25Statistics = resolve => (require as any)(['./Admission/surveyDashBoardjan25/list'], function (module) { resolve(module.SurveyDashJan25Statistics) });
  const SurveyDashJan26Statistics = resolve => (require as any)(['./Admission/surveyDashBoardjan26/list'], function (module) { resolve(module.SurveyDashJan26Statistics) });

  const SurveyDashjan22 = resolve => (require as any)(['./Admission/SurveyDashjan22/list'], function (module) { resolve(module.SurveyDashjan22) });
  const SurveyDashjuly23 = resolve => (require as any)(['./Admission/SurveyDashjuly23/list'], function (module) { resolve(module.SurveyDashjuly23) });
  const SurveyDashjune24 = resolve => (require as any)(['./Admission/SurveyDashJune24/list'], function (module) { resolve(module.SurveyDashjune24) });
  const SurveyDashEbook24 = resolve => (require as any)(['./Admission/SurveyDashEbook24/list'], function (module) { resolve(module.SurveyDashEbook24) });

  const SurveyDashboardJanuary24 = (resolve) =>
    (require as any)(["./Admission/SurveyDashboardJanuary24/list"], function(
      module
    ) {
      resolve(module.SurveyDashboardJanuary24);
    });
const SurveyDashboardJanuary26 = (resolve) =>
    (require as any)(["./Admission/SurveyDashboardJanuary26/list"], function(
      module
    ) {
      resolve(module.SurveyDashboardJanuary26);
    });
    const SurveyDashboardJanuary25 = (resolve) =>
      (require as any)(["./Admission/SurveyDashboardJanuary25/list"], function(
        module
      ) {
        resolve(module.SurveyDashboardJanuary25);
      });

  const LevelProgramClassMap = (resolve) =>
    (require as any)(["./Assessment/levelProgramClassMap/list"], function(
      module
    ) {
      resolve(module.LevelProgramClassMap);
    });
  const AssessmentSectionMap = (resolve) =>
    (require as any)(["./Assessment/AssessmentSectionMap/list"], function(
      module
    ) {
      resolve(module.AssessmentSectionMap);
    });

  const AssessmentScheduling = (resolve) =>
    (require as any)(["./Assessment/AssessmentScheduling/list"], function(
      module
    ) {
      resolve(module.AssessmentScheduling);
    });
  const AdmissionRollNoSlip = (resolve) =>
    (require as any)(["./Assessment/AdmissionRollNoSlip/list"], function(module) {
      resolve(module.AdmissionRollNoSlip);
    });

  const TimeTableTimeTableMergeList = (resolve) =>
    (require as any)(["./TimeTable/TimeTableMerge/list"], function(module) {
      resolve(module.TimeTableTimeTableMergeList);
    });
  const TransportationBusStopInfoList = (resolve) =>
    (require as any)(["./Transportation/BusStopInfo/list"], function(module) {
      resolve(module.TransportationBusStopInfoList);
    });
  const TransportationRouteDetailInfoList = (resolve) =>
    (require as any)(["./Transportation/RouteDetailInfo/list"], function(module) {
      resolve(module.TransportationRouteDetailInfoList);
    });
  const TransportationRouteInfoList = (resolve) =>
    (require as any)(["./Transportation/RouteInfo/list"], function(module) {
      resolve(module.TransportationRouteInfoList);
    });
  const TransportationRouteStopLinkList = (resolve) =>
    (require as any)(["./Transportation/RouteStopLink/list"], function(module) {
      resolve(module.TransportationRouteStopLinkList);
    });
  const TransportationRouteStudentLinkList = (resolve) =>
    (require as any)(["./Transportation/RouteStudentLink/list"], function(
      module
    ) {
      resolve(module.TransportationRouteStudentLinkList);
    });
  const TransportationVehicleInfoList = (resolve) =>
    (require as any)(["./Transportation/VehicleInfo/list"], function(module) {
      resolve(module.TransportationVehicleInfoList);
    });
  const TransportationReports = (resolve) =>
    (require as any)(["./Reports/TransportationReports/index"], function(module) {
      resolve(module.TransportationReports);
    });
  const UserRecord = (resolve) =>
    (require as any)(["./Role/User/list"], function(module) {
      resolve(module.UserRecord);
    });

  const DayClose = (resolve) =>
    (require as any)(["./Attendance/DayClose/list"], function(module) {
      resolve(module.DayClose);
    });
  const MarkDayEnd = (resolve) =>
    (require as any)(["./Attendance/MarkDayEnd/list"], function(module) {
      resolve(module.MarkDayEnd);
    });
  const DailyAttendanceStatus = (resolve) =>
    (require as any)(["./Attendance/DailyAttendanceStatus/list"], function(
      module
    ) {
      resolve(module.DailyAttendanceStatus);
    });

  const BoardBoardCampusList = (resolve) =>
    (require as any)(["./Role/User/list"], function(module) {
      resolve(module.UserRecord);
    });
  const BoardCampusStudentLinkList = (resolve) =>
    (require as any)(["./Role/User/list"], function(module) {
      resolve(module.UserRecord);
    });
  const SessionBoardExamTypeList = (resolve) =>
    (require as any)(["./Board/BoardExamType/list"], function(module) {
      resolve(module.SessionBoardExamTypeList);
    });
  const ReturnTypeList = (resolve) =>
    (require as any)(["./Board/ReturnType/list"], function(module) {
      resolve(module.ReturnTypeList);
    });
  const SessionBoardFeeList = (resolve) =>
    (require as any)(["./Board/SessionBoardFee/list"], function(module) {
      resolve(module.SessionBoardFeeList);
    });
  const BoardFee = (resolve) =>
    (require as any)(["./Board/BoardFee/list"], function(module) {
      resolve(module.BoardFee);
    });

  const BoardRegistrationCode = (resolve) =>
    (require as any)(["./Board/RegistrationCode/list"], function(module) {
      resolve(module.BoardRegistrationCodeList);
    });
  const BoardProgramCampusList = (resolve) =>
    (require as any)(["./Board/ProgramCampus/list"], function(module) {
      resolve(module.BoardProgramCampusList);
    });
  const BoardStudentBoardLinkList = (resolve) =>
    (require as any)(["./Board/StudentBoardLink/list"], function(module) {
      resolve(module.BoardStudentBoardLinkList);
    });
  const BoardStudentRegistrationNo = (resolve) =>
    (require as any)(["./Board/StudentRegistrationNo/list"], function(module) {
      resolve(module.BoardStudentRegistrationNo);
    });
  const BoardUniversityExamEntry = (resolve) =>
    (require as any)(["./Board/BoardUniversityExamEntry/list"], function(module) {
      resolve(module.BoardUniversityExamEntry);
    });
  const BoardUniversitySearchStudent = (resolve) =>
    (require as any)(["./Board/BoardUniversitySearchStudent"], function(module) {
      resolve(module.BoardUniversitySearchStudent);
    });
  const BoardUniversityRollNo = (resolve) =>
    (require as any)(["./Board/BoardUniversityRollNo/list"], function(module) {
      resolve(module.BoardUniversityRollNo);
    });
  const BoardUniversityResultCard = (resolve) =>
    (require as any)(["./Board/BoardUniversityResultCard/list"], function(
      module
    ) {
      resolve(module.BoardUniversityResultCard);
    });

  const AttendanceHistoryList = (resolve) =>
    (require as any)(["./Attendance/AttendanceHistory/list"], function(module) {
      resolve(module.AttendanceHistoryList);
    });
  const ExaminationGradingPolicyBulkList = (resolve) =>
    (require as any)(["./Examination/GradingPolicyBulk/list"], function(module) {
      resolve(module.ExaminationGradingPolicyBulkList);
    });

  const ExaminationCampusFailCriteriaMappingList = (resolve) =>
    (require as any)(["./Examination/CampusFailCriteriaMapping/list"], function(
      module
    ) {
      resolve(module.ExaminationCampusFailCriteriaMappingList);
    });
  const ExaminationCampusGradingMappingList = (resolve) =>
    (require as any)(["./Examination/CampusGraddingMapping/list"], function(
      module
    ) {
      resolve(module.ExaminationCampusGradingMappingList);
    });
  const TeacherExam = (resolve) =>
    (require as any)(["./Examination/TeacherExam/list"], function(module) {
      resolve(module.TeacherExam);
    });
  const TeacherExam2 = (resolve) =>
    (require as any)(["./Examination/TeacherExam2/list"], function(module) {
      resolve(module.TeacherExam2);
    });

  const StudentFeeChallanSearch = (resolve) =>
    (require as any)(["./Fee/FeeChallanSearch/list"], function(module) {
      resolve(module.StudentFeeChallanSearch);
    });
  const ClassTransfer = (resolve) =>
    (require as any)(["./Role/User/list"], function(module) {
      resolve(module.UserRecord);
    });
  const AdmissionAdmissionFormListEx = (resolve) =>
    (require as any)(["./Migration/AdmissionFormEx/list"], function(module) {
      resolve(module.AdmissionAdmissionFormListEx);
    });
  const AttendancePercentage = (resolve) =>
    (require as any)(["./Migration/AttendancePercentage/list"], function(module) {
      resolve(module.AttendancePercentage);
    });
  const TimeTableDayOffBulkList = (resolve) =>
    (require as any)(["./TimeTable/DayOffBulk/list"], function(module) {
      resolve(module.TimeTableDayOffBulkList);
    });
  const RemoveDayOffBulkList = (resolve) =>
    (require as any)(["./TimeTable/RemoveDayOff/list"], function(module) {
      resolve(module.RemoveDayOffBulkList);
    });
  const DayOff = (resolve) =>
    (require as any)(["./TimeTable/DayOff/list"], function(module) {
      resolve(module.DayOff);
    });
  const seatingPlanDateSheetList = (resolve) =>
    (require as any)(["./seatingplan/DateSheet/list"], function(module) {
      resolve(module.seatingPlanDateSheetList);
    });
  const seatingPlanDateSheetDetailList = (resolve) =>
    (require as any)(["./seatingplan/DateSheetDetail/list"], function(module) {
      resolve(module.seatingPlanDateSheetDetailList);
    });
  const SeatingPlanStudent = (resolve) =>
    (require as any)(["./seatingplan/SeatingPlanStudent/list"], function(module) {
      resolve(module.SeatingPlanStudent);
    });
  const AdmissionStudentFeeInfo = (resolve) =>
    (require as any)(["./Admission/StudentFeeInfo/list"], function(module) {
      resolve(module.AdmissionStudentFeeInfo);
    });
  const AdmissionPreAcademicInfoList = (resolve) =>
    (require as any)(["./Admission/PreAcademicInfo/list"], function(module) {
      resolve(module.AdmissionPreAcademicInfoList);
    });
  const TeacherHod = (resolve) =>
    (require as any)(["./HumanResource/Staffhod/list"], function(module) {
      resolve(module.TeacherHod);
    });
  const SectionIncharge = (resolve) =>
    (require as any)(["./TimeTable/SectionIncharge/list"], function(module) {
      resolve(module.SectionIncharge);
    });
  const AttendanceFineGenerate = (resolve) =>
    (require as any)(["./Fee/AttendanceFineGenerate/list"], function(module) {
      resolve(module.AttendanceFineGenerate);
    });
  const CityConfigurationQuiz = (resolve) =>
    (require as any)(["./HumanResource/CityConfigurationQuiz/list"], function(
      module
    ) {
      resolve(module.CityConfigurationQuiz);
    });
  const LeagueConfigurationQuiz = (resolve) =>
    (require as any)(["./HumanResource/LeagueConfigurationQuiz/list"], function(
      module
    ) {
      resolve(module.LeagueConfigurationQuiz);
    });

  export { IAttendanceDetailUpdate } from "./Attendance/AttendanceBulkDetail/list";
  //comment after 'window.bootsrap' load fail error resolved

  export {
    SurveyDashboardJanuary24,
    SurveyDashboardJanuary25,
    SurveyDashboardJanuary26,
    AdmissionPreAcademicInfoList,
    AdmissionDuplicateRemoveList,
    ElMigrationList,
    SessionDurationList,
    AdmissionStudentFeeInfo,
    TimeTableDayOffBulkList,
    RemoveDayOffBulkList,
    EnrollmentBatch,
    MicrosoftStdPassword,
    ssatStudentData,
    FinanceData,
    DayOff,
    Helper,
    ManageUserList,
    ManageUser,
    RoleList,
    ReadRole,
    CreateRole,
    UpdateRole,
    StudentRoster,
    SmsToStudents,
    AttendanceRegister,
    StudentAttendance,
    BoardStudentRegistrationNo,
    BoardUniversityExamEntry,
    BoardUniversitySearchStudent,
    BoardUniversityRollNo,
    BoardUniversityResultCard,
    TeacherAttendanceReport,
    TeacherExamReport,
    AdmissionAdmissionFormList,
    AdmissionAdmissionFormListBr,
    BulkCopyProgramDetail,
    AdmissionEligibilityCriteriaList,
    AdmissionBulitanSaleList,
    AdmissionInquiryList,
    AdmissionReports,
    AdmissionSaleTypeList,
    ProgramFeeAdjustmentList,
    AdmissionDashboard,
    AdmissionComaprisonDashboard,
    AdmissionComaprisonDashboardCampusWise,
      AdmissionComaprisonDashboardCampusWiseClone,
    CreditNotes,
    StudentFeedback,
    WithdrawnConcessionReversal,
    applyConcessionOnInstallment,
    PushNotification,
    PushNotificationCampus,
    FeePaidDashboard,
    AdmissionStudentsImageList,
    AdmissionStudentsList,
    AttendanceApproval,
    AttendanceApprovalRemove,
    AttendanceAttendanceDetailList,
    AttendanceAttendenceMasterList,
    AttendanceAttendenceStatusList,
    ElUpdationList,
    KinShipList,
    AttendanceBulk,
    AttendanceBulkDetail,
    AttendanceReports,
    AttendanceTeacher,
    AttendanceTeacherBulk,
    AttendanceTeacherUser,
    AttendenceDashboard,
    AttendenceDashboard2,
    ConcessionDashboard,
    RevenueDashboard,
    ComparisonDashboard,
    ChangeDueDate,
    ConcessionReports,
    ConcesssionReNew,
    CustomChallanList,
    EducationChallanList,
    CustomFee,
    CustomSms,
    SmsApproval,
    Notification,
    NotificationApproval,
    ELChaptersList,
    ChapterLinksList,
    MCQsQuestionList,
    BoardsList,
    BoardProgramClassCourseLinkList,
    VideosList,
    TopicsList,
    TopicsVideoList,
    MCQsAnswersList,
    TeacherTimeTable,
    ELModelPapersList,
    ELModelPapersQuestionsList,
    ELQuestionsList,
    ELTopicsList,
    EnrolledReports,
    EnrollmentReverse,
    ExamApproval,
    ExamSMSApproval,
    ExamDeletion,
    ExamDeletion2,
    ExamUnApproval,
    ExamApprovalExam2,
    ExamUnApprovalExam2,
    ExamBulk,
    ExamScheduleDetail,
    ExaminationCampusGradingPolicyLinkList,
    ExaminationExamDetailList,
    ExaminationExamMasterList,
    ExaminationExamScheduleList,
    ExaminationExamSectionLink,
    ExaminationExamTypeList,
    LevelDefinition,
    AssessmentReport,
    ExaminationGradingPolicyList,
    ExaminationReports,
    ExaminationReports2,
    ExaminationReportsEx,
    TransportationReports,
    ExamResultApproval,
    FailCriteria,
    TeacherEvaulation,
    FeeApplyConcession,
    FeeApplyConcessionBulk,
    FeeApplyConcessionBulkPre,
    FeeApplyScholarship,
    FeeBankList,
    FeeCampusBankLinkList,
    AdhocChallanLinkList,
    FeeCampusChallanNoteLinkList,
    FeeChallanNoteList,
    FeeChallanTypeList,
    FeeChallanValidityList,
    FeeConcessionBulkList,
    FeeConcessionDetailList,
    FeeConcessionList,
    FeeContinuationPolicyList,
    feeExemption,
    StudentFeeDetailDescriptionList,
    FeeFeeActivityList,
    FeeFeeHeadList,
    FeeFeeStructureApprovalList,
    MinimumPaidDateList,
    FeeFeeStructureDetailList,
    FeeFeeStructureList,
    FeeFeeStructureSingleList,
    RegistrationEmailProgramList,
    FeeReports,
    FinanceReports,
    FeeExemptionManually,
    ChallanCancel,
    SectionFine,
    ReverseConcessionList,
    ExamUpdationList,
    ExamUpdationListES,
    FeeScholarshipCriteriaList,
    FeeStudentChallanList,
    FeeStudentChallanPaidDateList,
    FeeStudentFeeStructureList,
    feeSubInstallment,
    FeeTBLGradesList,
    Franchise,
    ChallanValidityUpdate,
    GradingCriteria,
    HumanResourceDepartmentsList,
    UpdMicroPassList,
    HumanResourceDesignationsList,
    HumanResourceStaffList,
    StaffCourseList,
    HumanResourceStaffProfile,
    TeacherHod,
    SectionIncharge,
    LeaveManagement,
    LeaveManagementTesting,
    LeaveApproval,
    MessageSMSAPIList,
    MessageTemplate,
    PreviousFee,
    ProfileStaff,
    ProgramTransfer,
    ProgramTransferBulk,
    CampusTransferBulk,
    RegistrationCourseList,
    EmailTemplateList,
    CampusEmailMapping,
    RegistrationEnrollmentBulkList,
    RegistrationEnrollmentBulkWithoutPaidList,
    RegistrationEnrollmentBulkWithoutPaidListEx,
    RegistrationEnrollmentsList,
    RegistrationProgramCourseLinkList,
    RegistrationSectionChangeList,
    RegistrationSectionChangeBulkList,
    RegistrationSectionCourseLinkList,
    RegistrationSectionsList,
    StudentUserGen,
    RolePrevilagesList,
    RoleUserLogList,
    SectionRightLink,
    MaskRightLink,
    SecurityClaimUpd,
    SetupAddressList,
    SetupAdmissionTypeList,
    SetupBloodGroupList,
    SetupBoardList,
    SetupBoardTypeList,
    SetupBuildingAddressLinkList,
    SetupBuildingList,
    SetupBusinessGroupList,
    SetupBusinessUnitList,
    AssessmentType,
    AssessmentSchemeDefinition,
    AssessmentSchemeDetail,
    SetupCampusBuildingLinkList,
    SetupCampusList,
    SetupCampusProgramLinkList,
    SetupCityList,
    SetupClassList,
    SetupCollectorList,
    SetupConcessionRemarksList,
    SetupCountryList,
    SetupDegreeList,
    SetupGenderList,
    SetupGroupList,
    SetupInstitutionList,
    SetupInstitutionTypeList,
    SetupExtraCourseList,
    DashboardSurveyList,
    DashboardSurveyDetailList,
    SetupMediumList,
    SetupMonthList,
    AssessmentCategory,
    AssessmentSchedule,
    SetupNationalityList,
    SetupPassStatusList,
    SetupPossessionList,
    SetupPossessionTypeList,
    SetupProgramDetailsList,
    SetupProgramList,
    SetupProvinceList,
    SetupReligionList,
    SetupRoomBuildingLinkList,
    SetupRoomList,
    SetupRoomTypeList,
    SetupSectionList,
    SetupSessionList,
    //SetupBatchList,
    SetupShiftList,
    SetupStatusList,
    SetupSubCityList,
    SetupTermList,
    ConcessStdList,
    OnlineFormApprovalList,
    ConcessKinshipStdList,
    SetupZoneCityLinkList,
    SetupZoneList,
    SingleConcession,
    StateChange,
    NotificationDashboard,
    NotificationDash,
    StruckoffReinstate,
    StudentChangePaidDate,
    StudentFeeConfirmation,
    ChallanReversal,
    StudentRefundChallan,
    StudentFeeConfirmationEx,
    studentprofile,
    SurveyDash,
    SurveyDashDecember,
    SurveyDashDecember22,
    SurveyDashjan22,
    SurveyDashJuly23Statistics,
      SurveyDashJune24Statistics,
      SurveyDashJan25Statistics,
      SurveyDashJan26Statistics,
      SurveyDashEbooks24Statistics,
    SurveyDashjuly23,
      SurveyDashjune24,
      SurveyDashEbook24,
    SurveyDashApril,
    LevelProgramClassMap,
    AssessmentSectionMap,
    AssessmentScheduling,
    AdmissionRollNoSlip,
    TimeTableSlotsList,
    TimeTableSlotTimingsList,
    // TimeTableTimeTableBulkList,
    TimeTableTimeTableList,
    SubstituteTimeTableTimeTableList,
    TimeTableClose,
    TimeTableTimeTableMergeList,
    TransportationBusStopInfoList,
    TransportationRouteDetailInfoList,
    TransportationRouteInfoList,
    TransportationRouteStopLinkList,
    TransportationRouteStudentLinkList,
    TransportationVehicleInfoList,
    UserRecord,
    // TeacherDashboard,
    DayClose,
    MarkDayEnd,
    DailyAttendanceStatus,
    BoardBoardCampusList,
    BoardCampusStudentLinkList,
    AttendanceHistoryList,
    ExaminationGradingPolicyBulkList,
    SmartAttendence,
    CalendarConfirmation,
    ExaminationCampusFailCriteriaMappingList,
    ExaminationCampusGradingMappingList,
    TeacherExam,
    TeacherExam2,
    StudentFeeChallanSearch,
    ClassTransfer,
    AdmissionAdmissionFormListEx,
    SessionBoardExamTypeList,
    ReturnTypeList,
    BoardFee,
    BoardProgramCampusList,
    BoardRegistrationCode,
    BoardStudentBoardLinkList,
    SessionBoardFeeList,
    AttendancePercentage,
    seatingPlanDateSheetList,
    seatingPlanDateSheetDetailList,
    SeatingPlanStudent,
    AcademicHolidayType,
    AcademicHolidays,
    AcademicEvents,
    AcademicCalendarType,
    RegistrationClassPromotionList,
    RegistrationClassTransferList,
    AttendanceFineGenerate,
    FeeMultipleSubInstallments,
    AcademicCalendarMaster,
    AcademicCalendarReport,
    AcademicCalendarNew,
    AcademicSectionMap,
    UserCreation,
    CityConfigurationQuiz,
    LeagueConfigurationQuiz,
    QuizDashBoard
  };
