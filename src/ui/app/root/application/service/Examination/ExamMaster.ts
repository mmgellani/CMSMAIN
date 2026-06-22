/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import { default as Axios } from "axios";
import { Store } from "vuex";
import { GlobalConfig } from "../../../../common";
import { StoreService } from "../../../../store";
import { IExaminationExamMaster } from "../../models";

const BASE_URL = GlobalConfig.uri.services + "ExaminationExamMaster/";

export class ExaminationExamMasterService extends StoreService {
  constructor(store: Store<{}>) {
    super(store);
  }
  public GetAll() {
    return this.exec<any>(Axios.get(BASE_URL + "GetAll"))
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetExamApprovalData(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamApprovalData", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetExamScheduleName(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamScheduleName", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetExamTypeNameEx(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamTypeNameEx", { ProvidedString: predicate })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetExamTypeNameCourse(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamTypeNameCourse", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetExamTypeNameClass(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamTypeNameClass", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetExamApprovalDataExDel(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamApprovalDataExDel", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetExamApprovalDataEx2(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamApprovalDataEx2", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetAssessmentExamApprovalData(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetAssessmentExamApprovalData", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetExamSMSApprovalDataPopup(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamSMSApprovalDataPopup", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetExamUnApprovalData(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamUnApprovalData", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetExamUnApprovalDataExam2(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamAssessmentScheduleUnapprovalNameNewList", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetExamResultApprovalData(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamResultApprovalData", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public UpdateBulk(entity: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "UpdateBulk", { ProvidedString: entity })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
    }
    
    public SendSMSApproval(entity: any) {
        return this.exec<any>(
          Axios.post(BASE_URL + "SendSMSApproval", { ProvidedString: entity })
        )
          .then((value) => this.processPayload(value))
          .catch((error) => console.error(error));
      }
  public DeleteExamination(entity: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "DeleteExamination", { ProvidedString: entity })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public UpdateBulkVM(entity: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "UpdateBulkVM", { ProvidedString: entity })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public UnApprovedExam(entity: any) {
    return this.exec<any>(
      Axios.post(BASE_URL + "UnApprovedExam", { ProvidedString: entity })
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
  public GetStudentResultCard(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetStudentResultCard", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public InsertBulkExamAdmin(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "InsertBulkExamAdmin", {
        ProvidedString: predicate,
      })
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
  public GetFindByVM(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetFindByVM", { ProvidedString: predicate })
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
  public GetStudentsExamDetail(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetStudentsExamDetail", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetExamSMSApprovalData(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamSMSApprovalData", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
  public GetExamScheduleNameNewList(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamScheduleNameNewList", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }

  public GetExamAssessmentScheduleNameNewList(predicate: string) {
    return this.exec<any>(
      Axios.post(BASE_URL + "GetExamAssessmentScheduleNameNewList", {
        ProvidedString: predicate,
      })
    )
      .then((value) => this.processPayload(value))
      .catch((error) => console.error(error));
  }
}
