export class TelemetryInfo{
    DeviceId: number
    Device: string
    ResourceGroupName: string
    NetworkDeviceIdentifier: string
    SensorType: string
    SensorId: string
    SensorValue: string
    UpdateTime: string
    GpsProtocolName: string
    RowNum: number
    constructor(){
        this.DeviceId= 0;
        this.Device = null;
        this.ResourceGroupName = null;
        this.NetworkDeviceIdentifier = null;
        this.SensorType = null;
        this.SensorId = null;
        this.SensorValue = null;
        this.UpdateTime = null;
        this.GpsProtocolName = null;
        this.RowNum = 0;
    }
}

export class TelemetryData{
    TelemetryDatas: TelemetryInfo[]
    TotalCount: number
    constructor(){
        this.TelemetryDatas = [];
        this.TotalCount = 0;
    }
}

export class TelemetryFilters
{
    rgName: string
    pageNumber: number
    pageSize: number
    identifier: string
    orderBy: string
    where: string
    constructor(){
        this.rgName = null;
        this.pageNumber = 1;
        this.pageSize= 10;
        this.identifier = null;
        this.orderBy = null;
        this.where = null;
    }
}