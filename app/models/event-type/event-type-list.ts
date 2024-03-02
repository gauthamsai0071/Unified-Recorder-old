export class EventType {
    Id: number;
    Name: string;
    GroupId?: number;
    GroupName: string;    

    constructor() {
        this.Id = 0;
        this.GroupId = null;
        this.Name = '';
        this.GroupName = '';        
    }
}