using System;
using System.IO;
using Cms.Data.Model;
using Cms360.Common;
using Cms360.Data.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

namespace Cms360.Data
{
    public abstract class DbContextBase : DbContext
    {
        public virtual DbSet<UserProviderLocal> LocalProvider { get; set; }
        public virtual DbSet<Provider> Provider { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<RoleSecurityClaim> RoleSecurityClaim { get; set; }
        public virtual DbSet<AdmissionAverageEx> AdmissionAverageEx { get; set; }
        public virtual DbSet<StudentUserCreationLog> StudentUserCreationLog { get; set; }
        public virtual DbSet<JsonFunctionResult> JsonFunctionResult { get; set; }
        public virtual DbSet<UserLoginDevice> UserLoginDevice { get; set; }
        public virtual DbSet<LevelProgramClassMap> LevelProgramClassMap { get; set; }
        public virtual DbSet<VWLevelProgramClassMap> VWLevelProgramClassMap { get; set; }
        public virtual DbSet<AssessmentSectionMap> AssessmentSectionMap { get; set; }
        public virtual DbSet<VWAssessmentSectionMap> VWAssessmentSectionMap { get; set; }
        public virtual DbSet<AssessmentLevelProgram> AssessmentLevelProgram { get; set; }


        public virtual DbSet<General> General { get; set; }
        public virtual DbSet<VWAssessmentSections> VWAssessmentSections { get; set; }
        public virtual DbSet<VWAssessmentNames> VWAssessmentNames { get; set; }
        public virtual DbSet<AssessmentCategory> AssessmentCategory { get; set; }
        public virtual DbSet<ComparisonData> ComparisonData { get; set; }
        public virtual DbSet<AdmissionAverage> AdmissionAverage { get; set; }

        public virtual DbSet<SecurityClaimUpd> SecurityClaimUpd { get; set; }
        public virtual DbSet<AttendanceTeacherMonth> AttendanceTeacherMonth { get; set; }
        public virtual DbSet<VWExaminationExamScheduleEx> VWExaminationExamScheduleEx { get; set; }
        public virtual DbSet<AttendanceTeacherMonthDetail> AttendanceTeacherMonthDetail { get; set; }
        public virtual DbSet<StudentOverAllWeitage> StudentOverAllWeitage { get; set; }
        public virtual DbSet<StudentOverAllWeitageData> StudentOverAllWeitageData { get; set; }



        public virtual DbSet<AttendanceTeacherMonthDetailHodEx> AttendanceTeacherMonthDetailHodEx { get; set; }
        public virtual DbSet<GetstudentMigrationtrsnfer> GetstudentMigrationtrsnfer { get; set; }
        public virtual DbSet<TeacherSearchApiCoursesEx> TeacherSearchApiCoursesEx { get; set; }
        public virtual DbSet<PPStudentDetail> PPStudentDetail { get; set; }
        public virtual DbSet<ExamTypeWiseReportExam2> ExamTypeWiseReportExam2 { get; set; }
        public virtual DbSet<EmailTemplate> EmailTemplate { get; set; }

        public virtual DbSet<ExamTypeWiseExam2Agrr> ExamTypeWiseExam2Agrr { get; set; }

        public virtual DbSet<AttendanceExamPercentage> AttendanceExamPercentage { get; set; }

        public virtual DbSet<SectionWiseExam2> SectionWiseExam2 { get; set; }
        public virtual DbSet<SectionWiseAssesmentStudent> SectionWiseAssesmentStudent { get; set; }
        public virtual DbSet<SectionWiseAssesmentStudentAll> SectionWiseAssesmentStudentAll { get; set; }



        public virtual DbSet<AttendenceDashboard> AttendenceDashboard { get; set; }
        public virtual DbSet<AssessmentSchedule> AssessmentSchedule { get; set; }
        public virtual DbSet<AttendenceDashboard2> AttendenceDashboard2 { get; set; }
        public virtual DbSet<AcademicPerformaceStudentWise> AcademicPerformaceStudentWise { get; set; }
        public virtual DbSet<AcademicPerformaceStudentWiseEx> AcademicPerformaceStudentWiseEx { get; set; }
        public virtual DbSet<NotificationDashboardList> NotificationDashboardList { get; set; }
        public virtual DbSet<NotificationDashboardListEx> NotificationDashboardListEx { get; set; }
        public virtual DbSet<SurveyRatingList> SurveyRatingList { get; set; }
        public virtual DbSet<SurveyRatingListExx2> SurveyRatingListExx2 { get; set; }
        public virtual DbSet<QuizResponseCms> QuizResponseCms { get; set; }



        public virtual DbSet<NotificationRatingGraph> NotificationRatingGraph { get; set; }
        public virtual DbSet<DashboardComment> DashboardComment { get; set; }
        public virtual DbSet<StudentFeedback> StudentFeedback { get; set; }
        public virtual DbSet<StudentFeedbackAgainstStudent> StudentFeedbackAgainstStudent { get; set; }
        public virtual DbSet<TeacherSearchApi> TeacherSearchApi { get; set; }
        public virtual DbSet<TeacherSearchApiEx> TeacherSearchApiEx { get; set; }

        public virtual DbSet<TeacherSearch> TeacherSearch { get; set; }
        public virtual DbSet<TeacherRatingGraph> TeacherRatingGraph { get; set; }
        public virtual DbSet<TeacherRatingGraphEX> TeacherRatingGraphEX { get; set; }
        public virtual DbSet<TeacherRatingGraphEXSection> TeacherRatingGraphEXSection { get; set; }
        public virtual DbSet<TeacherRatingGraphEXSectionwithtotal> TeacherRatingGraphEXSectionwithtotal { get; set; }

        public virtual DbSet<TeacherRatingGraphMonth> TeacherRatingGraphMonth { get; set; }
        public virtual DbSet<TeacherSurvey> TeacherSurvey { get; set; }
        public virtual DbSet<TeacherSurveyEX> TeacherSurveyEX { get; set; }
        public virtual DbSet<SurveyStatistics> SurveyStatistics { get; set; }
        public virtual DbSet<SurveyOverAllResult> SurveyOverAllResult { get; set; }
        public virtual DbSet<Dec2021SurveyOverAllResult> Dec2021SurveyOverAllResult { get; set; }
        public virtual DbSet<April2022SurveyOverAllResult> April2022SurveyOverAllResult { get; set; }

        public virtual DbSet<Dec2021SurveyOverAllResultpre> Dec2021SurveyOverAllResultpre { get; set; }

        public virtual DbSet<Dec2021SurveyOverAllResultpreB> Dec2021SurveyOverAllResultpreB { get; set; }


        public virtual DbSet<SurveyRatingListEx> SurveyRatingListEx { get; set; }
        public virtual DbSet<SurveyRatingListEx2> SurveyRatingListEx2 { get; set; }

        public virtual DbSet<ExamIndividualSummaryAx> ExamIndividualSummaryAx { get; set; }
        public virtual DbSet<ExamIndividualSummaryAxEx> ExamIndividualSummaryAxEx { get; set; }
        public virtual DbSet<EnrolledReportsContEx2> EnrolledReportsContEx2 { get; set; }


        public virtual DbSet<StudentAcademicTopics> StudentAcademicTopics { get; set; }

        public virtual DbSet<StudentRevenuePaidEx> StudentRevenuePaidEx { get; set; }
        public virtual DbSet<SurveyCommentDash> SurveyCommentDash { get; set; }
        public virtual DbSet<SurveyCommentDash26> SurveyCommentDash26 { get; set; }
        public virtual DbSet<ExamTypeWiseReportEx> ExamTypeWiseReportEx { get; set; }
        public virtual DbSet<CalculateMonthAverageList> CalculateMonthAverageList { get; set; }
        public virtual DbSet<SurveyDetail2> SurveyDetail2 { get; set; }
        public virtual DbSet<Survey2> Survey2 { get; set; }
        public virtual DbSet<Survey26> Survey26 { get; set; }
        public virtual DbSet<Survey3> Survey3 { get; set; }
        public virtual DbSet<TotalSurveyJanuary2024> TotalSurveyJanuary2024 { get; set; }


        public virtual DbSet<VW_OwnedSubCities> VW_OwnedSubCities { get; set; }

        public virtual DbSet<AttendanceReportStatusExx> AttendanceReportStatusExx { get; set; }
        public virtual DbSet<GetSurveyDetail> GetSurveyDetail { get; set; }

        public virtual DbSet<QueryType> QueryType { get; set; }





        public virtual DbSet<SmartAttendence> SmartAttendence { get; set; }
        public virtual DbSet<AttendanceDashboard2LastMonths> AttendanceDashboard2LastMonths { get; set; }
        public virtual DbSet<AttendanceDashboard2LastMonthsEx> AttendanceDashboard2LastMonthsEx { get; set; }

        public virtual DbSet<AttendanceDashboard2CityWise> AttendanceDashboard2CityWise { get; set; }

        public virtual DbSet<ConcessionDashboard> ConcessionDashboard { get; set; }
        public virtual DbSet<ConcessionDashboardEx> ConcessionDashboardEx { get; set; }
        public virtual DbSet<ConcessionDashboardEx2> ConcessionDashboardEx2 { get; set; }

        public virtual DbSet<AdmissionComparisonTotalAverage> AdmissionComparisonTotalAverage { get; set; }

        public virtual DbSet<RevenueDashboard> RevenueDashboard { get; set; }

        public virtual DbSet<StudntListEx> StudntListEx { get; set; }
        public virtual DbSet<InstallmentPaid> InstallmentPaid { get; set; }

        public virtual DbSet<ConcessKinBulk> ConcessKinBulk { get; set; }
        public virtual DbSet<VMChallanValidityUpdateEx> VMChallanValidityUpdateEx { get; set; }
        public virtual DbSet<ChallanValidityUpdateEx> ChallanValidityUpdateEx { get; set; }

        public virtual DbSet<ConcessKinBulkEx> ConcessKinBulkEx { get; set; }

        public virtual DbSet<RevenuePaid> RevenuePaid { get; set; }

        public virtual DbSet<StudentRevenuePaid> StudentRevenuePaid { get; set; }

        public virtual DbSet<AdmissionCount> AdmissionCount { get; set; }
        public virtual DbSet<SurveyResult> SurveyResult { get; set; }

        public virtual DbSet<Survey> Survey { get; set; }

        public virtual DbSet<SurveyList> SurveyList { get; set; }

        public virtual DbSet<SurveyCampusList> SurveyCampusList { get; set; }

        public virtual DbSet<SurveyCourseList> SurveyCourseList { get; set; }

        public virtual DbSet<TeacherRatingList> TeacherRatingList { get; set; }

        public virtual DbSet<SubjectRatingList> SubjectRatingList { get; set; }

        public virtual DbSet<SurveySubjectList> SurveySubjectList { get; set; }

        public virtual DbSet<SurveySubCityList> SurveySubCityList { get; set; }

        public virtual DbSet<TopTeachers> TopTeachers { get; set; }


        public virtual DbSet<AdmissionFeeCount> AdmissionFeeCount { get; set; }


        public virtual DbSet<ExamMonthlySectionReport> ExamMonthlySectionReport { get; set; }

        public virtual DbSet<ExamMonthlySectionReportExam2> ExamMonthlySectionReportExam2 { get; set; }


        public virtual DbSet<ExamUpdList> ExamUpdList { get; set; }

        public virtual DbSet<SetupExtraCourse> SetupExtraCourse { get; set; }

        public virtual DbSet<SetupExtraCourseVM> SetupExtraCourseVM { get; set; }


        public virtual DbSet<RoomBuildingLinkVM> RoomBuildingLinkVM { get; set; }

        public virtual DbSet<SeatingPlanDateSheetVM> SeatingPlanDateSheetVM { get; set; }

        public virtual DbSet<RolePrevilages> RolePrevilages { get; set; }
        public virtual DbSet<SecurityClaim> SecurityClaim { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<UserProvider> UserProvider { get; set; }
        public virtual DbSet<UserRole> UserRole { get; set; }
        public virtual DbSet<TeacherCourse> TeacherCourse { get; set; }
        public virtual DbSet<TeacherSection> TeacherSection { get; set; }

        public virtual DbSet<UserRoles> UserRoles { get; set; }

        public virtual DbSet<Verification> Verification { get; set; }
        public virtual DbSet<SetupCampusProgramVMo> SetupCampusProgramVMo { get; set; }

        public virtual DbSet<AdmissionAdmissionForm> AdmissionAdmissionForm { get; set; }
        public virtual DbSet<AdmissionBulitanSale> AdmissionBulitanSale { get; set; }

        public virtual DbSet<AdmissionInquiry> AdmissionInquiry { get; set; }
        public virtual DbSet<AdmissionEligibilityCriteria> AdmissionEligibilityCriteria { get; set; }
        public virtual DbSet<AdmissionSaleType> AdmissionSaleType { get; set; }
        public virtual DbSet<AdmissionStudents> AdmissionStudents { get; set; }
        public virtual DbSet<StudentChallanAttachments> StudentChallanAttachments { get; set; }

        public virtual DbSet<AdmissionFormRequest> AdmissionFormRequest { get; set; }

        public virtual DbSet<AdmissionStudentsImage> AdmissionStudentsImage { get; set; }
        public virtual DbSet<AttendanceAttendanceDetail> AttendanceAttendanceDetail { get; set; }
        public virtual DbSet<LeaveInfo> LeaveInfo { get; set; }

        public virtual DbSet<FeeBankVM> FeeBankVM { get; set; }

        public virtual DbSet<SessionBoardFee> SessionBoardFee { get; set; }

        public virtual DbSet<StudentBoardLinkData> StudentBoardLinkData { get; set; }
        public virtual DbSet<StudentBoardRegistration> StudentBoardRegistration { get; set; }
        public virtual DbSet<CampusEmailMapping> CampusEmailMapping { get; set; }

        public virtual DbSet<StudentBoardUniRollData> StudentBoardUniRollData { get; set; }

        public virtual DbSet<StudentBoardExamEntry> StudentBoardExamEntry { get; set; }

        public virtual DbSet<StudentBoardUniversityRollNoList> StudentBoardUniversityRollNoList { get; set; }

        public virtual DbSet<BoardUniversityResultCard> BoardUniversityResultCard { get; set; }
        public virtual DbSet<FeeStatEx> FeeStatEx { get; set; }
        public virtual DbSet<GenderWiseCount> GenderWiseCount { get; set; }



        public virtual DbSet<StudentBoardRegistrationEx> StudentBoardRegistrationEx { get; set; }
        public virtual DbSet<StudentBoardUnivertySearch> StudentBoardUnivertySearch { get; set; }


        public virtual DbSet<BoardFeePaidStudent> BoardFeePaidStudent { get; set; }

        public virtual DbSet<VWExaminationExamSchedule> VWExaminationExamSchedule { get; set; }

        public virtual DbSet<BoardFee> BoardFee { get; set; }

        public virtual DbSet<BoardRegistrationCode> BoardRegistrationCode { get; set; }

        public virtual DbSet<ReturnType> ReturnType { get; set; }

        public virtual DbSet<SessionBoardFeeVM> SessionBoardFeeVM { get; set; }
        public virtual DbSet<StudentsCampusVM> StudentsCampusVM { get; set; }
        public virtual DbSet<RouteStudentLinkEx> RouteStudentLinkEx { get; set; }

        public virtual DbSet<StudentFeesdetailActivity> StudentFeesdetailActivity { get; set; }

        public virtual DbSet<AttendanceLeaves> AttendenceLeaves { get; set; }
        public virtual DbSet<VWCampusProgramCity> VWCampusProgramCity { get; set; }
        public virtual DbSet<VWCampusProgramLevel> VWCampusProgramLevel { get; set; }

        public virtual DbSet<VWCampusProgramLevelEx> VWCampusProgramLevelEx { get; set; }
        public virtual DbSet<VWProgramLevel> VWProgramLevel { get; set; }



        public virtual DbSet<AttendanceAttendenceMaster> AttendanceAttendenceMaster { get; set; }
        public virtual DbSet<AttendanceAttendenceStatus> AttendanceAttendenceStatus { get; set; }
        public virtual DbSet<VWAttendanceHistory> VWAttendanceHistory { get; set; }
        public virtual DbSet<AttendanceDevice> AttendanceDevice { get; set; }

        public virtual DbSet<BoardBoardCampus> BoardBoardCampus { get; set; }
        public virtual DbSet<BoardCampusStudentLink> BoardCampusStudentLink { get; set; }
        public virtual DbSet<BoardVWCampusStudentLink> BoardVWCampusStudentLink { get; set; }

        public virtual DbSet<ExaminationCampusGradingPolicyLink> ExaminationCampusGradingPolicyLink { get; set; }

        public virtual DbSet<ExaminationCampusGradingMapping> ExaminationCampusGradingMapping { get; set; }

        public virtual DbSet<ExaminationCampusFailCriteriaMapping> ExaminationCampusFailCriteriaMapping { get; set; }
        public virtual DbSet<ExaminationExamDetail> ExaminationExamDetail { get; set; }
        public virtual DbSet<ExaminationExamMaster> ExaminationExamMaster { get; set; }
        public virtual DbSet<ExaminationExamMasterNew> ExaminationExamMasterNew { get; set; }
        public virtual DbSet<ExaminationExamMasterVM> ExaminationExamMasterVM { get; set; }
        public virtual DbSet<AttendanceUpdateVM> AttendanceUpdateVM { get; set; }

        public virtual DbSet<ExaminationExamType> ExaminationExamType { get; set; }
        public virtual DbSet<LevelDefinition> LevelDefinition { get; set; }
        public virtual DbSet<AssessmentType> AssessmentType { get; set; }
        public virtual DbSet<AssessmentTypeVM> AssessmentTypeVM { get; set; }
        // public virtual DbSet<AssessmentCatorgorydata> AssessmentCatorgorydata { get; set; }
        public virtual DbSet<AssessmentSchemeMaster> AssessmentSchemeMaster { get; set; }
        public virtual DbSet<AssessmentSchemeDetail> AssessmentSchemeDetail { get; set; }
        public virtual DbSet<AssessmentSchemeExamType> AssessmentSchemeExamType { get; set; }
        public virtual DbSet<AssessmentSchemeMasterData> AssessmentSchemeMasterData { get; set; }
        public virtual DbSet<AssessmentSchemeDetailData> AssessmentSchemeDetailData { get; set; }
        public virtual DbSet<AssessmentSchemeMasterVM> AssessmentSchemeMasterVM { get; set; }












        public virtual DbSet<ExaminationExamTypeEx> ExaminationExamTypeEx { get; set; }
        public virtual DbSet<ExaminationGradingPolicy> ExaminationGradingPolicy { get; set; }
        public virtual DbSet<ProgramFeeAdjustment> ProgramFeeAdjustment { get; set; }
        public virtual DbSet<ProgramFeeAdjustmentVM> ProgramFeeAdjustmentVM { get; set; }

        public virtual DbSet<ExaminationExamSectionLinkVM> ExaminationExamSectionLinkVM { get; set; }
        public virtual DbSet<ExaminationExamDetailVM> ExaminationExamDetailVM { get; set; }
        public virtual DbSet<ExaminationExamSchedule> ExaminationExamSchedule { get; set; }
        public virtual DbSet<ExaminationExamScheduleList> ExaminationExamScheduleList { get; set; }

        public virtual DbSet<ExaminationExamScheduleModel> ExaminationExamScheduleModel { get; set; }
        public virtual DbSet<StudentFeeInfoData> StudentFeeInfoData { get; set; }

        public virtual DbSet<ExaminationExamScheduleVM> ExaminationExamScheduleVM { get; set; }
        public virtual DbSet<ExaminationFailCriteria> ExaminationFailCriteria { get; set; }
        public virtual DbSet<ExaminationFailDetailCriteria> ExaminationFailDetailCriteria { get; set; }
        public virtual DbSet<ExaminationFailMasterCriteria> ExaminationFailMasterCriteria { get; set; }
        public virtual DbSet<ExaminationVWFailMasterCriteria> ExaminationVWFailMasterCriteria { get; set; }
        public virtual DbSet<ExaminationVWCampusFailCriteria> ExaminationVWCampusFailCriteria { get; set; }
        public virtual DbSet<ExaminationGradingCriteriaVM> ExaminationGradingCriteriaVM { get; set; }
        public virtual DbSet<ExaminationGradingDetail> ExaminationGradingDetail { get; set; }
        public virtual DbSet<ExaminationGradingMaster> ExaminationGradingMaster { get; set; }

        public virtual DbSet<FeeBank> FeeBank { get; set; }
        public virtual DbSet<ExamMonthWise> ExamMonthWise { get; set; }
        public virtual DbSet<ExamMonthWiseEx> ExamMonthWiseEx { get; set; }

        public virtual DbSet<ExamMonthlyReportExx> ExamMonthlyReportExx { get; set; }
        public virtual DbSet<PreAdmissionReport> PreAdmissionReport { get; set; }
        public virtual DbSet<Events> Events { get; set; }

        public virtual DbSet<EventsVW> EventsVW { get; set; }
        public virtual DbSet<PreFirstYear> PreFirstYear { get; set; }

        public virtual DbSet<FeeCampusBankLink> FeeCampusBankLink { get; set; }
        public virtual DbSet<FeeCampusBankAccountVM> FeeCampusBankAccountVM { get; set; }
        public virtual DbSet<FeeCampusChallanNoteLink> FeeCampusChallanNoteLink { get; set; }
        public virtual DbSet<FeeChallanNote> FeeChallanNote { get; set; }
        public virtual DbSet<FeeChallanType> FeeChallanType { get; set; }
        public virtual DbSet<VWConcession> VWConcession { get; set; }
        public virtual DbSet<FeeChallanValidity> FeeChallanValidity { get; set; }
        public virtual DbSet<VMChallanValidityUpdate> VMChallanValidityUpdate { get; set; }
        public virtual DbSet<StudentUserGenEx> StudentUserGenEx { get; set; }
        public virtual DbSet<DeviceInfoEx> DeviceInfoEx { get; set; }

        public virtual DbSet<FeeConcession> FeeConcession { get; set; }
        public virtual DbSet<FeeConcessionDetail> FeeConcessionDetail { get; set; }
        public virtual DbSet<FeeConcessionDetailVM> FeeConcessionDetailVM { get; set; }
        public virtual DbSet<GetStudentsVM> GetStudentsVM { get; set; }
        public virtual DbSet<FeeContinuationPolicy> FeeContinuationPolicy { get; set; }
        public virtual DbSet<FeeFeeActivity> FeeFeeActivity { get; set; }
        public virtual DbSet<FeeFeeHead> FeeFeeHead { get; set; }
        public virtual DbSet<FeeFeeStructure> FeeFeeStructure { get; set; }
        public virtual DbSet<FeeFeeStructureDetail> FeeFeeStructureDetail { get; set; }

        public virtual DbSet<FeeFeeStructureDetailVM> FeeFeeStructureDetailVM { get; set; }
        public virtual DbSet<FeeScholarshipCriteria> FeeScholarshipCriteria { get; set; }
        public virtual DbSet<FeeStudentChallan> FeeStudentChallan { get; set; }
        public virtual DbSet<VW_AdhocStudentChallan> VW_AdhocStudentChallan { get; set; }

                public virtual DbSet<VW_ReversalStudentChallan> VW_ReversalStudentChallan { get; set; }


        public virtual DbSet<FeeStudentChallans> FeeStudentChallans { get; set; }
        public virtual DbSet<ProgramListHadaf> ProgramListHadaf { get; set; }



        public virtual DbSet<StudentPaidCountData> StudentPaidCountData { get; set; }

        public virtual DbSet<StudentChallanEx> StudentChallanEx { get; set; }

        public virtual DbSet<ProgramListVM2> ProgramListVM2 { get; set; }
        public virtual DbSet<OnlineAdmissionResponseEx> OnlineAdmissionResponseEx { get; set; }
        public virtual DbSet<AttendanceNotificationEx> AttendanceNotificationEx { get; set; }
        public virtual DbSet<StudentFeePaid> StudentFeePaid { get; set; }
        public virtual DbSet<RefferenceNoResp> RefferenceNoResp { get; set; }
        // public virtual DbSet<LoginAdmResponseEx> LoginAdmResponseEx { get; set; }

        public virtual DbSet<MessageDetailStud> MessageDetailStud { get; set; }

        public virtual DbSet<RegistrationCourseVM> RegistrationCourseVM { get; set; }






        public virtual DbSet<FeeStudentFeeStructure> FeeStudentFeeStructure { get; set; }
        public virtual DbSet<HumanResourceDepartments> HumanResourceDepartments { get; set; }
        public virtual DbSet<HumanResourceDepartmentsVM> HumanResourceDepartmentsVM { get; set; }

        public virtual DbSet<HumanResourceDesignations> HumanResourceDesignations { get; set; }
        public virtual DbSet<HumanResourceStaff> HumanResourceStaff { get; set; }

        public virtual DbSet<StaffCourse> StaffCourse { get; set; }
        public virtual DbSet<StaffCourseVM> StaffCourseVM { get; set; }
        public virtual DbSet<StaffCourseDeptVM> StaffCourseDeptVM { get; set; }

        public virtual DbSet<EvaluationMaster> EvaluationMaster { get; set; }
        public virtual DbSet<EvaluationDetail> EvaluationDetail { get; set; }

        public virtual DbSet<AttendanceReportStatusEl> AttendanceReportStatusEl { get; set; }


        public virtual DbSet<RegistrationCourse> RegistrationCourse { get; set; }
        public virtual DbSet<EmailProgramLink> EmailProgramLink { get; set; }

        public virtual DbSet<RegistrationEnrollments> RegistrationEnrollments { get; set; }
        public virtual DbSet<RegistrationProgramCourseLink> RegistrationProgramCourseLink { get; set; }
        public virtual DbSet<RegistrationSectionCourseLink> RegistrationSectionCourseLink { get; set; }
        public virtual DbSet<SectionCampusVM> SectionCampusVM { get; set; }
        public virtual DbSet<SectionRightLink> SectionRightLink { get; set; }
        public virtual DbSet<MaskRightLink> MaskRightLink { get; set; }
        public virtual DbSet<ArvoCourses> ArvoCourses { get; set; }
        public virtual DbSet<ArvoReferenceSubject> ArvoReferenceSubject { get; set; }




        public virtual DbSet<HolidaysVM> HolidaysVM { get; set; }
        public virtual DbSet<Holidays> Holidays { get; set; }
        public virtual DbSet<RegistrationSectionCourseLinkVMEx> RegistrationSectionCourseLinkVMEx { get; set; }


        public virtual DbSet<RegistrationSectionCourseLink2> RegistrationSectionCourseLink2 { get; set; }

        public virtual DbSet<SetupSectionCourseLink2> SetupSectionCourseLink2 { get; set; }
        public virtual DbSet<RegistrationSectionCourseLinkVM> RegistrationSectionCourseLinkVM { get; set; }

        public virtual DbSet<SectionCourseLinkVMForAssessment> SectionCourseLinkVMForAssessment { get; set; }

        public virtual DbSet<RegistrationSectionCourseLinkVMModel> RegistrationSectionCourseLinkVMModel { get; set; }
        public virtual DbSet<RegistrationSections> RegistrationSections { get; set; }
        public virtual DbSet<SetupAddress> SetupAddress { get; set; }
        public virtual DbSet<SetupFranchise> SetupFranchise { get; set; }
        public virtual DbSet<SetupAdmissionType> SetupAdmissionType { get; set; }
        public virtual DbSet<SetupBloodGroup> SetupBloodGroup { get; set; }
        public virtual DbSet<SetupBoard> SetupBoard { get; set; }
        public virtual DbSet<SetupBoardType> SetupBoardType { get; set; }
        public virtual DbSet<SetupBuilding> SetupBuilding { get; set; }
        public virtual DbSet<SetupBuildingAddressLink> SetupBuildingAddressLink { get; set; }
        public virtual DbSet<SetupBusinessGroup> SetupBusinessGroup { get; set; }
        public virtual DbSet<SetupBusinessUnit> SetupBusinessUnit { get; set; }
        public virtual DbSet<SetupCampus> SetupCampus { get; set; }
        public virtual DbSet<AdmissionReportsdet> AdmissionReportsdet { get; set; }
        public virtual DbSet<ChQuery> ChQuery { get; set; }

        public virtual DbSet<FormReport> FormReport { get; set; }
        public virtual DbSet<FeeDefaultEx> FeeDefaultEx { get; set; }
        public virtual DbSet<DuplicateAdmission> DuplicateAdmission { get; set; }
        public virtual DbSet<ExaminationRemarks> ExaminationRemarks { get; set; }
        public virtual DbSet<ElMigrationVM> ElMigrationVM { get; set; }
        public virtual DbSet<KinshipStudent> KinshipStudent { get; set; }
        public virtual DbSet<KinshipConcession> KinshipConcession { get; set; }
        public virtual DbSet<OnlineApprovalStudent> OnlineApprovalStudent { get; set; }

        public virtual DbSet<OnlineProcessFee> OnlineProcessFee { get; set; }
        public virtual DbSet<OnlineProgramInfo> OnlineProgramInfo { get; set; }


        public virtual DbSet<GetResult> GetResult { get; set; }
        public virtual DbSet<StudentResultModel> StudentResultModel { get; set; }

        public virtual DbSet<Teacherexistmodel> Teacherexistmodel { get; set; }
        public virtual DbSet<EnrolledStudentResultModel> EnrolledStudentResultModel { get; set; }

        public virtual DbSet<PreDashoboard> PreDashoboard { get; set; }
        public virtual DbSet<ChallanResp> ChallanResp { get; set; }
        public virtual DbSet<BankIbanVM> BankIbanVM { get; set; }
        public virtual DbSet<ClassNote> ClassNote { get; set; }
        public virtual DbSet<AdmissionWithdrawl> AdmissionWithdrawl { get; set; }

        public virtual DbSet<VWSessionDuration> VWSessionDuration { get; set; }
        public virtual DbSet<SessionDuration> SessionDuration { get; set; }
        public virtual DbSet<MessageDelivery> MessageDelivery { get; set; }


        public virtual DbSet<AdmissionMatricMarks> AdmissionMatricMarks { get; set; }
        public virtual DbSet<AdmissionMatricPerc> AdmissionMatricPerc { get; set; }
        public virtual DbSet<SetupCampusBuildingLink> SetupCampusBuildingLink { get; set; }
        public virtual DbSet<SetupDegree> SetupDegree { get; set; }
        public virtual DbSet<SetupGroup> SetupGroup { get; set; }
        public virtual DbSet<SetupPassStatus> SetupPassStatus { get; set; }
        public virtual DbSet<SetupCampusBuildingLinkVM> SetupCampusBuildingLinkVM { get; set; }
        public virtual DbSet<SetupCampusBuildingLinkVMEx> SetupCampusBuildingLinkVMEx { get; set; }

        public virtual DbSet<SetupCampusProgramLink> SetupCampusProgramLink { get; set; }
        public virtual DbSet<CampusProgramZoneVM> CampusProgramZoneVM { get; set; }

        public virtual DbSet<SetupCity> SetupCity { get; set; }
        public virtual DbSet<SetupCityPossession> SetupCityPossession { get; set; }
        public virtual DbSet<SetupClass> SetupClass { get; set; }
        public virtual DbSet<SetupCollector> SetupCollector { get; set; }
        public virtual DbSet<SetupCountry> SetupCountry { get; set; }
        public virtual DbSet<SetupGender> SetupGender { get; set; }
        public virtual DbSet<SetupInstitution> SetupInstitution { get; set; }
        public virtual DbSet<SetupInstitutionType> SetupInstitutionType { get; set; }
        public virtual DbSet<SetupMedium> SetupMedium { get; set; }
        public virtual DbSet<SetupConcessoinRemarks> SetupConcessoinRemarks { get; set; }
        public virtual DbSet<VWConcessionRemarksVM> VWConcessionRemarksVM { get; set; }
        public virtual DbSet<SetupMonth> SetupMonth { get; set; }
        public virtual DbSet<SetupNationality> SetupNationality { get; set; }
        public virtual DbSet<SetupPossession> SetupPossession { get; set; }
        public virtual DbSet<SetupPossessionType> SetupPossessionType { get; set; }
        public virtual DbSet<SetupPossessionVM> SetupPossessionVM { get; set; }
        public virtual DbSet<SetupProgram> SetupProgram { get; set; }
        public virtual DbSet<SetupProgramDetails> SetupProgramDetails { get; set; }
        public virtual DbSet<VWCampusBaseProgram> VWCampusBaseProgram { get; set; }
        public virtual DbSet<SetupProvince> SetupProvince { get; set; }
        public virtual DbSet<SetupReligion> SetupReligion { get; set; }
        public virtual DbSet<SetupRoom> SetupRoom { get; set; }
        public virtual DbSet<SetupRoomBuildingLink> SetupRoomBuildingLink { get; set; }
        public virtual DbSet<SetupRoomType> SetupRoomType { get; set; }
        public virtual DbSet<SetupSection> SetupSection { get; set; }


        public virtual DbSet<SectionListData> SectionListData { get; set; }

        public virtual DbSet<SetupSession> SetupSession { get; set; }
        public virtual DbSet<SetupShift> SetupShift { get; set; }
        public virtual DbSet<SetupStatus> SetupStatus { get; set; }
        public virtual DbSet<SetupSubCity> SetupSubCity { get; set; }
        public virtual DbSet<SetupCitySubCityLink> SetupCitySubCityLink { get; set; }
        public virtual DbSet<AcademicMarks> AcademicMarks { get; set; }
        public virtual DbSet<SetupTerm> SetupTerm { get; set; }
        public virtual DbSet<SetupZone> SetupZone { get; set; }
        public virtual DbSet<SetupZoneCityLink> SetupZoneCityLink { get; set; }
        public virtual DbSet<TimeTableSlots> TimeTableSlots { get; set; }
        public virtual DbSet<CampusProgramData> CampusProgramData { get; set; }

        public virtual DbSet<VWDashBoardVM> VWDashBoardVM { get; set; }
        public virtual DbSet<StudentFeeCountVM> StudentFeeCountVM { get; set; }
        public virtual DbSet<AdmissionSessionWiseDataEx> AdmissionSessionWiseDataEx { get; set; }
        public virtual DbSet<AdmissionSessionWiseDataEx2> AdmissionSessionWiseDataEx2 { get; set; }
        public virtual DbSet<AdmissionSessionWiseDataExx2> AdmissionSessionWiseDataExx2 { get; set; }


        public virtual DbSet<TimeTableSlotsVM> TimeTableSlotsVM { get; set; }
        public virtual DbSet<VWDashBoardVMA> VWDashBoardVMA { get; set; }
        public virtual DbSet<AdmissionFormCpl4VM> AdmissionFormCpl4VM { get; set; }

        public virtual DbSet<AttendenceMonthWise> AttendenceMonthWise { get; set; }
        public virtual DbSet<AttendencePercentages> AttendencePercentages { get; set; }


        public virtual DbSet<TimeTableSlotTimings> TimeTableSlotTimings { get; set; }
        public virtual DbSet<TimeTableVWSlotTimings> TimeTableVWSlotTimings { get; set; }
        public virtual DbSet<TimeTableTimeTable> TimeTableTimeTable { get; set; }


        public virtual DbSet<TimeTableTimeTableVMEX3> TimeTableTimeTableVMEX3 { get; set; }
        public virtual DbSet<AttendenceDataDayoff> AttendenceDataDayoff { get; set; }
        public virtual DbSet<AttendanceCourseResponseModel> AttendanceCourseResponseModel { get; set; }


        public virtual DbSet<TimeTableTimeTableVM> TimeTableTimeTableVM { get; set; }
        public virtual DbSet<TimeTableVWTimeTableMerge> TimeTableVWTimeTableMerge { get; set; }

        public virtual DbSet<TimeTableTimeTableVMEx> TimeTableTimeTableVMEx { get; set; }
        public virtual DbSet<TimeTableTimeTableTeacher> TimeTableTimeTableTeacher { get; set; }
        public virtual DbSet<TimeTableTimeTableCourseVM> TimeTableTimeTableCourseVM { get; set; }



        public virtual DbSet<TimeTableTimeTableDayClose> TimeTableTimeTableDayClose { get; set; }

        public virtual DbSet<DayOff> DayOff { get; set; }
        public virtual DbSet<DayOffVM> DayOffVM { get; set; }

        public virtual DbSet<SetupCampusProgramVM> SetupCampusProgramVM { get; set; }
        public virtual DbSet<LevelProgamDetailsVM> LevelProgamDetailsVM { get; set; }
        public virtual DbSet<VWClassLevel> VWClassLevel { get; set; }


        public virtual DbSet<SetupZoneCityLinkVM> SetupZoneCityLinkVM { get; set; }

        public virtual DbSet<SetupProvinceVM> SetupProvinceVM { get; set; }
        public virtual DbSet<StudentToSend> StudentToSend { get; set; }

        public virtual DbSet<SetupBuildingAddressLinkVM> SetupBuildingAddressLinkVM { get; set; }

        public virtual DbSet<SetupBuildingAddressPossessionVM> SetupBuildingAddressPossessionVM { get; set; }

        public virtual DbSet<SetupTermSessionVM> SetupTermSessionVM { get; set; }

        public virtual DbSet<SetupRoomTypeBuildingVM> SetupRoomTypeBuildingVM { get; set; }
        public virtual DbSet<SetupCampusProgramLinkVM> SetupCampusProgramLinkVM { get; set; }
        public virtual DbSet<SetupInstitutionVM> SetupInstitutionVM { get; set; }
        public virtual DbSet<DisableChallans> DisableChallans { get; set; }
        public virtual DbSet<FinanceData> FinanceData { get; set; }

        public virtual DbSet<APIStudentProfileResponseReff> APIStudentProfileResponseReff { get; set; }


        public virtual DbSet<SetupProgramDetailsVM> SetupProgramDetailsVM { get; set; }
        public virtual DbSet<FeeCampusBankVM> FeeCampusBankVM { get; set; }
        public virtual DbSet<CampusBank> CampusBank { get; set; }
        public virtual DbSet<CampusChallanValidityVM> CampusChallanValidityVM { get; set; }
        public virtual DbSet<APIStudentProfileResponse> APIStudentProfileResponse { get; set; }
        public virtual DbSet<StudentProfileMarchantile> StudentProfileMarchantile { get; set; }
        public virtual DbSet<APIStudentProfileResponseNew> APIStudentProfileResponseNew { get; set; }
        public virtual DbSet<APIStudentProfileResponseNewEx> APIStudentProfileResponseNewEx { get; set; }




        public virtual DbSet<APIStudentProfileResponseEx> APIStudentProfileResponseEx { get; set; }


        public virtual DbSet<FeeScholarshipCriteriaVM> FeeScholarshipCriteriaVM { get; set; }
        public virtual DbSet<FeeConcessionVM> FeeConcessionVM { get; set; }
        public virtual DbSet<MarksData> MarksData { get; set; }
        public virtual DbSet<OnlineAdmissionVM> OnlineAdmissionVM { get; set; }

        public virtual DbSet<AdmissionEligibilityCriteriaVM> AdmissionEligibilityCriteriaVM { get; set; }
        public virtual DbSet<AttendenceData> AttendenceData { get; set; }
        public virtual DbSet<AttendenceDataTeacher> AttendenceDataTeacher { get; set; }
        public virtual DbSet<AttendanceApprovalDataVM> AttendanceApprovalDataVM { get; set; }

        public virtual DbSet<MinimumLeavePolicy> MinimumLeavePolicy { get; set; }
        public virtual DbSet<StudentOfSection> StudentOfSection { get; set; }
        public virtual DbSet<AttendanceApprovalDataExVM> AttendanceApprovalDataExVM { get; set; }
        public virtual DbSet<AttendanceApprovalExNotificationVM> AttendanceApprovalExNotificationVM { get; set; }

        public virtual DbSet<MinimumPaidDate> MinimumPaidDate { get; set; }
        public virtual DbSet<AttendanceAttendanceReport> AttendanceAttendanceReport { get; set; }
        public virtual DbSet<AttendanceAttendanceStudentInfo> AttendanceAttendanceStudentInfo { get; set; }
        public virtual DbSet<AttendanceReportStatus> AttendanceReportStatus { get; set; }

        public virtual DbSet<AttendanceReportResult2> AttendanceReportResult2 { get; set; }
        public virtual DbSet<AttendanceReportResult> AttendanceReportResult { get; set; }
        public virtual DbSet<AttendanceReportStatusSubjectWise> AttendanceReportStatusSubjectWise { get; set; }



        public virtual DbSet<AttendanceRegister> AttendanceRegister { get; set; }
        public virtual DbSet<AttendanceAttendanceReportVM> AttendanceAttendanceReportVM { get; set; }
        public virtual DbSet<AttendanceAttendanceSubWise> AttendanceAttendanceSubWise { get; set; }
        public virtual DbSet<AttendanceAttendanceSummary2> AttendanceAttendanceSummary2 { get; set; }
        public virtual DbSet<AttendanceAttendanceSummary> AttendanceAttendanceSummary { get; set; }
        public virtual DbSet<AttendanceAttendanceIndividSummary> AttendanceAttendanceIndividSummary { get; set; }
        public virtual DbSet<AttendanceAttendanceIndividSummaryEx> AttendanceAttendanceIndividSummaryEx { get; set; }
        public virtual DbSet<AttendanceAttendanceSummaryII> AttendanceAttendanceSummaryII { get; set; }
        public virtual DbSet<AttendanceReportResponseModelVM> AttendanceReportResponseModelVM { get; set; }
        public virtual DbSet<ChallanList> ChallanList { get; set; }
        public virtual DbSet<ChallanListEx> ChallanListEx { get; set; }

        public virtual DbSet<MinimumPaidDateVM> MinimumPaidDateVM { get; set; }

        public virtual DbSet<StudentUserLink> StudentUserLink { get; set; }
        public virtual DbSet<UserApp> UserApp { get; set; }
        public virtual DbSet<UserLink> UserLink { get; set; }
        public virtual DbSet<GetUserId> GetUserId { get; set; }
        public virtual DbSet<BoardInfoVM> BoardInfoVM { get; set; }
        public virtual DbSet<BoardProgramCampus> BoardProgramCampus { get; set; }
        public virtual DbSet<VWProgramCampus> VWProgramCampus { get; set; }
        public virtual DbSet<StudentInfoMain> StudentInfoMain { get; set; }
        public virtual DbSet<VWDateSheetDetail> VWDateSheetDetail { get; set; }
        public virtual DbSet<GetExamComparisonResponse> GetExamComparisonResponse { get; set; }

        public virtual DbSet<StruckoffReinstate> StruckoffReinstate { get; set; }
        public virtual DbSet<TeacherDataResponse> TeacherDataResponse { get; set; }
        public virtual DbSet<TeacherDataResponseCI> TeacherDataResponseCI { get; set; }
        public virtual DbSet<CoursewiseStudentAttendanceData> CoursewiseStudentAttendanceData { get; set; }
        public virtual DbSet<StudentAttendanceDataoverall> StudentAttendanceDataoverall { get; set; }
        public virtual DbSet<StudentExamDataSubjectWise> StudentExamDataSubjectWise { get; set; }
        public virtual DbSet<StudentExamDataSubjectWise2> StudentExamDataSubjectWise2 { get; set; }

        public virtual DbSet<StudentFinanceReport> StudentFinanceReport { get; set; }
        public virtual DbSet<StudentFinanceDataLatest> StudentFinanceDataLatest { get; set; }

        public virtual DbSet<StudentFinanceData> StudentFinanceData { get; set; }
        public virtual DbSet<CityFinanceData> CityFinanceData { get; set; }
        public virtual DbSet<CityWiseFinanceData> CityWiseFinanceData { get; set; }
        public virtual DbSet<CampusWiseDifferenceResult> CampusWiseDifferenceResult { get; set; }


        public virtual DbSet<BusniessUnitFinanceData> BusniessUnitFinanceData { get; set; }
        public virtual DbSet<CitywiseConsolidatedData> CitywiseConsolidatedData { get; set; }

        public virtual DbSet<BankCitywiseConsolidatedData> BankCitywiseConsolidatedData { get; set; }



        public virtual DbSet<CampusWiseFinanceDataList> CampusWiseFinanceDataList { get; set; }

        public virtual DbSet<CampusFinanceData> CampusFinanceData { get; set; }
        public virtual DbSet<ProgramFinanceData> ProgramFinanceData { get; set; }
        public virtual DbSet<ProgramFinanceDataLatest> ProgramFinanceDataLatest { get; set; }
        public virtual DbSet<ProgramWiseConcessionReportModel> ProgramWiseConcessionReportModel { get; set; }



        public virtual DbSet<StudentExamDataCourseWise> StudentExamDataCourseWise { get; set; }
        public virtual DbSet<StudentExamDataOverall> StudentExamDataOverall { get; set; }

        public virtual DbSet<OnlineAdmissionResponsestep> OnlineAdmissionResponsestep { get; set; }
        public virtual DbSet<ResponseTable> ResponseTable { get; set; }
        public virtual DbSet<TeacherExamDataResponse> TeacherExamDataResponse { get; set; }
        public virtual DbSet<TeacherExamDataResponseEx> TeacherExamDataResponseEx { get; set; }
        public virtual DbSet<TeacherExamDataResponseHod> TeacherExamDataResponseHod { get; set; }

        public virtual DbSet<TeacherExamDataResponseEx1> TeacherExamDataResponseEx1 { get; set; }
        public virtual DbSet<TeacherExamDataResponseHodEx> TeacherExamDataResponseHodEx { get; set; }
        public virtual DbSet<GetTeacherCourses> GetTeacherCourses { get; set; }
        public virtual DbSet<TeacherExamDataResponseEx2> TeacherExamDataResponseEx2 { get; set; }

        public virtual DbSet<TeacherExamDataResponseEx3> TeacherExamDataResponseEx3 { get; set; }




        public virtual DbSet<TeacherStudentExaminfoaModel> TeacherStudentExaminfoaModel { get; set; }
        public virtual DbSet<TeacherStudentExaminfoResponse> TeacherStudentExaminfoResponse { get; set; }

        public virtual DbSet<HodStudentExaminfoResponse> HodStudentExaminfoResponse { get; set; }
        public virtual DbSet<HodStudentExaminfoResponseEx> HodStudentExaminfoResponseEx { get; set; }


        public virtual DbSet<TeacherStudentinfoResponse> TeacherStudentinfoResponse { get; set; }

        public virtual DbSet<AdmissionFormPromtedFrom> AdmissionFormPromtedFrom { get; set; }


        public virtual DbSet<CourseSection> CourseSection { get; set; }
        public virtual DbSet<ExamCourseVM> ExamCourseVM { get; set; }
        public virtual DbSet<SubjectExamReport> SubjectExamReport { get; set; }
        public virtual DbSet<SubjectExamReportEx2> SubjectExamReportEx2 { get; set; }

        public virtual DbSet<GetFullFeeStudentDetail> GetFullFeeStudentDetail { get; set; }

        public virtual DbSet<SubjectExamAttenReport> SubjectExamAttenReport { get; set; }

        public virtual DbSet<ExamDataVM> ExamDataVM { get; set; }
        public virtual DbSet<ExamBulkVM> ExamBulkVM { get; set; }
        public virtual DbSet<ExamBulkVM1> ExamBulkVM1 { get; set; }
        public virtual DbSet<ExamBulkUpdateVM> ExamBulkUpdateVM { get; set; }

        public virtual DbSet<ExamApproval> ExamApproval { get; set; }
        public virtual DbSet<ExamScheduleName> ExamScheduleName { get; set; }
        public virtual DbSet<ExamScheduleNameEx> ExamScheduleNameEx { get; set; }


        public virtual DbSet<ExamResultApproval> ExamResultApproval { get; set; }

        public virtual DbSet<GradingMasterDetailData> GradingMasterDetailData { get; set; }
        public virtual DbSet<ExaminationCampusGradingMappingVM> ExaminationCampusGradingMappingVM { get; set; }

        public virtual DbSet<FeeCampusChallanNoteLinkVM> FeeCampusChallanNoteLinkVM { get; set; }

        public virtual DbSet<AdmissionUserVM> AdmissionUserVM { get; set; }
        public virtual DbSet<BoardExamType> BoardExamType { get; set; }
        public virtual DbSet<BoardStudentBoardLink> BoardStudentBoardLink { get; set; }
        public virtual DbSet<StudentToEnrollVM> StudentToEnrollVM { get; set; }
        public virtual DbSet<StudentsToEnrolledPercentageVM> StudentsToEnrolledPercentageVM { get; set; }

        public virtual DbSet<ToEnrollWithoutPaidVM> ToEnrollWithoutPaidVM { get; set; }
        public virtual DbSet<OnlineAdmissionUpdData> OnlineAdmissionUpdData { get; set; }
        public virtual DbSet<MessageApproval> MessageApproval { get; set; }
        public virtual DbSet<MessageApprovalEx> MessageApprovalEx { get; set; }
        public virtual DbSet<MessageApprovalEx1> MessageApprovalEx1 { get; set; }
        public virtual DbSet<NotificationReport> NotificationReport { get; set; }
        public virtual DbSet<NotificationReportEx> NotificationReportEx { get; set; }
        public virtual DbSet<BulkNotificationModel> BulkNotificationModel { get; set; }
        public virtual DbSet<BulkNotificationModelEx> BulkNotificationModelEx { get; set; }

        public virtual DbSet<BulkNotificationList> BulkNotificationList { get; set; }

        public virtual DbSet<BulkNotificationModelExx> BulkNotificationModelExx { get; set; }

        public virtual DbSet<StudentAcademicAnalysisReportExm2> StudentAcademicAnalysisReportExm2 { get; set; }
        public virtual DbSet<StudentAcademicAnalysisReportExm3> StudentAcademicAnalysisReportExm3 { get; set; }
        public virtual DbSet<StudentAcademicAnalysisEx> StudentAcademicAnalysisEx { get; set; }
        public virtual DbSet<StudentAssessmentList> StudentAssessmentList { get; set; }
        public virtual DbSet<StudentAssessmentListEx> StudentAssessmentListEx { get; set; }




        //         public virtual DbSet<StudentFinanceReport> StudentFinanceReport { get; set; }
        // public virtual DbSet<StudentFinanceData> StudentFinanceData { get; set; }

        public virtual DbSet<StudentAcademicAnalysisReportExm2Sub> StudentAcademicAnalysisReportExm2Sub { get; set; }

        public virtual DbSet<StudentEnrolledVM> StudentEnrolledVM { get; set; }

        public virtual DbSet<StudentOfSectionEx> StudentOfSectionEx { get; set; }



        public virtual DbSet<IntModel> IntModel { get; set; }

        public virtual DbSet<StudentPromotionList> StudentPromotionList { get; set; }

        public virtual DbSet<ExamStudentResult> ExamStudentResult { get; set; }
        public virtual DbSet<ExamTypeAPIEx> ExamTypeAPIEx { get; set; }
        public virtual DbSet<ExamGazetteReport> ExamGazetteReport { get; set; }
        public virtual DbSet<ExamSectiontestwiseReport> ExamSectiontestwiseReport { get; set; }

        public virtual DbSet<StudentFeeDetailDescription> StudentFeeDetailDescription { get; set; }

        public virtual DbSet<TimeTableSlotTimingsVM> TimeTableSlotTimingsVM { get; set; }

        public virtual DbSet<RegistrationProgramCourseLinkVM> RegistrationProgramCourseLinkVM { get; set; }
        public virtual DbSet<AdmissionAdmissionFormVM> AdmissionAdmissionFormVM { get; set; }
        public virtual DbSet<GetAllProvincesVM> GetAllProvincesVM { get; set; }
        public virtual DbSet<GetReferenceNumberVM> GetReferenceNumberVM { get; set; }

        public virtual DbSet<GetAllCitiesprovine> GetAllCitiesprovine { get; set; }
        public virtual DbSet<GetAllProgramsVM> GetAllProgramsVM { get; set; }

        public virtual DbSet<responseoninsert> responseoninsert { get; set; }
        public virtual DbSet<studentModel> studentModel { get; set; }
        public virtual DbSet<studentModelEx> studentModelEx { get; set; }
        public virtual DbSet<ScholarshipStudentModel> ScholarshipStudentModel { get; set; }

        public virtual DbSet<AdmissionFormCplVM> AdmissionFormCplVM { get; set; }

        public virtual DbSet<AttendanceTeacherMonthSection> AttendanceTeacherMonthSection { get; set; }


        public virtual DbSet<TransferList> TransferList { get; set; }
        public virtual DbSet<AdmissionStatus> AdmissionStatus { get; set; }
        public virtual DbSet<AdmissionGenderDashboard> AdmissionGenderDashboard { get; set; }
        public virtual DbSet<AdmissionOnlineDashboard> AdmissionOnlineDashboard { get; set; }
        public virtual DbSet<VWCityDateEXCity> VWCityDateEXCity { get; set; }
        //public virtual DbSet<VWCityDateEXlevel> VWCityDateEXlevel { get; set; }
        public virtual DbSet<NotificationOutPut> NotificationOutPut { get; set; }
        public virtual DbSet<NotiObject> NotiObject { get; set; }
        public virtual DbSet<ChatOutPut> ChatOutPut { get; set; }
        public virtual DbSet<ChatOutPutWithTeacher> ChatOutPutWithTeacher { get; set; }

        public virtual DbSet<ChatOutPutEx> ChatOutPutEx { get; set; }

        public virtual DbSet<ChatOutPutCourse> ChatOutPutCourse { get; set; }
        public virtual DbSet<AcademicSectionMapVW> AcademicSectionMapVW { get; set; }
        public virtual DbSet<AcademicSectionMap> AcademicSectionMap { get; set; }



        public virtual DbSet<RegistrationSectionCourseLinkList> RegistrationSectionCourseLinkList { get; set; }
        public virtual DbSet<VWAdmissionFormCpl3> VWAdmissionFormCpl3 { get; set; }
        public virtual DbSet<VWStudentsProfile> VWStudentsProfile { get; set; }

        public virtual DbSet<SurveyMaster> SurveyMaster { get; set; }

        public virtual DbSet<AttendenceStudentInfoEx> AttendenceStudentInfoEx { get; set; }
        public virtual DbSet<VWStudentsProfileEx> VWStudentsProfileEx { get; set; }
        public virtual DbSet<StudentsProfileCon> StudentsProfileCon { get; set; }

        public virtual DbSet<VWStudentFeeProfile> VWStudentFeeProfile { get; set; }

        public virtual DbSet<VWStudentSectionProfile> VWStudentSectionProfile { get; set; }
        public virtual DbSet<VWStudentSectionProfile2> VWStudentSectionProfile2 { get; set; }



        public virtual DbSet<AdmissionStudentsImageVM> AdmissionStudentsImageVM { get; set; }
        public virtual DbSet<AttendanceAttendenceMasterVM> AttendanceAttendenceMasterVM { get; set; }

        public virtual DbSet<AttendanceAttendanceDetailVM> AttendanceAttendanceDetailVM { get; set; }
        public virtual DbSet<AttendanceResponseModel_CMS> AttendanceResponseModel_CMS { get; set; }

        public virtual DbSet<StudentChallanINfoData> StudentChallanINfoData { get; set; }
        public virtual DbSet<StudentChallanINfoData2> StudentChallanINfoData2 { get; set; }
        public virtual DbSet<StudentChallanINfoData2New> StudentChallanINfoData2New { get; set; }



        public virtual DbSet<feeStructureinsertion> feeStructureinsertion { get; set; }
        public virtual DbSet<FeeStructureVM> FeeStructureVM { get; set; }
        public virtual DbSet<FeeStructureVMEx> FeeStructureVMEx { get; set; }

        public virtual DbSet<ELChapters> ELChapters { get; set; }
        public virtual DbSet<UserMcqResponse> UserMcqResponse { get; set; }
        public virtual DbSet<McqAttempted> McqAttempted { get; set; }
        public virtual DbSet<SurveyDetail> SurveyDetail { get; set; }


        public virtual DbSet<BoardProgramClassCourseLink> BoardProgramClassCourseLink { get; set; }
        public virtual DbSet<BoardProgramClassCourseVM> BoardProgramClassCourseVM { get; set; }

        public virtual DbSet<ELModelPapers> ELModelPapers { get; set; }
        public virtual DbSet<ELModelPapersQuestions> ELModelPapersQuestions { get; set; }
        public virtual DbSet<ELQuestions> ELQuestions { get; set; }

        public virtual DbSet<SurveyDetailVM> SurveyDetailVM { get; set; }
        public virtual DbSet<ChapterLinks> ChapterLinks { get; set; }
        public virtual DbSet<ChapterLinksVM> ChapterLinksVM { get; set; }

        public virtual DbSet<ELTopics> ELTopics { get; set; }
        public virtual DbSet<ELTopicLink> ELTopicLink { get; set; }
        public virtual DbSet<ELTopicsVM> ELTopicsVM { get; set; }

        public virtual DbSet<MapCMSVideoData> MapCMSVideoData { get; set; }
        public virtual DbSet<StudentCourseList> StudentCourseList { get; set; }
        public virtual DbSet<GetBoardList> GetBoardList { get; set; }



        public virtual DbSet<ZoneCityVM> ZoneCityVM { get; set; }
        public virtual DbSet<ExamTypeWiseReport> ExamTypeWiseReport { get; set; }
        public virtual DbSet<MCQsAnswers> MCQsAnswers { get; set; }
        public virtual DbSet<MCQsQuestion> MCQsQuestion { get; set; }
        public virtual DbSet<Boards> Boards { get; set; }
        public virtual DbSet<TopicVideoChapterLink> TopicVideoChapterLink { get; set; }
        public virtual DbSet<Videos> Videos { get; set; }


        public virtual DbSet<ProfileStaff> ProfileStaff { get; set; }

        public virtual DbSet<FeeStudentChallanVM> FeeStudentChallanVM { get; set; }
        public virtual DbSet<ConcessionVM> ConcessionVM { get; set; }
        public virtual DbSet<RefundChallanofStudent> RefundChallanofStudent { get; set; }
        public virtual DbSet<AllalreadyRefundChallan> AllalreadyRefundChallan { get; set; }
        public virtual DbSet<ReversalChalln> ReversalChalln { get; set; }


        public virtual DbSet<FeeStudentFeeStructureVM> FeeStudentFeeStructureVM { get; set; }
        public virtual DbSet<StudentRevenuePaidExx2> StudentRevenuePaidExx2 { get; set; }
        public virtual DbSet<StudentRevenuePaidExxxy> StudentRevenuePaidExxxy { get; set; }

        public virtual DbSet<StudentRevenuePaidEx2> StudentRevenuePaidEx2 { get; set; }
        public virtual DbSet<TeacherAttendancereport> TeacherAttendancereport { get; set; }



        public virtual DbSet<TeacherstudentAttDataResponse> TeacherstudentAttDataResponse { get; set; }
        public virtual DbSet<TeacherstudentAttDataMonthResponse> TeacherstudentAttDataMonthResponse { get; set; }



        public virtual DbSet<StudentFeeExist> StudentFeeExist { get; set; }
        public virtual DbSet<StudentChallanInfoExx> StudentChallanInfoExx { get; set; }


        public virtual DbSet<OnlineAdmissionResponse> OnlineAdmissionResponse { get; set; }

        public virtual DbSet<StudentRecordVM> StudentRecordVM { get; set; }

        public virtual DbSet<FeeTBLGrades> TBLGrades { get; set; }
        public virtual DbSet<CampusCityVM> CampusCityVM { get; set; }
        public virtual DbSet<VWHadafSMSCampus> VWHadafSMSCampus { get; set; }

        public virtual DbSet<CampusCityData> CampusCityData { get; set; }
        public virtual DbSet<CampusCityVMEx> CampusCityVMEx { get; set; }
        public virtual DbSet<CampusCityVMExHadaf> CampusCityVMExHadaf { get; set; }
        public virtual DbSet<CampusCityVMExGenderWise> CampusCityVMExGenderWise { get; set; }
        public virtual DbSet<CampusCityVMExGenderWiseHadaf> CampusCityVMExGenderWiseHadaf { get; set; }

        public virtual DbSet<AdmissionConcession> AdmissionConcession { get; set; }
        public virtual DbSet<GetStatus> GetStatus { get; set; }

        public virtual DbSet<CitySubCity2> CitySubCity2 { get; set; }

        public virtual DbSet<CitySubCity> CitySubCity { get; set; }
        public virtual DbSet<GetCityOnlineAdmissionPortal> GetCityOnlineAdmissionPortal { get; set; }


        public virtual DbSet<CityHadaf> CityHadaf { get; set; }
        public virtual DbSet<GetCityOnlineAdmissionPortalHadaf> GetCityOnlineAdmissionPortalHadaf { get; set; }


        public virtual DbSet<StudentReportData> StudentReportData { get; set; }
        public virtual DbSet<StudentChallanReport> StudentChallanReport { get; set; }
        public virtual DbSet<StudentChallanReportEx> StudentChallanReportEx { get; set; }
        public virtual DbSet<StudentChallanReportFu> StudentChallanReportFu { get; set; }
        public virtual DbSet<StudentChallanReportFuLatest> StudentChallanReportFuLatest { get; set; }

        public virtual DbSet<SetupBatch> SetupBatch { get; set; }


        public virtual DbSet<TransportChallanReport> TransportChallanReport { get; set; }
        public virtual DbSet<PreviousAcademicRecord> PreviousAcademicRecord { get; set; }
        public virtual DbSet<ProgramCourseList> ProgramCourseList { get; set; }

        public virtual DbSet<AdmissionReports> AdmissionReports { get; set; }
        public virtual DbSet<AdmissionReportsVM> AdmissionReportsVM { get; set; }

        public virtual DbSet<ExamresultResponse> ExamresultResponse { get; set; }
        public virtual DbSet<StudentPortalExamType> StudentPortalExamType { get; set; }
        public virtual DbSet<StudentPortalExamTypeAll> StudentPortalExamTypeAll { get; set; }
        public virtual DbSet<StudentPortalGetAllExamsResult> StudentPortalGetAllExamsResult { get; set; }

        public virtual DbSet<TimeTableReport> TimeTableReports { get; set; }
        public virtual DbSet<AdmissionReportsEnrolled> AdmissionReportsEnrolled { get; set; }

        public virtual DbSet<EnrolledReports> EnrolledReports { get; set; }

        public virtual DbSet<EnrolledReportsCont> EnrolledReportsCont { get; set; }

        public virtual DbSet<StudentPromotionPreList> StudentPromotionPreList { get; set; }

        public virtual DbSet<EnrolledReportsContEx> EnrolledReportsContEx { get; set; }
        public virtual DbSet<EnrolledReportsWithoutAdd> EnrolledReportsWithoutAdd { get; set; }
        public virtual DbSet<ExaminationReports> ExaminationReports { get; set; }
        public virtual DbSet<ExamIndividualSummary> ExamIndividualSummary { get; set; }
        public virtual DbSet<ExamIndividualSummaryEx> ExamIndividualSummaryEx { get; set; }


        public virtual DbSet<ExaminationStruckOffSt> ExaminationStruckOffSt { get; set; }
        public virtual DbSet<ExamMonthlyReport> ExamMonthlyReport { get; set; }
        public virtual DbSet<TransportData> TransportData { get; set; }
        public virtual DbSet<TransportDefaulterReport> TransportDefaulterReport { get; set; }
        public virtual DbSet<GetTransportFeeDetailReport> GetTransportFeeDetailReport { get; set; }
        public virtual DbSet<EnrolledViewEx> EnrolledViewEx { get; set; }
        public virtual DbSet<HodEnrolledViewEx> HodEnrolledViewEx { get; set; }
        public virtual DbSet<HodGradePoint> HodGradePoint { get; set; }


        public virtual DbSet<VWGetExamMaster> VWGetExamMaster { get; set; }
        public virtual DbSet<StudentUsernamePassword> StudentUsernamePassword { get; set; }

        public virtual DbSet<FeeReports> FeeReports { get; set; }

        // public virtual DbSet<ChQuery> ChQuery { get; set; }
        public virtual DbSet<FeeReportsData> FeeReportsData { get; set; }
        public virtual DbSet<ScholarshipReport> ScholarshipReport { get; set; }
        public virtual DbSet<FeeConcessCountReport> FeeConcessCountReport { get; set; }
        public virtual DbSet<FeeStepCountReport> FeeStepCountReport { get; set; }
        public virtual DbSet<FeeDefaulterReport> FeeDefaulterReport { get; set; }
        public virtual DbSet<FeeDefaulterReportnew> FeeDefaulterReportnew { get; set; }

        public virtual DbSet<VWFeeStatement> VWFeeStatement { get; set; }
        public virtual DbSet<TimeTableStudentVM> TimeTableStudentVM { get; set; }
        public virtual DbSet<VWGetSubjectsEx> VWGetSubjectsEx { get; set; }

        public virtual DbSet<ExamSectionapi> ExamSectionapi { get; set; }
        public virtual DbSet<VWExamData> VWExamData { get; set; }
        // public virtual DbSet<VWAttendanceReportMobile> VWAttendanceReportMobile { get; set; }
        public virtual DbSet<StudentClassList> StudentClassList { get; set; }

        public virtual DbSet<ExamSectionapiEx> ExamSectionapiEx { get; set; }
        public virtual DbSet<VWSectionProgramLink> VWSectionProgramLink { get; set; }
        public virtual DbSet<VWExamMonths> VWExamMonths { get; set; }

        public virtual DbSet<FeeStatementEnrolledVM> FeeStatementEnrolledVM { get; set; }
        public virtual DbSet<FeeStatementExinstall> FeeStatementExinstall { get; set; }
        public virtual DbSet<Installemntexamption> Installemntexamption { get; set; }
        public virtual DbSet<UserRoleDashboardlink> UserRoleDashboardlink { get; set; }
        public virtual DbSet<TodoList> TodoList { get; set; }

        public virtual DbSet<RoleAssignedData> RoleAssignedData { get; set; }

        public virtual DbSet<FeeSubinstallmentVM> FeeSubinstallmentVM { get; set; }
        public virtual DbSet<FeeSubinstallmentVMs> FeeSubinstallmentVMs { get; set; }
        public virtual DbSet<TransportSubinstallmentVM> TransportSubinstallmentVM { get; set; }

        public virtual DbSet<Roles> Roles { get; set; }
        public virtual DbSet<RoleDashboardFilter> RoleDashboardFilter { get; set; }

        public virtual DbSet<RoleDashboard> RoleDashboard { get; set; }

        //RoleAssignedList
        public virtual DbSet<RoleAssignedList> RoleAssignedList { get; set; }

        public virtual DbSet<GetRoleUpdateData> GetRoleUpdateData { get; set; }
        public virtual DbSet<Result> Result { get; set; }

        public virtual DbSet<UserList> UserList { get; set; }
        public virtual DbSet<UserLog> UserLog { get; set; }
        public virtual DbSet<AdmissionStaticsWise> AdmissionStaticsWise { get; set; }


        public virtual DbSet<PrevilagesData> PrevilagesData { get; set; }
        public virtual DbSet<ChaptersTopicData> ChaptersTopicData { get; set; }

        public virtual DbSet<TransportationBusStopInfo> TransportationBusStopInfo { get; set; }
        public virtual DbSet<StudentAttendanceInfoResponseModel> StudentAttendanceInfoResponseModel { get; set; }
        public virtual DbSet<ReNewConcessionVM> ReNewConcessionVM { get; set; }
        public virtual DbSet<VW_ConcessionContinutionRules> VW_ConcessionContinutionRules { get; set; }

        public virtual DbSet<ReNewConcessionVMEx> ReNewConcessionVMEx { get; set; }

        public virtual DbSet<ScholarshipsVM> ScholarshipsVM { get; set; }
        public virtual DbSet<VWScholarshipsEX> VWScholarshipsEX { get; set; }

        public virtual DbSet<TransportationRouteDetailInfo> TransportationRouteDetailInfo { get; set; }
        public virtual DbSet<VWRouteDetail> VWRouteDetails { get; set; }
        public virtual DbSet<StudentSubCityVM> StudentSubCityVM { get; set; }
        public virtual DbSet<StudentSubCityVMEx> StudentSubCityVMEx { get; set; }

        public virtual DbSet<ProgramListVM> ProgramListVM { get; set; }
        public virtual DbSet<ProgramListEx> ProgramListEx { get; set; }
        public virtual DbSet<SubjectExamReportEx> SubjectExamReportEx { get; set; }





        public virtual DbSet<TransportationRouteInfo> TransportationRouteInfo { get; set; }
        public virtual DbSet<TransportationRouteInfoByStudent> TransportationRouteInfoByStudent { get; set; }
        public virtual DbSet<TransportationRouteStopLink> TransportationRouteStopLink { get; set; }
        public virtual DbSet<TransportationRouteStudentLink> TransportationRouteStudentLink { get; set; }
        public virtual DbSet<TransportationVehicleInfo> TransportationVehicleInfo { get; set; }
        public virtual DbSet<TimeTableReport> TimeTableReport { get; set; }
        public virtual DbSet<TimeTableReportData> TimeTableReportData { get; set; }

        public virtual DbSet<TimeTableReportDataEx> TimeTableReportDataEx { get; set; }
        public virtual DbSet<AttendanceLectureResponseModel> AttendanceLectureResponseModel { get; set; }
        public virtual DbSet<UpdateAttendanceModel> UpdateAttendanceModel { get; set; }
        public virtual DbSet<AttendenceDataModel> AttendenceDataModel { get; set; }

        public virtual DbSet<TimeTableTimeTableMerge> TimeTableTimeTableMerge { get; set; }
        public virtual DbSet<AttendenceDataEx> AttendenceDataEx { get; set; }
        public virtual DbSet<AttendanceAttendanceDetailVMEx> AttendanceAttendanceDetailVMEx { get; set; }
        public virtual DbSet<GetTeacherListresponse> GetTeacherListresponse { get; set; }
        public virtual DbSet<VWUserSession> VWUserSession { get; set; }
        public virtual DbSet<MobileSession> MobileSession { get; set; }
        public virtual DbSet<GetQuestionsResponse> GetQuestionsResponse { get; set; }

        public virtual DbSet<VWTimeTableSession> VWTimeTableSession { get; set; }
        public virtual DbSet<AttendanceLectureData> AttendanceLectureData { get; set; }
        public virtual DbSet<TimeTableAPI> TimeTableAPI { get; set; }
        public virtual DbSet<TimeTableAPIEx> TimeTableAPIEx { get; set; }
        public virtual DbSet<VWGetCampuses> VWGetCampuses { get; set; }
        public virtual DbSet<VWGetPrograms> VWGetPrograms { get; set; }
        public virtual DbSet<SlotWiseTotal> SlotWiseTotal { get; set; }
        public virtual DbSet<GetStudentInfoStepAcademy> GetStudentInfoStepAcademy { get; set; }
        public virtual DbSet<VWGetSubjects> VWGetSubjects { get; set; }
        public virtual DbSet<GetAttendenceData> GetAttendenceData { get; set; }
        public virtual DbSet<SetupRoomTypeBuildingVMEx> SetupRoomTypeBuildingVMEx { get; set; }
        public virtual DbSet<Sectionapi> Sectionapi { get; set; }
        public virtual DbSet<VWSectionAPIQuestion> VWSectionAPIQuestion { get; set; }
        public virtual DbSet<ExamTypeAPI> ExamTypeAPI { get; set; }
        public virtual DbSet<FinalDuesList> FinalDuesList { get; set; }
        public virtual DbSet<StdMailingLabel> StdMailingLabel { get; set; }
        public virtual DbSet<AdmissionAgingData> AdmissionAgingData { get; set; }


        public virtual DbSet<InquiryResponseModel> InquiryResponseModel { get; set; }

        public virtual DbSet<InquiryResponseFr> InquiryResponseFr { get; set; }
        // public virtual DbSet<counter> counter { get; set; }

        public virtual DbSet<routestudentlinkVM> routestudentlinkVM { get; set; }
        public virtual DbSet<Count> Count { get; set; }

        public virtual DbSet<routestudentlinklistVM> routestudentlinklistVM { get; set; }
        public virtual DbSet<AdmissionsCount> AdmissionsCount { get; set; }
        public virtual DbSet<FeeStudentChallanCount> FeeStudentChallanCount { get; set; }
        public virtual DbSet<AdmissiontrendClass> AdmissiontrendClass { get; set; }
        public virtual DbSet<VW_NegativeVideoRatting> VW_NegativeVideoRatting { get; set; }

        public virtual DbSet<EnrollmentsCount> EnrollmentsCount { get; set; }
        public virtual DbSet<VWExamReport> VWExamReport { get; set; }

        public virtual DbSet<ConcessionReports> ConcessionReports { get; set; }
        public virtual DbSet<ProgramMult> ProgramMult { get; set; }
        public virtual DbSet<CityMult> CityMult { get; set; }
        public virtual DbSet<CityMultDrill> CityMultDrill { get; set; }

        public virtual DbSet<GenderWiseCountEx> GenderWiseCountEx { get; set; }
        public virtual DbSet<VWSourceInfo> VWSourceInfo { get; set; }
        public virtual DbSet<AttendenceDatasStudent> AttendenceDatasStudent { get; set; }
        public virtual DbSet<AttendenceDatasStudentEx> AttendenceDatasStudentEx { get; set; }



        public virtual DbSet<ConceReportwithPercentage> ConceReportwithPercentage { get; set; }

        public virtual DbSet<VMTransportationRouteStopLink> VMTransportationRouteStopLink { get; set; }
        public virtual DbSet<StudentConcessedData> StudentConcessedData { get; set; }
        public virtual DbSet<VWTeacherTimeTableReport> VWTeacherTimeTableReport { get; set; }
        public virtual DbSet<AppException> AppException { get; set; }
        public virtual DbSet<UserLogEx> UserLogEx { get; set; }
        public virtual DbSet<Predicate> Predicate { get; set; }

        public virtual DbSet<MaskList> MaskList { get; set; }
        public virtual DbSet<provided> provided { get; set; }
        public virtual DbSet<LoginData> LoginData { get; set; }
        public virtual DbSet<LoginDataEx> LoginDataEx { get; set; }
        public virtual DbSet<TeacherRatingOverAllList> TeacherRatingOverAllList { get; set; }
        public virtual DbSet<TeacherRatingOverAllListwithid> TeacherRatingOverAllListwithid { get; set; }

        public virtual DbSet<TeacherRatingOverAllListpre> TeacherRatingOverAllListpre { get; set; }
        // bank API's

        public virtual DbSet<VWFeeChallan_API> VWFeeChallan_API { get; set; }

        public virtual DbSet<VWFeeApi> VWFeeApi { get; set; }
        public virtual DbSet<VWFeeApiPrintButton> VWFeeApiPrintButton { get; set; }

        public virtual DbSet<Transfer> Transfer { get; set; }

        //message
        public virtual DbSet<Sms> Sms { get; set; }

        public virtual DbSet<ExamSmSApprovalStdData> ExamSmSApprovalStdData { get; set; }

        public virtual DbSet<SmsSys> SmsSys { get; set; }
        public virtual DbSet<SmsApproval> SmsApproval { get; set; }


        public virtual DbSet<SmsAPI> SmsAPI { get; set; }
        public virtual DbSet<Templates> Templates { get; set; }
        public virtual DbSet<VWCustomData> VWCustomData { get; set; }

        // Seating Plan DbContext Base
        public virtual DbSet<SeatingPlanDateSheet> SeatingPlanDateSheet { get; set; }

        public virtual DbSet<DateSheetDetail> DateSheetDetail { get; set; }
        public virtual DbSet<TeacherProfileList> TeacherProfileList { get; set; }
        public virtual DbSet<StaffByCampus> StaffByCampus { get; set; }




        //Academic Calendar 
        public virtual DbSet<HolidayType> HolidayType { get; set; }
        // public virtual DbSet<AcademicCalendarType> AcademicCalendarType { get; set; }

        public virtual DbSet<StaffHODData> StaffHODData { get; set; }

        public virtual DbSet<SectionIncharge> SectionIncharge { get; set; }

        public virtual DbSet<AcademicCalendarVM> AcademicCalendarVM { get; set; }
        public virtual DbSet<AcademicCalendar> AcademicCalendar { get; set; }
        public virtual DbSet<CalendarExamType> CalendarExamType { get; set; }
        public virtual DbSet<RegularAdmissionReport> RegularAdmissionReport { get; set; }
        public virtual DbSet<TeacherCalendar> TeacherCalendar { get; set; }
        public virtual DbSet<NewTeacherCalendar> NewTeacherCalendar { get; set; }
        public virtual DbSet<StepEnrollmentData> StepEnrollmentData { get; set; }

        public virtual DbSet<StepCampuCity> StepCampuCity { get; set; }
        public virtual DbSet<TeacherCourseCalendar> TeacherCourseCalendar { get; set; }
        public virtual DbSet<SubjectExamReportExm2> SubjectExamReportExm2 { get; set; }
        public virtual DbSet<ExamScheduleExx> ExamScheduleExx { get; set; }
        public virtual DbSet<ExamResultReport> ExamResultReport { get; set; }
        public virtual DbSet<ExamSecWiseIndivid> ExamSecWiseIndivid { get; set; }
        public virtual DbSet<StudentCalendar> StudentCalendar { get; set; }
        public virtual DbSet<StudentAcademicCalendar> StudentAcademicCalendar { get; set; }

        public virtual DbSet<ExamIndividualSummaryExm2> ExamIndividualSummaryExm2 { get; set; }
        public virtual DbSet<SubjectExamReportExam2> SubjectExamReportExam2 { get; set; }
        public virtual DbSet<ExamIndividualSummaryAxExExm2> ExamIndividualSummaryAxExExm2 { get; set; }
        public virtual DbSet<SubWiseCalendarReport> SubWiseCalendarReport { get; set; }

        public virtual DbSet<AcademicCalendarMaster> AcademicCalendarMaster { get; set; }
        public virtual DbSet<AcademicCalendarMasterCity> AcademicCalendarMasterCity { get; set; }

        public virtual DbSet<AcademicCalendarView> AcademicCalendarView { get; set; }
        public virtual DbSet<GetAssessmentView> GetAssessmentView { get; set; }


        public virtual DbSet<AssessmentLevelClass> AssessmentLevelClass { get; set; }

        public virtual DbSet<AcademicCalendarType> AcademicCalendarType { get; set; }
        public virtual DbSet<AssessmentViewList> AssessmentViewList { get; set; }
        public virtual DbSet<AssessmentScedileViewList> AssessmentScedileViewList { get; set; }

        public virtual DbSet<deleteAssessmentSchedule> deleteAssessmentSchedule { get; set; }


        public virtual DbSet<UserCredencials> UserCredencials { get; set; }
        // Online Admission  Entry
        public virtual DbSet<ConcessionType> ConcessionType { get; set; }
        public virtual DbSet<CampusProgramInfo> CampusProgramInfo { get; set; }
        public virtual DbSet<SurveyDetailActiveVM> SurveyDetailActiveVM { get; set; }
        public virtual DbSet<MonthlyPlannerReport> MonthlyPlannerReport { get; set; }
        public virtual DbSet<StudentExamDataOverallData> StudentExamDataOverallData { get; set; }
        public virtual DbSet<TimeTableClose> TimeTableClose { get; set; }
        public virtual DbSet<TimeTableCloseResponse> TimeTableCloseResponse { get; set; }

        public virtual DbSet<AttendanceTeacherMonthDetail2> AttendanceTeacherMonthDetail2 { get; set; }
        public virtual DbSet<AttendanceTeacherMonthDetailHod> AttendanceTeacherMonthDetailHod { get; set; }

        public virtual DbSet<StudentExamDetail> StudentExamDetail { get; set; }
        public virtual DbSet<StudentExamDetailNew> StudentExamDetailNew { get; set; }


        public virtual DbSet<ClassInchargeAttendancedata> ClassInchargeAttendancedata { get; set; }
        public virtual DbSet<ClassInchargeAttendancedataCoursewise> ClassInchargeAttendancedataCoursewise { get; set; }
        public virtual DbSet<StudentExamDataSubjectWise3> StudentExamDataSubjectWise3 { get; set; }
        public virtual DbSet<StudentExamDataSubjectWise4> StudentExamDataSubjectWise4 { get; set; }

        public virtual DbSet<StudentReportExamData> StudentReportExamData { get; set; }

        public virtual DbSet<StudentTestData> StudentTestData { get; set; }
        public virtual DbSet<Checkconsessionvalidity> Checkconsessionvalidity { get; set; }

        public virtual DbSet<SecwiseStudentdata> SecwiseStudentdata { get; set; }
        public virtual DbSet<Checkconsessionvalidity2> Checkconsessionvalidity2 { get; set; }
        public virtual DbSet<CheckStudentInstallment> CheckStudentInstallment { get; set; }

        public virtual DbSet<studentResetPassword> studentResetPassword { get; set; }
        public virtual DbSet<Checkdayoff> Checkdayoff { get; set; }
        public virtual DbSet<getcourselist> getcourselist { get; set; }
        public virtual DbSet<textmessage> textmessage { get; set; }
        public virtual DbSet<examcourselist> examcourselist { get; set; }
        public virtual DbSet<StudentFeeStructureVM> StudentFeeStructureVM { get; set; }
        public virtual DbSet<AdhocChallanFeeHead> AdhocChallanFeeHead { get; set; }

        public virtual DbSet<StudentCreditNotes> StudentCreditNotes { get; set; }

        public virtual DbSet<UpdateAdhocChallan> UpdateAdhocChallan { get; set; }



        public virtual DbSet<GetAdhocListData> GetAdhocListData { get; set; }

        public virtual DbSet<TimeTableTimeTableDayClose4> TimeTableTimeTableDayClose4 { get; set; }
        public virtual DbSet<StudentRefundFee> StudentRefundFee { get; set; }
        public virtual DbSet<InstallmentNos> InstallmentNos { get; set; }
        public virtual DbSet<AttendanceCutOffDate> AttendanceCutOffDate { get; set; }
        public virtual DbSet<GetConcessionReversalStudents> GetConcessionReversalStudents { get; set; }
        public virtual DbSet<SectionList> SectionList { get; set; }
        public virtual DbSet<GetConcessionStudentsList> GetConcessionStudentsList { get; set; }
        public virtual DbSet<GetConcessionStudentsListEX> GetConcessionStudentsListEX { get; set; }
        public virtual DbSet<AdhocChallanModel> AdhocChallanModel { get; set; }



        public virtual DbSet<ExamApprovalNew> ExamApprovalNew { get; set; }
        public virtual DbSet<ExamSmsApprovalNew> ExamSmsApprovalNew { get; set; }
        public virtual DbSet<ExamSmsApprovalNewPopup> ExamSmsApprovalNewPopup { get; set; }


        public virtual DbSet<updatemarks> updatemarks { get; set; }
        public virtual DbSet<GetStudentExamDetail> GetStudentExamDetail { get; set; }
        public virtual DbSet<BuildingSectionData> BuildingSectionData { get; set; }
        public virtual DbSet<TimeTableTimeTableTeacher4> TimeTableTimeTableTeacher4 { get; set; }
        public virtual DbSet<TimeTableDailyAttendanceStatus> TimeTableDailyAttendanceStatus { get; set; }
        public virtual DbSet<TimeTableDailyAttendanceDetail> TimeTableDailyAttendanceDetail { get; set; }

        public virtual DbSet<ChallanValidityUpdatemodel> ChallanValidityUpdatemodel { get; set; }
        public virtual DbSet<SSATDataRequired> SSATDataRequired { get; set; }
        public virtual DbSet<AssessmentSchedulingList> AssessmentSchedulingList { get; set; }
        public virtual DbSet<AssessmentSchedulingMaster> AssessmentSchedulingMaster { get; set; }
        public virtual DbSet<AssessmentSchedulingDetail> AssessmentSchedulingDetail { get; set; }
        public virtual DbSet<AssessmentScheduleData> AssessmentScheduleData { get; set; }
        public virtual DbSet<MonthList> MonthList { get; set; }
        public virtual DbSet<CampusCityUserBased> CampusCityUserBased { get; set; }
        public virtual DbSet<GetAllLocationsSSATVM> GetAllLocationsSSATVM { get; set; }
        public virtual DbSet<GetAllTestSSATVM> GetAllTestSSATVM { get; set; }
        public virtual DbSet<GetAllTestSSAT> GetAllTestSSAT { get; set; }
        public virtual DbSet<GetAllSloTimeSSAT> GetAllSloTimeSSAT { get; set; }
        public virtual DbSet<GetTestDate> GetTestDate { get; set; }
        public virtual DbSet<AcceptanceResponseSTEPAcademy> AcceptanceResponseSTEPAcademy { get; set; }
        public virtual DbSet<GetAllCitiesSSATVM> GetAllCitiesSSATVM { get; set; }
        public virtual DbSet<GetAllLocationsStepSSAT> GetAllLocationsStepSSAT { get; set; }


        public virtual DbSet<StudentProfileCourseView> StudentProfileCourseView { get; set; }
        public virtual DbSet<StudentProfileUnApproved> StudentProfileUnApproved { get; set; }
        public virtual DbSet<StudentProfileApproved> StudentProfileApproved { get; set; }
        public virtual DbSet<ARVO_Configurations> ARVO_Configurations { get; set; }
        public virtual DbSet<ChapterTestNew> ChapterTestNew { get; set; }
        public virtual DbSet<GetRandomQuestionByCourse> GetRandomQuestionByCourse { get; set; }
        public virtual DbSet<GetQuizConfigrationDataResponse> GetQuizConfigrationDataResponse { get; set; }
        public virtual DbSet<GetQuizConfigrationDataResponseEx> GetQuizConfigrationDataResponseEx { get; set; }
        public virtual DbSet<GetQuizConfigrationDataResponseExNew> GetQuizConfigrationDataResponseExNew { get; set; }


        public virtual DbSet<GetQuizCourseList> GetQuizCourseList { get; set; }
        public virtual DbSet<QuizResult> QuizResult { get; set; }
        public virtual DbSet<QuizTimeUpdate> QuizTimeUpdate { get; set; }
        public virtual DbSet<SubmitQuizResponse> SubmitQuizResponse { get; set; }
        public virtual DbSet<ARVOConfiguration> ARVOConfiguration { get; set; }
        public virtual DbSet<TotalMarksQuizWize> TotalMarksQuizWize { get; set; }
        public virtual DbSet<QuizFinishedList> QuizFinishedList { get; set; }
        public virtual DbSet<QuizFinishedListEx> QuizFinishedListEx { get; set; }


        public virtual DbSet<LeaderBoard> LeaderBoard { get; set; }
        public virtual DbSet<LeaderBoardEx> LeaderBoardEx { get; set; }

        public virtual DbSet<quizBreakdownofstudent> quizBreakdownofstudent { get; set; }

        public virtual DbSet<Top10Leaguestudentdata> Top10Leaguestudentdata { get; set; }

        public virtual DbSet<QuizAllDoneOverAll> QuizAllDoneOverAll { get; set; }
        public virtual DbSet<returnResponseValue> returnResponseValue { get; set; }
        public virtual DbSet<StudentPerformnce> StudentPerformnce { get; set; }

        public virtual DbSet<GetEbookCheckResponse> GetEbookCheckResponse { get; set; }

        public virtual DbSet<VideosRating> VideosRating { get; set; }
        public virtual DbSet<GetStaffCheckData> GetStaffCheckData { get; set; }


        public virtual DbSet<getVideoRating> getVideoRating { get; set; }
        public virtual DbSet<TopicsWatched> TopicsWatched { get; set; }
        public virtual DbSet<StudentCourses> StudentCourses { get; set; }
        public virtual DbSet<GetLastTime> GetLastTime { get; set; }
        public virtual DbSet<ArvoDataBoards> ArvoDataBoards { get; set; }
        public virtual DbSet<GetLeagueList> GetLeagueList { get; set; }
        public virtual DbSet<GetLeagueListData> GetLeagueListData { get; set; }
        public virtual DbSet<GetCityConfigrationData> GetCityConfigrationData { get; set; }
        public virtual DbSet<League> League { get; set; }
        public virtual DbSet<CityConfiguration> CityConfiguration { get; set; }
        //public virtual DbSet<ConfigurationApiResponse> ConfigurationApiResponse { get; set; }
        public virtual DbSet<CourseConfiguration> CourseConfiguration { get; set; }
        public virtual DbSet<CourseData> CourseData { get; set; }
        public virtual DbSet<QuizSummeryData> QuizSummeryData { get; set; }
        public virtual DbSet<QuizSummeryDataCityWise> QuizSummeryDataCityWise { get; set; }
        public virtual DbSet<QuizSummeryDataQuizWise> QuizSummeryDataQuizWise { get; set; }
        public virtual DbSet<GetArvoSubjectList> GetArvoSubjectList { get; set; }
        public virtual DbSet<QuizTopStudentSession> QuizTopStudentSession { get; set; }
        public virtual DbSet<QuizTopStudentSessionCourse> QuizTopStudentSessionCourse { get; set; }
        public virtual DbSet<QuizTopStudentSessionEx> QuizTopStudentSessionEx { get; set; }
        public virtual DbSet<QuizTopStudentSessionCourseEx> QuizTopStudentSessionCourseEx { get; set; }
        public virtual DbSet<QuizWeeklyPerformanceResponse> QuizWeeklyPerformanceResponse { get; set; }
        public virtual DbSet<QuizSubjectWisePerformance> QuizSubjectWisePerformance { get; set; }
        public virtual DbSet<QuizCityWisePerformance> QuizCityWisePerformance { get; set; }
        public virtual DbSet<QuizTimeWiseOverAllPerformance> QuizTimeWiseOverAllPerformance { get; set; }
        public virtual DbSet<QuizTimeWiseOverAllPerformanceSessionBased> QuizTimeWiseOverAllPerformanceSessionBased { get; set; }
        public virtual DbSet<QuizSubCityOverAllPerformance> QuizSubCityOverAllPerformance { get; set; }
        public virtual DbSet<BulkCopyProgramDetailResponse> BulkCopyProgramDetailResponse { get; set; }

        public virtual DbSet<AdmissionFormCpl4VMWithProgramId> AdmissionFormCpl4VMWithProgramId { get; set; }




        private Config designTimeConfig;
        protected Config DesignTimeConfig
        {
            get
            {
                if (designTimeConfig == null)
                {
                    try
                    {
                        DirectoryInfo info = new DirectoryInfo(AppContext.BaseDirectory);
                        DirectoryInfo dataProjectRoot = info.Parent.Parent.Parent.Parent;

                        string basePath = Path.Combine(dataProjectRoot.FullName, "data");

                        IConfigurationRoot config = new ConfigurationBuilder()
                            .SetBasePath(basePath)
                            .AddJsonFile("npgsql.json")
                            .Build();

                        designTimeConfig = config.GetSection("data").Get<Config>();
                    }
                    catch (Exception) { }
                }
                return designTimeConfig;
            }
        }

        public DbContextBase() : base()
        {

        }

        public DbContextBase(DbContextOptions options) : base(options)
        {

        }

        protected virtual void BeforeModelCreated(ModelBuilder modelBuilder)
        {
            string schemaName = this.DesignTimeConfig?.SchemaName;

            if (!string.IsNullOrWhiteSpace(schemaName))
                modelBuilder.HasDefaultSchema(schemaName);
        }

        protected virtual void AfterModelCreated(ModelBuilder modelBuilder)
        {
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                // set all string data types to unicode
                foreach (var prop in entity.GetProperties())
                {
                    if (prop.ClrType == typeof(string))
                        prop.IsUnicode(true);
                }

                // disable cascade delete operations
                foreach (var entityType in modelBuilder.Model.GetEntityTypes())
                {
                    foreach (var relationship in entityType.GetForeignKeys())
                    {
                        relationship.DeleteBehavior = DeleteBehavior.Restrict;
                    }
                }
            }
        }
    }
}