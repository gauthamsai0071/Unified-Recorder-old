import { EventType } from '../event-type/event-type-list';

export class ConditionFilters
{
    ThresholdType? : any;    
    EventType?:any;
    Severity?:any;    
    Name?: any ;
    constructor() {        
        this.ThresholdType= [];        
        this.EventType= [];
        this.Severity= [];                
        this.Name=[];                
    }
}