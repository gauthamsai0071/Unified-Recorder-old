export class AuditLogs
{
    Action : string;
    Source:string;
    Message:string;
    ObjectType:string;
    LogDate?:Date;
    DispatcherName:string;
    Group:string;
    constructor() {
        this.Action= '';
        this.Source= '';
        this.Message= '';
        this.ObjectType= '';
        this.DispatcherName= '';
        this.Group= '';
        this.LogDate=null;
    }
}

export class AuditLogsData
{
    AuditLog: AuditLogs[];
    TotalCount: number;
    constructor(){
        this.AuditLog = [];
        this.TotalCount = 0;
    }
}