/**
 * Copyright (C) 2018-2019 Motorola Solutions, Inc.
 */

import { NgbDate, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbTime } from '@ng-bootstrap/ng-bootstrap/esm5/timepicker/ngb-time';
import * as _moment from 'moment';
import { TimeSet, TimeSetGenerator } from '../../models/time/time-set';
const moment = _moment;

export function ngbDateFromMoment(m: _moment.Moment): NgbDate {
  return new NgbDate(m.get('y'), m.get('M') + 1, m.get('D'));
}

export function ngbTimeFromMoment(m: _moment.Moment): NgbTimeStruct {
  return new NgbTime(m.get('h'), m.get('m'), m.get('s'));
}

export function momentFromNgbTime(time: NgbTimeStruct) {
  return moment(time.hour + ':' + time.minute + ':' + time.second, 'hh:mm:ss');
}

export function momentFromNgbDateAndTime(date: NgbDateStruct, time: NgbTimeStruct) {
  return moment(date.year + '/' + date.month + '/' + date.day + ' ' + time.hour + ':' + time.minute + ':' + time.second, 'YYYY/MM/DD hh:mm:ss');
}

export function momentFromNgbDate(date: NgbDateStruct) {
  return moment(date.year + '/' + date.month + '/' + date.day, 'YYYY/MM/DD');
}

export function ngbTimeFromHMS(hour: number, minute?: number, second?: number): NgbTimeStruct {
  return new NgbTime(hour, minute || 0, second || 0);
}

export function formatDate(date: NgbDateStruct, format: string): string {
  return moment(date.year + '/' + date.month + '/' + date.day, 'YYYY/MM/DD').format(format);
}

export function formatTime(time: NgbTimeStruct, format: string): string {
  const hour = time.hour || 0;
  const minute = time.minute || 0;
  const second = time.second || 0;
  return moment(hour + ':' + minute + ':' + second, 'hh:mm:ss').format(format);
}

export function minNgbTime(): NgbTimeStruct {
  return { hour: 0, minute: 0, second: 0 };
}

export function maxNgbTime(): NgbTimeStruct {
  return { hour: 23, minute: 59, second: 59 };
}

export function ngbTimeDuration(from: NgbTimeStruct, to: NgbTimeStruct) {
  let hours = to.hour - from.hour;
  let minutes = to.minute - from.minute;
  let seconds = to.second - from.second;

  if (seconds < 0) {
    minutes--;
    seconds += 60;
  }

  if (minutes < 0) {
    hours--;
    minutes += 60;
  }

  return new NgbTime(hours, minutes, seconds);
}

export class DefaultTimeSetGenerator implements TimeSetGenerator {
  protected from: number = 0;
  protected to: number = 23;
  protected step: number = 1;
  protected labelGenerator: (NgbTimeStruct) => string = (time) => formatTime(time, 'HH:mm:ss');

  generate(): TimeSet {
    const timeSet: TimeSet = [];
    for (let i = this.from; i <= this.to; i += this.step) {
      const hour = Math.floor(i);
      for(let j=0;j<60;j++)
      {
       for(let k=0;k<60;k++)
      {
          const time = ngbTimeFromHMS(hour, j, k);
          const label = this.labelGenerator(time);
          timeSet.push({ time, label });
        }
      }
    }
    return timeSet;
  }
}
