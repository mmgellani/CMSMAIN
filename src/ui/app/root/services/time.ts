
import { Store } from "vuex";
import { GlobalConfig } from "../../common";
import { IPayload } from "../../model";
import { RootStoreTypes } from "../store";
import { StoreService } from "../../store";

const BASE_URL = GlobalConfig.uri.content;

export interface TimeObject {
  year: string,
  month: string,
  day: string,
  hours: string,
  minutes: string,
  seconds: string
}
export interface weatherObject {
  temp: number,
  description: string
}

export class TimeService {

  public year: number = 2020;
  public month: number = 1;
  public day: number = 1;

  public yearString: string = "2020";
  public monthString: string = "01";
  public dayString: string = "01";


  public hours: number = 0;
  public minutes: number = 0;
  public seconds: number = 0;

  public hoursString: string = "00";
  public minutesString: string = "00";
  public secondsString: string = "00";

  public curTime: string = null;
  public curDate: string = null;

  getHoursString() {
    if (this.hours > 9) {
      return "" + this.hours;
    }
    else {
      return "0" + this.hours;
    }
  }

  getMinutesString() {
    if (this.minutes > 9) {
      return "" + this.minutes;
    }
    else {
      return "0" + this.minutes;
    }
  }

  getSecondsString() {
    if (this.seconds > 9) {
      return "" + this.seconds;
    }
    else {
      return "0" + this.seconds;
    }
  }

  getYearString() {
    return "" + this.year;
  }

  getMonthString() {
    if (this.month > 9) {
      return "" + this.month;
    }
    else {
      return "0" + this.month;
    }
  }

  getDayString() {
    if (this.day > 9) {
      return "" + this.day;
    }
    else {
      return "0" + this.day;
    }
  }

  createFullTime() {
    return this.hoursString + ":" + this.minutesString + ":" + this.secondsString;
  }

  createFullDate() {
    return this.dayString + "/" + this.monthString + "/" + this.yearString;
  }

  getCurrentDateTime() {
    var d = new Date();

    this.year = d.getFullYear();
    this.month = d.getMonth() + 1;
    this.day = d.getDate();

    this.yearString = this.getYearString();
    this.monthString = this.getMonthString();
    this.dayString = this.getDayString();

    this.hours = d.getHours();
    this.minutes = d.getMinutes();
    this.seconds = d.getSeconds();
    this.hoursString = this.getHoursString();
    this.minutesString = this.getMinutesString();
    this.secondsString = this.getSecondsString();

    // this.curTime = d.toLocaleTimeString();  // -> "7:38:05 AM"
    // this.curTime = this.createFullTime();
    // this.curDate = this.createFullDate();

    return {
      year: this.yearString,
      month: this.monthString,
      day: this.dayString,
      hours: this.hoursString,
      minutes: this.minutesString,
      seconds: this.secondsString
    };

  }
}
