export class Action{
    Id?: number;
    DeviceName?: string;
    Send2EvtOrg?: string;
    GroupID?: number;
    GroupName?: string;
    URL?: string;
    Message?: string;
    Parameters?: string;    
    Name?: string;
    Distance?: number;
    MinUpdateTime?: number;
    MaxUpdateTime?: number;
    Triggers?: string;
    ActionType?: string;
    AlertCode?: number = 0;
    FaultDescription?: string;
    ExePath?: string;

    constructor(){
        this.Id = 0;
        this.DeviceName = '';
        this.Send2EvtOrg = 'false';
        this.GroupID = 0;
        this.GroupName = '';
        this.URL = '';
        this.Message = '';
        this.Parameters = '';
        this.Name = '';
        this.Distance = 0;
        this.MinUpdateTime = 0;
        this.MaxUpdateTime = 0;
        this.Triggers = '';
        this.ActionType = '';
        this.AlertCode = 0;
        this.FaultDescription = '';
        this.ExePath = '';
    }
}