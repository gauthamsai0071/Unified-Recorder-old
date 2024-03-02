export class FilterDataStruct
{
    Actions : string[];    
    Messages:string[];
    ObjectTypes:string[];    
    Dispatchers:string[];
    Groups:string[];
    Sources:string[];    
    ToDate:Date;
    FromDate:Date;    
    TimeZone:number;
    constructor() {
        this.TimeZone=(new Date()).getTimezoneOffset() ;
        this.Actions= [];        
        this.Messages= [];
        this.ObjectTypes= [];
        this.Dispatchers= [];
        this.Sources= [];        
        this.FromDate=null;
        this.ToDate=null;        
    }
}
