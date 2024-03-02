import { Injectable, } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { LocationFilters } from '../../models/device/locationFilters';
import { Inject } from '@angular/core';
import { DropDown } from 'src/app/models/device/dropDown';
import { MAW } from 'src/app/_common/xml-request/maw.xml.request';
import { Constants } from 'src/app/_common/constants.endpoints';
import { LocationInfo } from 'src/app/models/device/LocationInfo';

@Injectable()
export class LocationService {
  constructor(private http: HttpClient, 
    @Inject('Core_BaseURL') private coreBaseURL: string) {              
  }  
  
  getLocationList(filters:LocationFilters): Observable<any>{ 
    
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const params = new HttpParams()
                    .set('LocationFilters', JSON.stringify(filters));
    const body=JSON.stringify(filters);                 
    return this.http.post("api/deviceLocation/search",body,{'headers': headers, 'params': params});
  }

  getFilterValues(filters: string, filterValue:string): Observable<DropDown[]>
  {
    if(filters === "0")
    {
      return this.getDeviceNameFilterValues(filterValue);
    }
    else if(filters === "1"){
      return this.getDeviceIdFilterValues(filterValue);
    }
    else{
      return this.getResourceGroupFilterValues(filterValue);
    }
  }

  getDeviceNameFilterValues(filterValue:string):Observable<DropDown[]>
  {
    const url="api/deviceLocation/deviceNameFilterValues?filterValue="+filterValue;
    return this.http.get<DropDown[]>(url);
  }

  getDeviceIdFilterValues(filterValue:string):Observable<DropDown[]>
  {
    const url="api/deviceLocation/deviceIdFilterValues?filterValue="+filterValue;
    return this.http.get<DropDown[]>(url);
  }

  getResourceGroupFilterValues(filterValue:string):Observable<DropDown[]>
  {
    const url="api/deviceLocation/ResourceGroupFilterValues?filterValue="+filterValue;
    return this.http.get<DropDown[]>(url);
  }

  getLocationFiltes():Observable<LocationFilters>
  {  
    return this.http.get<LocationFilters>("api/deviceLocation/deviceFilters");
  }

  getDeviceIds4Rg(rgId:Number):Observable<any>
  {  
    return this.http.get<any>(`$api/deviceLocation/deviceIds${rgId}`);
  }

  
  getDeviceIdsForAllRgs():Observable<any>
  {  
    return this.http.get<any>("api/deviceLocation/deviceIds");
  }

  GetArchivedMappingData():Observable<any>
  {  
    return this.http.get<any>("api/deviceLocation/archivedMappingData");
  }

  getAllDevicesData(stratdate:string,enddate:string,maxrows:string): Observable<any>{
    const httpHeaders = new HttpHeaders()
                        .set('Content-Type', 'text/xml');
    const data= MAW.XML.Requests.MAWService.getALlDevicesDataRequest
        .replace("{startdatetime}",stratdate)
        .replace("{enddatetime}",enddate)        
        .replace("{maxrows}",maxrows);
    return this.http.post(Constants.EndPoints.ArchiveService.GetAllDevicesEndPoint, data,{ headers: httpHeaders,    
        responseType: 'text' }); 
  }
  
  
  getAllDevicesDataByPage(stratdate:string,enddate:string,maxrows:string,pageNumber:string): Observable<any>{
    const httpHeaders = new HttpHeaders()
                        .set('Content-Type', 'text/xml');
 const data= MAW.XML.Requests.MAWService.getAllDevicesDataByPageRequest
    .replace("{startdatetime}",stratdate)
    .replace("{enddatetime}",enddate)        
    .replace("{pagesize}",pageNumber)        
    .replace("{maxrows}",maxrows);
    return this.http.post(Constants.EndPoints.ArchiveService.GetAllDevicesEndPoint, data,{ headers: httpHeaders,    
        responseType: 'text' }); 
  }
  
  getDevicesData(deviceIds:string,
    startDate:string,
    endDate:string,
    rowCount:string
    ): Observable<any>{
    const httpHeaders = new HttpHeaders()
                        .set('Content-Type', 'text/xml');

  const data= MAW.XML.Requests.MAWService.getDevicesDataRequest
                        .replace("{devicesIdsdata}",deviceIds.toString())
                        .replace("{startdatetime}",startDate)
                        .replace("{enddatetime}",endDate)        
                        .replace("{maxrows}",rowCount);
                        
    return this.http.post(Constants.EndPoints.ArchiveService.GetDeviceEndPoint, data,{ headers: httpHeaders,
        responseType: 'text' }); 
  }

  getDevicesDataByPage(deviceIds:string,
    startDate:string,
    endDate:string,
    rowCount:string,
    pageNumber:string
    ): Observable<any>{
    const httpHeaders = new HttpHeaders()
                        .set('Content-Type', 'text/xml');

  const data= MAW.XML.Requests.MAWService.getDevicesDataByPageRequest
                        .replace("{devicesIdsdata}",deviceIds.toString())
                        .replace("{startdatetime}",startDate)
                        .replace("{enddatetime}",endDate)        
                        .replace("{pagesize}",pageNumber)        
                        .replace("{maxrows}",rowCount);
                        
    return this.http.post(Constants.EndPoints.ArchiveService.GetDeviceEndPoint, data,{ headers: httpHeaders,
        responseType: 'text' }); 
  }
   
}
