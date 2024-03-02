export class LocationInfo
{
  DeviceId : Number;
  RowCount:number;  
  Device: string;
  Accuracy: string;
  ResourceGroupName: string;
  DeviceStat: string;
  GpsTime: Date;
  LatTrigger: string;
  UpdateTime:Date;
  Lat: string;
  Long:string;
  LongDouble:number;
  LatDouble:number;
  Alt: string;
  Cell: string;
  Direction: string;
  Speed: string;
  AgeBit: boolean
  NetworkDeviceIdentifier:string;
  constructor()
{
    this.DeviceId=null;    
    this.Accuracy=null;
    this.AgeBit=null;
    this.Alt=null;
    this.Cell=null;
    this.DeviceId=null;
    this.DeviceStat=null;
    this.Direction=null;
    this.UpdateTime=null;
    this.GpsTime=null;
    this.ResourceGroupName=null;
    this.Lat=null;
    this.LatTrigger=null;
    this.Long=null;
    this.Speed=null;
    this.NetworkDeviceIdentifier=null;
}

}