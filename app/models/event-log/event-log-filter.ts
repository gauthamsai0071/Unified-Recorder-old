export class LogEventFilter {
    IsOrigFilterApplied: boolean;
    Originators?: string;
    IsETFilterApplied: boolean;
    EventTypes?: string;
    IsSevFilterApplied: boolean;
    Severities?: string;
    StartDate: Date;
    EndDate: Date;
    Ack: string;
    PageSize: number;
    PageNumber: number;

    constructor() {
        let today = new Date();
        let yesterday = new Date(today);
        yesterday.setFullYear(yesterday.getFullYear() - 1)
        this.IsOrigFilterApplied = false;
        this.Originators = '';
        this.IsETFilterApplied = false;
        this.EventTypes = ''; 
        this.IsSevFilterApplied = false;
        this.Severities = '';
        this.StartDate = new Date(yesterday.getTime() - 36000*1000);
        this.EndDate = new Date(today.getTime() - 1000);
        this.Ack = 'Both';
        this.PageSize = 10;
        this.PageNumber = 1;     
    }
}