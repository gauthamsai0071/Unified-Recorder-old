import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { DOMParser } from 'xmldom';
import { ToastService } from "@msi/cobalt";
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from "rxjs";
import * as _ from 'lodash';
import { ThrottlingService } from "../../services/maintenance/throttling";
import { Throttling, ThrottlingConfiguration} from "../../models/maintenance/throttlingconfig";

@Component({  
  templateUrl: './throttling-configuration.component.html',
  styleUrls: ['./throttling-configuration.component.scss']
})
export class ThrottlingConfigurationComponent implements OnInit {
  showProgress: boolean; 
  formResetting: boolean = true;
  throttling : Throttling;
  throttlingConfiguration : ThrottlingConfiguration;
  throttlingForm: FormGroup = null;
  showInterval: boolean = false;
  showDistance: boolean = false;



  get form() { return this.throttlingForm.controls; } 

  constructor(private formBuilder: FormBuilder,
    private toastService: ToastService,    
    private throttlingService: ThrottlingService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.showProgress = true;
    this.formResetting = true; 
    this.throttlingForm = null;
    this.changeDetectorRef.detectChanges();

    forkJoin(this.throttlingService.getDropDownValues(),
    this.throttlingService.getThrottlingConfig()).subscribe(response =>{
      this.throttling = response[0];
      this.throttlingConfiguration = response[1];
      this.buildthrottlingForm();
      if(this.throttlingConfiguration.Interval != "None")
        this.showInterval = true;
      if(this.throttlingConfiguration.Distance != "None")
        this.showDistance = true;
      
      this.showProgress = false;
    });

    
  }

  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges();
  }

  private buildthrottlingForm(){
    this.throttlingForm = this.formBuilder.group({
      chkInterval: [this.throttlingConfiguration.Interval != "None" ? true : false],
      rbInterval: [this.throttlingConfiguration.Interval == "Absolute" ? "Absolute" : "Relative"],      
      absoluteVal: [this.throttlingConfiguration.IntervalAbsoluteVal != null ? this.throttlingConfiguration.IntervalAbsoluteVal:''],
      relativeVal: [this.throttlingConfiguration.IntervalRelativeVal],
      chkDistance: [this.throttlingConfiguration.Distance != "None" ? true :  false],
      rbDistance: [this.throttlingConfiguration.Distance == "Minimum" ? "Minimum" :  "Maximum"],      
      minimumVal: [this.throttlingConfiguration.DistanceMinimumVal != null ? this.throttlingConfiguration.DistanceMinimumVal: ''],
      maximumVal: [this.throttlingConfiguration.DistanceMaximumVal != null ? this.throttlingConfiguration.DistanceMaximumVal: '']
    })
  }

  isEnableInterval():void{
    this.throttlingForm.get('chkInterval').valueChanges.subscribe((value) => {
      value == true ? this.showInterval = true : this.showInterval = false
    });
  }

  isEnableDistance():void{
    this.throttlingForm.get('chkDistance').valueChanges.subscribe((value) => {
      value == true ? this.showDistance = true : this.showDistance = false
    });
  }

  getThrottlingConfiguration(){
    this.throttlingService.getThrottlingConfig().subscribe(response => {
      this.throttlingConfiguration = response;
      this.buildthrottlingForm();
    });
  }

  update(): void{
    this.formResetting = false;
    this.throttlingForm.updateValueAndValidity();
    this.showProgress = true;

    if (this.throttlingForm.invalid) {
        return;
    }

    let throttlingConfig = new ThrottlingConfiguration();
    if(this.showInterval)
    {
      throttlingConfig.Interval = this.throttlingForm.get('rbInterval').value;
      if(this.throttlingForm.get('rbInterval').value == "Absolute")
      {
        throttlingConfig.IntervalAbsoluteVal = this.throttlingForm.get('absoluteVal').value;
        throttlingConfig.IntervalRelativeVal = "4";
      }
      else
      {
        throttlingConfig.IntervalAbsoluteVal = "20min";
        throttlingConfig.IntervalRelativeVal = this.throttlingForm.get('relativeVal').value;
      }
    }
    else
    {
      throttlingConfig.Interval = "None";
      throttlingConfig.IntervalAbsoluteVal = "20min";
      throttlingConfig.IntervalRelativeVal = "4";
    }
      

    
    if(this.showDistance)
    {
      throttlingConfig.Distance = this.throttlingForm.get('rbDistance').value;
      if(this.throttlingForm.get('rbDistance').value == "Minimum")
      {
        throttlingConfig.DistanceMinimumVal = this.throttlingForm.get('minimumVal').value;
        throttlingConfig.DistanceMaximumVal = "4";
      }
      else
      {
        throttlingConfig.DistanceMinimumVal = "1.00";
        throttlingConfig.DistanceMaximumVal = this.throttlingForm.get('maximumVal').value;
      }
    }
    else
    {
      throttlingConfig.Distance = "None";
      throttlingConfig.DistanceMinimumVal = "1.00";
      throttlingConfig.DistanceMaximumVal = "4";
    }
    
    this.throttlingService.updateThrottlingConfig(throttlingConfig).subscribe(response => {
      if(response){
        this.toastService.success("LIP Throttling Config Parameters Updated Successfully", undefined, 
                                            { autoDismiss: 5000, closeButton: true });
        this.changeDetectorRef.detectChanges();
        this.getThrottlingConfiguration();
        this.showProgress = false;
      }
    }, (error) => {
      this.toastService.error("Unexpected Error encountered while updating LIP Throttling Config Parameters", undefined, {autoDismiss: 5000, closeButton: true });
      this.showProgress = false;
    });

  }

  reset():void{
    this.formResetting = true;
    this.throttlingForm.reset();
    this.getThrottlingConfiguration();
  }

}
