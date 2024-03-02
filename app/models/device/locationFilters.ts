import { DropDown } from './dropDown';

export class LocationFilters
{
     FilterId : string;  
     FilterValue: string;  
     StartDate:Date;
     EndDate:Date;
     DateRange:string;
     IsExport :boolean;
     PageNumber:number;
     PageSize: number;
     RowCount:number;
     Options1:DropDown[];
     Options2:DropDown[];
     Options3:DropDown[];
    constructor()
    {
        this.FilterId="0";
        this.DateRange=null;
        this.FilterValue=null;
        this.StartDate=null;
        this.EndDate=null;
        this.IsExport=false;        
        this.Options1=[];
        this.Options2=[];
        this.Options3=[];
        this.PageNumber=1;
        this.PageSize=10;
    }
}

export class ResultSets
{
    static  ALL_DEVICES_RESULTSET="GetAllDevicesDataResult";
    static  DEVICES_RESULTSET="GetDevicesDataResult";
    static  ALL_DEVICES_BYPAGE_RESULTSET="GetAllDevicesDataByPageResult";
    static  DEVICES_BYPAGE_RESULTSET="GetDevicesDataByPageResult";
}
