import { default as Axios } from "axios";
import { GlobalConfig } from "../../../../common";
import { Store } from "vuex";
import { StoreService } from "../../../../store";

const BASE_URL = GlobalConfig.uri.services + "Reports/";

export class FeeReportsService extends StoreService {
  constructor(store: Store<{}>) {
    super(store);
  }

  //Fee Reports Services

  //   public GetFeeDetail(predicate: string) {
  //     return this.exec<any>( Axios.post(BASE_URL + "GetFeeDetail", {
  //         ProvidedString: predicate
  //       }))
  //       .then(value => this.processPayload(value))
  //       .catch(error => console.error(error));
  //   }
  public GetFeeDetail(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllFeeDetail", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeInstallment(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFeeInstallment", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetFeeRevenueWise(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFeeRevenueWise", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  
  public Transportdata(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TransportData", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetStudentRevenueWise(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetStudentRevenueWise", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetStudentRevenueWiseEx(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetStudentRevenueWiseEx", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetStudentRevenueWiseExy(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetStudentRevenueWiseExy", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
   public GetStudentRevenueWiseExyNew(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetStudentRevenueWiseExyNew", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetScholarshipReport(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetScholarshipReport", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeDetailFinal(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFeeDetailFinal", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetFeeDetailFinalDefaulter(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFeeDetailFinalDefaulter", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeDefaulterDetail(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFeeDefaulterDetail", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetFeeStat(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFeeStat", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetFeeDefaulterDetailEnr(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFeeDefaulterDetailEnr", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeDefaulterSummary(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFeeDefaulterSummary", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetInstallemntexamption(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetInstallemntexamption", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetInstallemntexamption2(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetInstallemntexamption2", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeDetailOnly(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFeeDetailOnly", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeDetailVM(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAllFeeDetailVM", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetDailyFeeStatement(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetDailyFeeStatement", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetDailyFeeStatement2(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetDailyFeeStatement2", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetDailyFeeStatementVM(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetDailyFeeStatementVM", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetDailyFeeStatementOnly(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetDailyFeeStatement", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetDailyFeeStatementEnrolled(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetDailyFeeStatementEnrolled", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetDailyFeeStatementEnrolled2(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetDailyFeeStatementEnrolled2", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetDailyFeeStatementEnrolledTrackHistory(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetDailyFeeStatementEnrolledTrackHistory", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetDailyFeeStatementEnrolledEx(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetDailyFeeStatementEnrolledEx", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public StudentRefundFee(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "StudentRefundFee", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public TeacherReport(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetTeacherAttendanceReport", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public StudentRefundFeeEx(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "StudentRefundFeeEx", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetConcessCountReport(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetConcessCountReport", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetStepCountReport(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetStepCountReport", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetFeeAverageRevenue(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeAverageRevenue", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetFeeAverageRevenueOnly(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeAverageRevenueOnly", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeAverageRevenueVM(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeAverageRevenueVM", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeDetailProgramWise(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeDetailProgramWise", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeDetailProgramWiseOnly(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeDetailProgramWiseOnly", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeDetailProgramWiseVM(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeDetailProgramWiseVM", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetConceWithPercentage(predicate: string) {

    return this.exec<any>(Axios.post(BASE_URL + "GetConceWithPercentage", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  //Refined fun of concession with new view by ehtasham and fahd
  public GetFeeConcessionDetails(predicate: string) {

    return this.exec<any>(Axios.post(BASE_URL + "GetConcessionReportData", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public getFeeConcessionDetailsOnly(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "getFeeConcessionDetailsOnly", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeConcessionDetailsVM(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeConcessionDetailsVM", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeConcessionStrength(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeConcessionStrength", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetFeeConcessionStrengthUnpaid(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeConcessionStrengthUnpaid", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

    public GetProgramWiseConcessionReport(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetProgramWiseConcessionReport", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeConcessionStrengthVM(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeConcessionStrengthVM", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeConcessionStrengthOnly(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeConcessionStrengthOnly", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeConcessionStrengthSummary(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeConcessionStrengthSummary", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeConcessionStrengthSummaryVM(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeConcessionStrengthSummaryVM", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeConcessionStrengthSummaryOnly(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeConcessionStrengthSummaryOnly", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeDefaulter(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeDefaulter", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeDefaulterVM(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeDefaulterVM", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeDefaulterOnly(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeDefaulterOnly", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeFinalDuesList(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeFinalDuesList", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeFinalDuesListVM(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeFinalDuesListVM", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFeeFinalDuesListOnly(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetFeeFinalDuesListOnly", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetScholashipStudents(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetScholashipStudents", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetScholashipStudentsOnly(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetScholashipStudentsOnly", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetScholashipStudentsVM(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetScholashipStudentsVM", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetStudentChallanStatus(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetStudentChallanStatus", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetStudentChallanStatusVM(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetStudentChallanStatusVM", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetStudentChallanStatusOnly(predicate: string) {
    return this.exec<any>(Axios.post(BASE_URL + "GetStudentChallanStatusOnly", {
      ProvidedString: predicate
    }))
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetTransportDefaultReport(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTransportDefaultReport", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetFullFeeStudentDetail(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFullFeeStudentDetail", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }


  public GetStudentFinanceReport(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetStudentFinanceReport", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public GetStudentFinanceData(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetStudentFinanceData", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }



  public GetBusniessUnitFinanceData(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetBusniessUnitFinanceData", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetcamuswiseWiseDifferentFormat(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetcamuswiseWiseDifferentFormat", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
  public GetCitywiseConsolidatedData(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetCitywiseConsolidatedData", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
    public GetBankCitywiseConsolidatedData(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetBankCitywiseConsolidatedData", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

    public GetCityWiseFinanceData(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetCityWiseFinanceData", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }



  public  GetCampusWiseFinanceData(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetCampusWiseFinanceData", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

  public  GetProgramWiseFinanceData(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetProgramWiseFinanceData", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }

    public GetProgramWiseFinanceDataLatest(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetProgramWiseFinanceDataLatest", {
        ProvidedString: predicate
      })
    )
      .then(value => this.processPayload(value))
      .catch(error => console.error(error));
  }
}
