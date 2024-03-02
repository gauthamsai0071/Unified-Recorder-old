export class Mappings {
    Id: number;
    Name: string;

    constructor() {
        this.Id = 0;
        this.Name = '';        
    }
}

export class AttributesData{
    devices: Mappings[];
    deviceStates: Mappings[];
    areas: Mappings[];
    threshold: Mappings[];
    timePeriod: Mappings[];
    triggers: Mappings[];

    constructor() {
        this.devices = [];
        this.deviceStates = [];  
        this.areas = [];
        this.threshold = []; 
        this.timePeriod = [];
        this.triggers = [];       
    }
}

export class PurgeDatas{
    purgeData: Mappings[];
    TotalRecords: number;

    constructor() {
        this.purgeData = [];
        this.TotalRecords = 0;        
    }
}
