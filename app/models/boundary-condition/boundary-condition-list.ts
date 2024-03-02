import { Time } from '@angular/common';

export class BoundaryCondition{
    Id?: number;
    Name: string;
    Description: string;
    ThresholdType: string;
    EventType?: string;
    Severity?: string;
    ReraisePeriod?: string;
    AckReraisePeriod?: string;
    ReraiseOverride?: string;
    AckOverride?: string;
    MinSpeed?: string;
    MaxSpeed?: string;
    SpeedTestType?: string;
    MissingUpdateTime?: string;
    ValidFrom?: string;
    ValidTo?: string;
    GroupId?: string;
    GroupName?: string;
    ElapsedTime?: string;
    LowerLimit?: string;
    UpperLimit?: string;
    TimeBeforeLockDown?: string;
    TalkgroupId? : string;
    Priority? : string;
    Message? : string;

    constructor() {
        this.Id = 0;        
        this.Name = '';
        this.Description = '';
        this.ThresholdType = null;
        this.EventType = null;
        this.Severity = null;
        this.ReraisePeriod = null;
        this.AckReraisePeriod = null;
        this.ReraiseOverride = 'false';
        this.AckOverride = 'false';
        this.MinSpeed = null;
        this.MaxSpeed = null;
        this.SpeedTestType = '';
        this.MissingUpdateTime = '';
        this.ValidFrom = null;
        this.ValidTo = null;
        this.GroupId = null;
        this.GroupName = null;
        this.ElapsedTime = null;
        this.LowerLimit = null;
        this.UpperLimit = null;
        this.TimeBeforeLockDown = null;
        this.TalkgroupId = null;
        this.Priority = null;
        this.Message = null;
    }
}