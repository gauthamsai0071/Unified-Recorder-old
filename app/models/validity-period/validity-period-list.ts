export class ValidityPeriods{
    Id?: number;
    Name: string;
    Description: string;
    GroupId:number;    
    GroupName?: string;
    ValidFrom: string;
    ValidTo: string;
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
    Sunday: boolean;

    constructor(){
        this.Id = 0;
        this.Name = '';
        this.Description = '';
        this.GroupId = 0;
        this.GroupName = '';
        this.ValidFrom = '';
        this.ValidTo = '';
        this.Monday = false;
        this.Tuesday = false;
        this.Wednesday = false;
        this.Thursday = false;
        this.Friday = false;
        this.Saturday = false;
        this.Sunday = false;
    }
}