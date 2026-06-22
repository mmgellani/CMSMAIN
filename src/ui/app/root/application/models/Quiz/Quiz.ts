
export interface IQuizConfigration {
	sessionId: string;
	sessionName: string;
	cityId: string;
	cityName: string;
	classId: string;
	className: string;
	configurationId: string;
	fromDate: string;
	toDate: string;
	testFrequency: number;
	calendarFromDate: string;
	calendarToDate: string;
	statusId: number;
	isProcessed: number;
	isActive: number;
	processedOn: string;
	quizName: string;
	timePerQuestion: number;
	marksPerQuestion: number;

}
export interface IQuizConfigrationInsert {
	sessionId: string;
	cityId: string;
	classId: string;
	configurationId: string;
	fromDate: string;
	toDate: string;
	testFrequency: number;
	calendarFromDate: string;
	calendarToDate: string;
	statusId: number;
	isProcessed: number;
	isActive: number;
	processedOn: string;
	quizName: string;
	timePerQuestion: number;
	marksPerQuestion: number;
	notificationDescription: string;
}

export interface IQuizLeague {
	sessionId: string;
	sessionName: string;
	cityId: string;
	cityName: string;
	classId: string;
	className: string;
	leagueId: string;
	leagueName: string;
	configurationId: string;
	quizName: string;
	statusId: number;


}

export interface ILeague {
	sessionId: string;
	cityId: string;
	classId: string;
	leagueId: string;
	fullName: string;
	statusId: number;

}
export interface IGetSessionBasedSummery {
	id: number;
	totalStudent: number;
	totalPush: number;
	totalSubmmited: number;
	responseRate: number;

}
export interface IGetSessionBasedSummeryCityWise {
	id: number;
	cityName: string;
	totalStudent: number;
	totalPush: number;
	totalSubmmited: number;
	responseRate: number;

}
export interface IGetSessionBasedSummeryQuizWise {
	id: number;
	quizName: string;
	totalStudent: number;
	totalPush: number;
	totalSubmmited: number;
	responseRate: number;

}
export interface ILeagueAddModel {
	sessionId: string;
	cityId: string;
	classId: string;
	statusId: number;

}

export interface ILeagueInsertModel {
	sessionId: string;
	cityId: string;
	classId: string;
	statusId: number;
	fromdate: string;
	todate: string;
	quizName: string;
}
export interface IArvoSubject {
	subjectName: string;
} 

export interface IQuizTopStudentSession {
	id: string;  
	serialNumber: number;
	admissionFormId?: string;  
	rollNo: string;
	studentName: string;
	city: string;
	configurationId?: string;  
	leagueId?: string; 
	timeDifference: string;
	percentage: string;
	courseQuestionCount: number;  
	responseRate: number;  
  }
  
  export interface IQuizTopStudentSessionCourse {
	id: string;  
	serialNumber: number;
	admissionFormId?: string;  
	rollNo: string;
	studentName: string;
	city: string;
	configurationId?: string;  
	leagueId?: string;  
	timeDifference: string;
	percentage: string;
	courseQuestionCount: number;  
	responseRate: number;  
	course: string;  
  }
  

  export interface IQuizTopStudentSessionEx {
	id: string;  
	serialNumber: number;
	admissionFormId?: string;  
	rollNo: string;
	studentName: string;
	city: string;
	configurationId?: string;  
	leagueId?: string; 
	timeDifference: string;
	percentage: string;
	courseQuestionCount: number;  
	responseRate: number;  
	averageTime: string;
  }
  
  export interface IQuizTopStudentSessionCourseEx {
	id: string;  
	serialNumber: number;
	admissionFormId?: string;  
	rollNo: string;
	studentName: string;
	city: string;
	configurationId?: string;  
	leagueId?: string;  
	timeDifference: string;
	percentage: string;
	courseQuestionCount: number;  
	responseRate: number;  
	course: string; 
	averageTime: string;
 
  }

  export interface IQuizWeeklyPerformanceResponse {
	id: string;   
	quizName?: string;   
	totalStudent: number;  
	totalPush: number;  
	totalSubmmited: number;  
	responseRate: number;  
	percentage: number;   
  }         

  
  export interface IQuizSubjectWisePerformance {
	id: string;   
	percentage?: string;    
	course?: string;    
  }  
  export interface IQuizCityWisePerformance {
	id: string;   
	percentage?: string;    
	city?: string;    
  }  
  export interface IQuizTimeWiseOverAllPerformance {
	id: string;   
	percentage?: string;    
	city?: string;    
	time?: string;    
  }  
  export interface IQuizSubCityOverAllPerformance {
	id: string;   
	subCity?: string;    
	totalMarks?: number;    
	obtainedMarks?: number; 
	percentage   ?: string; 
  }  

 