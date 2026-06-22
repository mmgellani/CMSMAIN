/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { default as Axios } from 'axios';
import { Store } from 'vuex';
import { GlobalConfig } from '../../../../common';
import { StoreService } from '../../../../store';
import { ISetupCity } from '../../models';

const BASE_URL = GlobalConfig.uri.services + 'Quiz/';

export class QuizService extends StoreService {
    constructor(store: Store<{}>) {
        super(store);
    }

    public SaveQuizConfigration(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'SaveQuizConfigration', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public SaveLeagueConfigration(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'SaveLeagueConfigration', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetLeagueList(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetLeagueList', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetLeagueListData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetLeagueListData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetLeagueListDataWithoutLeague(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetLeagueListDataWithoutLeague', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetCityConfigrationData(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetCityConfigrationData', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetSessionBasedSummery(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetSessionBasedSummery', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetQuizSummeryDataCityWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetQuizSummeryDataCityWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetQuizSummeryDataQuizWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetQuizSummeryDataQuizWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetQuizSummeryDataSubCityWise(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetQuizSummeryDataSubCityWise', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public GetArvoSubjectList(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetArvoCourseForQuiz', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public QuizTopStudentSession(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'QuizTopStudentSession', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public QuizTopStudentSessionEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'QuizTopStudentSessionEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public QuizTopStudentSessionCourse(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'QuizTopStudentSessionCourse', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public QuizTopStudentSessionCourseEx(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'QuizTopStudentSessionCourseEx', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public QuizWeeklyPerformanceResponse(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'QuizWeeklyPerformanceResponse', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public QuizSubjectWisePerformance(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'QuizSubjectWisePerformance', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public QuizCityWisePerformance(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'QuizCityWisePerformance', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public QuizTimeWiseOverAllPerformance(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'QuizTimeWiseOverAllPerformance', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }
    public QuizTimeWiseOverAllPerformanceSessionBased(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'QuizTimeWiseOverAllPerformanceSessionBased', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public QuizSubCityOverAllPerformance(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'QuizSubCityOverAllPerformance', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }

    public GetLeagueListSessionBased(predicate: string) {
        return this.exec<any>(Axios.post(BASE_URL + 'GetLeagueListSessionBased', { ProvidedString: predicate }))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


    public GetQuizClass() {
        return this.exec<any>(Axios.get(BASE_URL + 'GetQuizClass'))
            .then((value) => this.processPayload(value))
            .catch((error) => console.error(error));
    }


}