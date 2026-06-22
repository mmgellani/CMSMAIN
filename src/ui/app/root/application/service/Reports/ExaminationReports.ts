import { default as Axios } from "axios";
import { Store } from "vuex";
import { GlobalConfig } from "../../../../common";
import { StoreService } from "../../../../store";

const BASE_URL = GlobalConfig.uri.services + "Reports/";

export class ExaminationReportsService extends StoreService {
  constructor(store: Store<{}>) {
    super(store);
  }

  public CheckRemarks(predicate:string) {
    return this.exec<any>(Axios.post(BASE_URL + 'CheckRemarks',{
      ProvidedString: predicate
    }))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }


  public GetExamResultSubject(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamResultSubject", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetAwardList(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetAwardList", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetExamSubjectWise(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamSubjectWise", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamSubjectWiseExm2(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamSubjectWiseExm2", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamSubjectWiseEx(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamSubjectWiseEx", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamSubjectWiseAtten(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamSubjectWiseAtten", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetCombinedSubjectExam(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetCombinedSubjectExam", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetCombinedSubjectExam2(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetCombinedSubjectExam2", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamMonthly(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamMonthly", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamMonthlyExx(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamMonthlyExx", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetExamMonthlyExy(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamMonthlyExy", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetStudentAcademicAnalysisReportExm2Ex3(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetStudentAcademicAnalysisReportExm2Ex3", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetStudentAcademicAnalysisReport1styearDate(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetStudentAcademicAnalysisReport1styearDate", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  
  public GetStudentAcademicAnalysisReportExm2Ex5(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetStudentAcademicAnalysisReportExm2Ex5", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetStudentAcademicAnalysisReport1styearExam(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetStudentAcademicAnalysisReport1styearExam", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetStudentAcademicAnalysisReportExamTypeWiseExm2Ex3(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetStudentAcademicAnalysisReportExamTypeWiseExm2Ex3", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamRemarks(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamRemarks", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamIndividSummary(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamIndividSummary", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamIndividSummaryExm2(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamIndividSummaryExm2", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetExamIndividSummarySectionExmEx(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamIndividSummarySectionExmEx", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamIndividSummaryE12(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamIndividSummaryE12", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetAcademicPerformance(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetAcademicPerformance", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetAcademicPerReport(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetAcademicPerReport", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamIndividSummarySection(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamIndividSummarySection", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamIndividSummarySectionExm2(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamIndividSummarySectionExm2", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public ExamSecWiseIndividReport(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "ExamSecWiseIndividReport", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public ExamAssessmentSecWiseIndividReport(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetStudentAssessmentData", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public ExamAssessmentList(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetSectionWiseAssmentList", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public ExamSecWiseIndividReportProvisional(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "ExamSecWiseIndividReportProvisional", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamIndiviReport(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamIndiviReport", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamIndiviReportUn(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamIndiviReportUn", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetExamIndiviReportExamtype(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamIndiviReportExamtype", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetEnrolledStudentsContactEx(predicate: string) {
    return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsContactEx", {
        ProvidedString: predicate
      }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetEvaluateStudents(predicate: string) {
    return this.exec<any>( Axios.post(BASE_URL + "GetEvaluateStudents", {
        ProvidedString: predicate
      }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  //////////
  public GetStudentResultReport(predicate: string) {

    return this.exec<any>(Axios.post(BASE_URL + "GetStudentResultReport", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetEvaluateStudentsEx(predicate: string) {
    return this.exec<any>( Axios.post(BASE_URL + "GetEvaluateStudentsEx", {
        ProvidedString: predicate
      }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetGradeStudents(predicate: string) {
    return this.exec<any>( Axios.post(BASE_URL + "GetGradeStudents", {
        ProvidedString: predicate
      }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetGazetteData(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetGazetteData", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public ExamSectiontestwise(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "ExamSectiontestwise", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }


  public GetExamTypeWiseReport(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamTypeWiseReport", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetExamTypeWiseReport2(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetExamTypeWiseExam2", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetSectionWiseExam2(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetSectionWiseExam2", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  // public GetEnrolledStudentsCount(predicate: string) {
  //   return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsCount", {
  //       ProvidedString: predicate
  //     }))
  //     .then(value => this.processPayload(value))
  //     .catch(error => console.error(error));
  // }

  // public GetEnrolledStudentsRef(predicate: string) {
  //   return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsRef", {
  //       ProvidedString: predicate
  //     }))
  //     .then(value => this.processPayload(value))
  //     .catch(error => console.error(error));
  // }
  // public GetEnrolledStudentsBoard(predicate: string) {
  //   return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsBoard", {
  //       ProvidedString: predicate
  //     }))
  //     .then(value => this.processPayload(value))
  //     .catch(error => console.error(error));
  // }
  // public GetEnrolledStudentsReligion(predicate: string) {
  //   return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsReligion", {
  //       ProvidedString: predicate
  //     }))
  //     .then(value => this.processPayload(value))
  //     .catch(error => console.error(error));
  // }
  // public GetEnrolledStudentsMarks(predicate: string) {
  //   return this.exec<any>( Axios.post(BASE_URL + "GetEnrolledStudentsMarks", {
  //       ProvidedString: predicate
  //     }))
  //     .then(value => this.processPayload(value))
  //     .catch(error => console.error(error));
  // }

}
