import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ServerityService } from "../../services/severity/severity.service";
import { GroupService } from "../../services/group/group.service";
import { DOMParser } from 'xmldom';
import { ToastService } from "@msi/cobalt";
import { Group } from '../../models/group/group';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from "rxjs";
import { EventType } from "../../models/event-type/event-type-list";
import * as _ from 'lodash';


@Component({
  selector: 'app-manage-severity-level',
  templateUrl: './manage-severity-level.component.html',
  styleUrls: ['./manage-severity-level.component.scss']
})
export class ManageSeverityLevelComponent implements OnInit {
  severityLevelForm: FormGroup = null;
  formResetting: boolean = true;
  showProgress: boolean; 
    
  groups: Group[] = [];
  id?: number = null; 

  get form() { return this.severityLevelForm.controls; }

  constructor(private formBuilder: FormBuilder,
    private toastService: ToastService,    
    private serverityService: ServerityService,
    private groupService: GroupService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef) {
      this.showProgress = true;
        if (this.activatedRoute.snapshot.params.id) {
            this.id = Number(this.activatedRoute.snapshot.params.id);
        }
     }

     ngOnInit(): void {
      let severityLevel: EventType = null;

      if (this.id !== null) {
          forkJoin(
              this.serverityService.getSeverityLevels(),
              this.serverityService.getSeverityAvailableGroups(this.id.toString())
              ).subscribe(response => {
                  severityLevel = this.getSeverities(response[0])                
                  this.setGroups(response[1])            
                  const group = _.filter(this.groups, item => item.Name.trim().toUpperCase() === severityLevel.GroupName.toUpperCase().trim());

                  if (group.length > 0) {
                    severityLevel.GroupId = group[0].Id;
                  }

                  this.buildEventTypeForm(severityLevel);
                  this.showProgress = false;
                  this.changeDetectorRef.detectChanges();
              }, error => {

              });
      } else {
          this.groupService.getGroups().subscribe(response => {
              this.groups = response;
              severityLevel = new EventType();
              this.buildEventTypeForm(severityLevel);
              this.showProgress = false;
          })            
      }        
  }

  save(): void {
      this.formResetting = false;
      this.severityLevelForm.updateValueAndValidity();

      if (this.severityLevelForm.invalid) {
          return;
      }

      this.showProgress = true;

      if(this.id === null)
      {
          this.addSeverity();
      }
      else
      {
          this.updateSeverity();
      }
            
  }

  addSeverity(): void    {
      this.serverityService.addNewSeverity(this.severityLevelForm.value.severityName, this.severityLevelForm.value.groupId).subscribe(
          response => {
              const xmlResponse = new DOMParser().parseFromString(response);                 
              const result = (xmlResponse.getElementsByTagName("addSeverityLevelResponse")[0]).firstChild.firstChild.nodeValue.toString().toLowerCase();
              this.showProgress = false;
              if (result === "ok") {
                  this.toastService.success("Severity Level Added Successfully", undefined, 
                                          { autoDismiss: 5000, closeButton: true });
                  this.router.navigate(['/severity']);
              } else if (result === "objectwiththisnameexists") {
                  this.toastService.error("Severity Level with same name already exists", undefined, { autoDismiss: 5000, closeButton: true });
              }
          }, (error) => {
              this.toastService.error("Unexpected Error encountered while adding Severity Level", undefined, { autoDismiss: 5000, closeButton: true });
              this.showProgress = false;
          }
      )  
  }

  updateSeverity() : void  {
      this.serverityService.updateSeverity(this.id, 
          this.severityLevelForm.value.severityName,this.severityLevelForm.value.groupId).subscribe(
          response => {
              const xmlResponse = new DOMParser().parseFromString(response);                 
              const result = (xmlResponse.getElementsByTagName("updateSeverityResponse")[0]).firstChild.firstChild.nodeValue.toString().toLowerCase();
              this.showProgress = false;
              if (result === "ok") {
                  this.toastService.success("Severity Level Updated Successfully", undefined, 
                                          { autoDismiss: 60000, closeButton: true });
                  this.changeDetectorRef.detectChanges();
                  this.router.navigate(['/severity']);
              } else if (result === "objectwiththisnameexists") {
                  this.toastService.error("Severity Level with same name already exists", undefined, { autoDismiss: 5000, closeButton: true });
              }
          }, (error) => {
              this.toastService.error("Unexpected Error encountered while updating Severity Level", undefined, { autoDismiss: 5000, closeButton: true });
              this.showProgress = false;
          }
      )
  }

  private setGroups(response: string) : void {
      const xmlResponse = new DOMParser().parseFromString(response); 
      const result = xmlResponse.getElementsByTagName("getSeverityAvailableGroupsResult")[0];

      _.each(result.childNodes, element => {
          const group = new Group();

          group.Id = element.childNodes[0].firstChild.nodeValue;
          group.Name = element.childNodes[1].firstChild.nodeValue;
          this.groups.push(group); 
      });         
  }

  private getSeverities(response: string): EventType {
      const xmlResponse = new DOMParser().parseFromString(response); 
      const result = xmlResponse.getElementsByTagName("getSeverityLevelsResult")[0];

      let severityLevel = null;
      for(let index=0; index<result.childNodes.length; index++) {
          if (Number(result.childNodes[index].childNodes[0].firstChild.nodeValue) === this.id) {                
                severityLevel = new EventType();
                severityLevel.Id = this.id;
                severityLevel.Name = result.childNodes[index].childNodes[1].firstChild.nodeValue;
                severityLevel.GroupName = result.childNodes[index].childNodes[2].firstChild.nodeValue;
              return severityLevel;
          }
      }

      return null;
  }

  private buildEventTypeForm(SeverityLevel: EventType) {
      this.severityLevelForm = this.formBuilder.group({
            severityName: [SeverityLevel.Name, Validators.required],
            groupId:[SeverityLevel.GroupId, Validators.required]
      }); 
  }

}
