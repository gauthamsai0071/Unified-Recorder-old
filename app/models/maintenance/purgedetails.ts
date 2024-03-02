export class PurgeDetails{
    TotalRecords:number;
    Oldest:Date;
    Newest:Date;

    constructor(){
        this.TotalRecords = 0;
        this.Oldest = null;
        this.Newest = null;
    }
}