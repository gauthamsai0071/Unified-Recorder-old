export class Group {
    Id: number;
    Name: string;
    Description: string;
    ParentName: string;

    constructor() {
        this.Id = 0;
        this.Name = '';
        this.Description = '';
        this.ParentName = '';
    }
}