/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import { default as Axios } from "axios";
import { Store } from "vuex";
import { GlobalConfig } from "../../../../common";
import { StoreService } from "../../../../store";
import { IPublicVWDashBoardVM } from "../../models";

const BASE_URL = GlobalConfig.uri.services + "PublicDashBoard/";

export class PublicVWDashBoardVMService extends StoreService {
  constructor(store: Store<{}>) {
    super(store);
  }
  public GetAll() {
    return this.exec<any>(Axios.get(BASE_URL + "GetAll"))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetFeeCount() {
    return this.exec<any>(Axios.get(BASE_URL + "GetFeeCount"))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionSessionWiseDataEx(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionSessionWiseDataEx", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionSessionWiseDataEx2(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionSessionWiseDataEx2", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAdmissionSessionWiseDataCampus(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionSessionWiseDataCampus", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAdmissionSessionWiseDataCampusTestingClone(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionSessionWiseDataCampusTestingClone", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionSessionWiseDataEx4(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionSessionWiseDataEx4", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public AverageDashboard(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "AverageDashboard", { ProvidedString: predicate })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public AverageDashboardEx() {
    return this.exec<any>(Axios.get(BASE_URL + "AdmissionAverageEx"))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetFeeCountDateWise(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFeeCountDateWise", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetFeeCountDateWiseA(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFeeCountDateWiseA", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAllAsync() {
    return this.exec<any>(Axios.get(BASE_URL + "GetAllAsync"))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSingle(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSingle", { ProvidedString: predicate })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSingleAsync(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSingleAsync", { ProvidedString: predicate })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetFindBy(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFindBy", { ProvidedString: predicate })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetNotificationDashboard(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetNotificationDashboard", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCommentDash(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDash", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //December 2021 Survey
  public GetSurveyCommentDash1(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDash1", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //April 2022 Survey
  public GetSurveyCommentDashApril(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashApril", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCommentDashJanuary23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJanuary23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCommentDashJanuary24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJanuary24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCommentDashJanuary26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJanuary26", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
  public GetSurveyCommentDashJanuary25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJanuary25", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCommentDashJuly23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJuly23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCommentDashEbook23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashEbook23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyQuestionDashJun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyQuestionDashJun24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCommentDashJun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJun24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCommentDashEbook24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashEbook24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCommentDashJanuary23WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJanuary23WithBuilding", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCommentDashJanuary24WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJanuary24WithBuilding", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
    public GetSurveyCommentDashJanuary26WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJanuary26WithBuilding", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCommentDashJanuary25WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJanuary25WithBuilding", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCommentDashJuly23WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJuly23WithBuilding", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyQuestionDashJun24WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyQuestionDashJun24WithBuilding", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCommentDashJun24WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJun24WithBuilding", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCommentDashJanuary2023(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJanuary2023", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCommentDashJuly2023(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJuly2023", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCommentDashJun2024(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJun2024", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyQuestionDashJun2024(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyQuestionDashJun2024", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyQuestionDashEbook24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyQuestionDashEbook24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyQuestionDashEbook2024(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyQuestionDashEbook2024", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCommentDashEx(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashEx", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //December Survey 2021
  public GetSurveyCommentDashEx1(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashEx1", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //April Survey 2022
  public GetSurveyCommentDashExApril(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashExApril", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCity(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCity", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  //December Survey 2021
  public GetSurveyCityEX(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityEX", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //April DashBoard
  public GetSurveyCityEXX(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityEXX", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCityDec22(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityDec22", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public SurveyStatisticsJan23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsJan23", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public SurveyStatisticsJanuary24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsJanuary24", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public SurveyStatisticsJanuary25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsJanuary25", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  //survey statistics July 23

  public SurveyStatisticsJul23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsJul23", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public SurveyStatisticsJun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsJun24", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
  public SurveyStatisticsJan25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsJan25", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public SurveyStatisticsJan26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsJan26", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public SurveyStatisticsEbook24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsEbook24", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public BuildingSectionData(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "BuildingSectionData", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public BuildingSectionDataEx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "BuildingSectionDataEx", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public BuildingSectionDataWithSessionAndClass(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "BuildingSectionDataWithSessionAndClass", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public BuildingSectionData24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "BuildingSectionData24", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
   public BuildingSectionData26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "BuildingSectionData26", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public BuildingSectionData25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "BuildingSectionData25", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCityEX1(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityEX1", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  // Survey April Data
  public GetSurveyCityApril(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityApril", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  } // Survey April Data
  public GetSurveyCityJanuary23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityJanuary23", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCityJuly23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityJuly23", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCityJun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityJun24", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCityEbook24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityEbook24", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCityJanuary23WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsCityWiseJanuary23WithBuilding", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCityJuly23WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsCityWiseJuly23WithBuilding", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public SurveyStatisticsCityWiseJun24WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsCityWiseJun24WithBuilding", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCityEX1posession(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityEX1posession", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public SurveyStatisticsEx1LatestJanuary23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsEx1LatestJanuary23", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public SurveyStatisticsEx1LatestJuly23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsEx1LatestJuly23", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public SurveyStatisticsEx1LatestJun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsEx1LatestJun24", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public SurveyStatisticsEx1LatestEBook(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsEx1LatestEBook", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCityEX2(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityEX2", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCityEXApril(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityEXApril", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetOverAllResult(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  // Survey December 2021
  public GetOverAllResult1(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  } // Survey December 2021
  public GetOverAllResult1January23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1January23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetOverAllResult1July23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1July23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetOverAllResult1Jun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1Jun24", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResult1Ebook24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1Ebook24", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  

  public GetSurveyOverAllJan2025(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyOverAllJan2025", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResult1January23WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1January23WithBuilding", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResult1Jun24WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1Jun24WithBuilding", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResult1July23WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1July23WithBuilding", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  // Survey December 2021

  // Survey December 2021
  public GetOverAllResult1withposission(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1withposission", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  // Survey April 2022
  public GetOverAllResult1withposissionApril(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1withposissionApril", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  // Survey April 2022
  public GetOverAllResult1withposissionJanuary23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1withposissionJanuary23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetOverAllResult1withposissionJuly23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1withposissionJuly23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetOverAllResult1withposissionJun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1withposissionJun24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResult1withposissionEbook24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1withposissionEbook24", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  // Survey April 2022
  public GetOverAllResult1withposissionJanuary2023(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1withposissionJanuary2023", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetOverAllResult1withposissionJuly2023(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1withposissionJuly2023", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetOverAllResult1withposissionJun2024withbuilding(param: string) {
    return this.exec<any>(
      Axios.post(
        BASE_URL + "GetOverAllResult1withposissionJun2024withbuilding",
        { ProvidedString: param }
      )
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResult1pre(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1pre", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResult1April(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1April", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetOverAllResultEx(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResultEx", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //Survey December 2021
  public GetOverAllResultEx1(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResultEx1", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //Survey April 2022
  public GetOverAllResultApril(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResultApril", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  } //Survey April 2022
  public GetOverAllResultJanuary23(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResultJanuary23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetOverAllResultJuly23(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResultJuly23", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetOverAllResultJun24(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResultJun24", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResultEbook24(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResultEbook24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResultEx1pre(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResultEx1pre", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResultEx1April(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResultEx1April", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeachersRating(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeachersRating", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  // survey december 2021
  public GetTeachersRating1(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeachersRating1", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeachersRating1pre(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeachersRating1pre", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeachersRatingEx(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeachersRatingEx", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //survey december 2021
  public GetTeachersRatingEx1(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeachersRatingEx1", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public Dec2021TeacherRatingswithid(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "Dec2021TeacherRatingswithid", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public April2022TeacherRatingswithid(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "April2022TeacherRatingswithid", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public TeacherRatingswithidJanuary2023(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TeacherRatingswithidJanuary2023", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public TeacherRatingswithidJuly2023(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TeacherRatingswithidJuly2023", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public TeacherRatingswithidJun2024(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TeacherRatingswithidJun2024", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public April2022TeacherRatingswithidSpecificCity(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "April2022TeacherRatingswithidSpecificCity", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public July2023TeacherRatingswithidSpecificCity(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "July2023TeacherRatingswithidSpecificCity", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public Jun2024TeacherRatingswithidSpecificCity(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "Jun2024TeacherRatingswithidSpecificCity", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public Jan23TeacherRatingswithidSpecificCityWithBuilding(param: any) {
    return this.exec<any>(
      Axios.post(
        BASE_URL + "Jan23TeacherRatingswithidSpecificCityWithBuilding",
        { ProvidedString: param }
      )
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public July23TeacherRatingswithidSpecificCityWithBuilding(param: any) {
    return this.exec<any>(
      Axios.post(
        BASE_URL + "July23TeacherRatingswithidSpecificCityWithBuilding",
        { ProvidedString: param }
      )
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public Jun24TeacherRatingswithidSpecificCityWithBuilding(param: any) {
    return this.exec<any>(
      Axios.post(
        BASE_URL + "Jun24TeacherRatingswithidSpecificCityWithBuilding",
        { ProvidedString: param }
      )
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeachersRatingEx1pre(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeachersRatingEx1pre", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionCount(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionCount", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTotalSurvey(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTotalSurvey", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurvey2() {
    return this.exec<any>(Axios.get(BASE_URL + "GetSurvey2"))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //December Total Survey 2021
  public GetSurvey3(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurvey3", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public TotalSurveyExJan23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TotalSurveyExJan23", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public TotalSurveyJanuary2024(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TotalSurveyJanuary2024", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public TotalSurveyJanuary2025(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TotalSurveyJanuary2025", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public TotalSurveyExJul23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TotalSurveyExJul23", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public TotalSurveyExJun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TotalSurveyExJun24", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
  public TotalSurveyExJan25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TotalSurveyExJan25", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
   public TotalSurveyExJan26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TotalSurveyExJan26", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public TotalSurveyEbooks24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TotalSurveyEbooks24", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurvey3pree(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurvey3pree", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSubjectList(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSubjectList", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSubCityList(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSubCityList", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyList(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyList", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetGraphData(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetGraphData", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTopTeachers(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTopTeachers", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeacherSearch(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSearch", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherSearchwithcity(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSearchwithcity", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherSearchwithcityApril(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSearchwithcityApril", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeacherSearchwithcityJuly(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSearchwithcityJuly", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeacherSearchwithcityJune24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSearchwithcityJune24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //December Survey 2021
  public GetTeacherSearchEX(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSearchEX", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherSurvey(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSurvey", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //December Survey 2021
  public GetTeacherSurveyEx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSurveyEX", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //April Survey 2022
  public GetTeacherSurveyExApril(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSurveyEXApril", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //JAnuary Survey 2023
  public GetTeacherSurveyEXJanuary23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSurveyEXJanuary23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  //JAnuary Survey 2023
  public GetTeacherSurveyEXJuly23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSurveyEXJuly23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherSurveyEXJun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSurveyEXJun24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherGraphSection(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSection", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherGraphSectionLatest(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionLatest", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherGraphSubject(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSubject", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //April Survey 2022
  public GetTeacherGraphSubjectApril(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSubjectApril", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //January Survey 2023
  public GetTeacherGraphSubjectJanuary23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSubjectJanuary23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //July Survey 2023
  public GetTeacherGraphSubjectJuly23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSubjectJuly23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherGraphSubjectJun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSubjectJun24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //Dec Survey Teacher Sections Data
  public GetTeacherGraphSectionWise(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWise", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherGraphSectionWisewithtotal(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotal", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //April Surcey 2022
  public GetTeacherGraphSectionWisewithtotalApril(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalApril", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //January Surcey 2023
  public GetTeacherGraphSectionWisewithtotalJanuary23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJanuary23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //July Surcey 2023
  public GetTeacherGraphSectionWisewithtotalJuly23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJuly23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherGraphSectionWisewithtotalJun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJun24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeacherGraphSectionWisewithtotalJanuary23Xx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJanuary23Xx", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherGraphSectionWisewithtotalJuly23Xx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJuly23Xx", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeacherGraphSectionWisewithtotalJun24Xx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJun24Xx", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeacherGraphSectionWisewithtotalJanuary23EXx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJanuary23EXx", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherGraphSectionWisewithtotalJuly23EXx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJuly23EXx", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeacherGraphSectionWisewithtotalJun24EXx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJun24EXx", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeacherGraphMonth(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphMonth", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherGraphMonthEX(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphMonthEX", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetComments(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetComments", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetCommentsSubcity(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetCommentsSubcity", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetCommentsCitySubCityDateWise(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetCommentsCitySubCityDateWise", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetCommentAll(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetCommentAll", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetBottomTeachers(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetBottomTeachers", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeacherRatingList(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherRatingList", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSubjectRatingList(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSubjectRatingList", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCapmusList(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCapmusList", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCrsList(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCrsList", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetAdmissionCountFeeWise(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAdmissionCountFeeWise", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetNotificationDashboardCampusWise(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetNotificationDashboardCampusWise", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyRatingAll(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAll", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyRatingAllEx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllEx", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //Survey December 2021
  public GetSurveyRatingAllEx2(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllEx2", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyRatingAllJanuary23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllJanuary23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyRatingAllJuly23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllJuly23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyRatingAllEbook24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllEbook24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  //Survey April 2022
  public GetSurveyRatingAllApril(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllApril", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //Survey December 2021
  public GetSurveyRatingAllEx3(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllEx3", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //Survey April 2022
  public GetSurveyRatingAllAprilEx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllAprilEx", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyRatingAllExJanuary23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllExJanuary23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyRatingAllExJuly23(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllExJuly23", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyRatingAllExEbook24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllExEbook24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //Survey December 2021

  public GetSurveyRatingAllEx1(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllEx", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetNotificationDashboardSessionWise(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetNotificationDashboardSessionWise", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetCalculateMonthAverageSession(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetCalculateMonthAverageSession", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetCalculateMonthAverageCampus(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetCalculateMonthAverageCampus", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetCalculateMonthAverageProgram(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetCalculateMonthAverageProgram", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetCalculateMonthAverageSection(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetCalculateMonthAverageSection", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetNotificationDashboardProgramWise(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetNotificationDashboardProgramWise", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetFindByAsync(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFindByAsync", { ProvidedString: predicate })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public AddOne(entity: any) {
    return this.exec<any>(Axios.post(BASE_URL + "AddOne", entity))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public AddOneAsync(entity: any) {
    return this.exec<any>(Axios.post(BASE_URL + "AddOneAsync", entity))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public AddMany(entity: Array<any>) {
    return this.exec<any>(Axios.post(BASE_URL + "AddMany", entity))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public AddManyAsync(entity: Array<any>) {
    return this.exec<any>(Axios.post(BASE_URL + "AddManyAsync", entity))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public Update(entity: any) {
    return this.exec<any>(Axios.post(BASE_URL + "Update", entity))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public UpdateAsync(entity: any) {
    return this.exec<any>(Axios.post(BASE_URL + "UpdateAsync", entity))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public Delete(entity: any) {
    return this.exec<any>(Axios.post(BASE_URL + "Delete", entity))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public DeleteAsync(entity: any) {
    return this.exec<any>(Axios.post(BASE_URL + "DeleteAsync", entity))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public DeleteWhere(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "DeleteWhere", { ProvidedString: predicate })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public DeleteWhereAsync(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "DeleteWhereAsync", { ProvidedString: predicate })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetStudentFeedBack(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetStudentFeedBack", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetStudentFeedBackAgainstStudent(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetStudentFeedBackAgainstStudent", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherSearchwithcityJanuary24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSearchwithcityJanuary24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
    public GetTeacherSearchwithcityJanuary26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSearchwithcityJanuary26", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherSearchwithcityJanuary25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSearchwithcityJanuary25", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherSurveyJanuary24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSurveyJanuary24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherSurveyJanuary26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSurveyJanuary26", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherSurveyJanuary25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSurveyJanuary25", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  //January Survey 2024
  public GetTeacherGraphSubjectJanuary24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSubjectJanuary24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeacherGraphSubjectJanuary26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSubjectJanuary26", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }


  public GetTeacherGraphSubjectJanuary25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSubjectJanuary25", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  //January Surcey 2024
  public GetTeacherGraphSectionWisewithtotalJanuary24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJanuary24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
    public GetTeacherGraphSectionWisewithtotalJanuary26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJanuary26", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherGraphSectionWisewithtotalJanuary25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJanuary25", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherSearchJanuary24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSearchJanuary24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeacherSearchJanuary25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherSearchJanuary25", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

 public GetSurveyCommentDashJanuary2024(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJanuary2024", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  } 
  public GetSurveyCommentDashJanuary2026(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJanuary2026", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCommentDashJanuary2025(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashJanuary2025", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyRatingAllJanuary24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllJanuary24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyRatingAllJanuary25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllJanuary25", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

   public GetSurveyRatingAllJanuary26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllJanuary26", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyRatingAllJun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllJun24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
  public GetSurveyRatingAllEBook2024(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllEBook2024", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyRatingAllExJanuary24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllExJanuary24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyRatingAllExJanuary25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllExJanuary25", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

   public GetSurveyRatingAllExJanuary26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllExJanuary26", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyRatingAllExJun24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllExJun24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
  public GetSurveyRatingAllExEBook24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyRatingAllExEBook24", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public TotalSurveyExJan24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TotalSurveyExJan24", { ProvidedString: param })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public SurveyStatisticsEx1LatestJanuary24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsEx1LatestJanuary24", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
 public SurveyStatisticsEx1LatestJanuary26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsEx1LatestJanuary26", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public SurveyStatisticsEx1LatestJanuary25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsEx1LatestJanuary25", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetSurveyCityJanuary24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityJanuary24", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
  public GetSurveyCityJanuary25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityJanuary25", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
public GetSurveyCityJanuary26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCityJanuary26", { ProvidedString: param })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetSurveyCityJanuary24WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsCityWiseJanuary24WithBuilding", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  

  public GetSurveyCityJanuary25WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsCityWiseJanuary25WithBuilding", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
public GetSurveyCityJanuary26WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "SurveyStatisticsCityWiseJanuary26WithBuilding", {
        ProvidedString: param,
      })
    )

      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public Januray24TeacherRatingswithidSpecificCity(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "Januray24TeacherRatingswithidSpecificCity", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
public Januray26TeacherRatingswithidSpecificCity(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "Januray26TeacherRatingswithidSpecificCity", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

   public Januray25TeacherRatingswithidSpecificCity(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "Januray25TeacherRatingswithidSpecificCity", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetTeacherGraphSectionWisewithtotalJanuary24Ex(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJanuary24Ex", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetTeacherGraphSectionWisewithtotalJanuary26Ex(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJanuary26Ex", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }


   public GetTeacherGraphSectionWisewithtotalJanuary25Ex(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJanuary25Ex", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public TeacherRatingswithidJanuary2024(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TeacherRatingswithidJanuary2024", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
 public TeacherRatingswithidJanuary2026(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TeacherRatingswithidJanuary2026", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
   public TeacherRatingswithidJanuary2025(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "TeacherRatingswithidJanuary2025", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public Jan24TeacherRatingswithidSpecificCityWithBuilding(param: any) {
    return this.exec<any>(
      Axios.post(
        BASE_URL + "Jan24TeacherRatingswithidSpecificCityWithBuilding",
        { ProvidedString: param }
      )
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
   public Jan26TeacherRatingswithidSpecificCityWithBuilding(param: any) {
    return this.exec<any>(
      Axios.post(
        BASE_URL + "Jan26TeacherRatingswithidSpecificCityWithBuilding",
        { ProvidedString: param }
      )
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public Jan25TeacherRatingswithidSpecificCityWithBuilding(param: any) {
    return this.exec<any>(
      Axios.post(
        BASE_URL + "Jan25TeacherRatingswithidSpecificCityWithBuilding",
        { ProvidedString: param }
      )
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  
  public GetTeacherGraphSectionWisewithtotalJanuary24EXx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJanuary24EXx", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
    public GetTeacherGraphSectionWisewithtotalJanuary26EXx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJanuary26EXx", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

public GetTeacherGraphSectionWisewithtotalJanuary25EXx(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetTeacherGraphSectionWisewithtotalJanuary25EXx", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
  public GetOverAllResultJanuary24(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResultJanuary24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResultJanuary26(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResultJanuary26", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResultJanuary25(param: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResultJanuary25", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  // Survey April 2022
  public GetOverAllResult1withposissionJanuary24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1withposissionJanuary24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResult1withposissionJanuary26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1withposissionJanuary26", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
  public GetOverAllResult1withposissionJanuary25(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1withposissionJanuary25", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetOverAllResult1January24WithBuilding(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1January24WithBuilding", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
  public GetJanuary25SurveyOverAllWithBuildingCopy(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetJanuary25SurveyOverAllWithBuildingCopy", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
   public GetJanuary26SurveyOverAllWithBuildingCopy(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetJanuary26SurveyOverAllWithBuildingCopy", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetOverAllResult1January24(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1January24", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
   public GetOverAllResult1January26(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetOverAllResult1January26", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  
  public GetSurveyCommentDashEBook2024(param: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetSurveyCommentDashEBook2024", {
        ProvidedString: param,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
}
