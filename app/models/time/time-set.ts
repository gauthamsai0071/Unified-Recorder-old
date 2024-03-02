import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

export interface LabeledTime {
  time: NgbTimeStruct;
  label: string;
}

export type TimeSet = LabeledTime[];

export interface TimeSetGenerator {
  generate(): TimeSet;
}
