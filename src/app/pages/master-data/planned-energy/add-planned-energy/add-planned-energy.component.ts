import { Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { iif, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { BroadcastService } from '../../../../shared/broadcast.service';
import { CommonUtilService } from '../../../../shared/common-util.service';
import { ApiConstant } from '../../../../shared/api-constant.enum';
import { AppConstant } from '../../../../shared/app-constant.enum';
import * as moment from 'moment';

@Component({
  selector: 'app-add-planned-energy',
  templateUrl: './add-planned-energy.component.html',
  styleUrls: ['./add-planned-energy.component.scss']
})
export class AddPlannedEnergyComponent implements OnInit, OnDestroy {

  public isForEdit: boolean = false;
  public isSaving: boolean = false;
  public isLoading: boolean = false;
  public isSiteCodeDDOpen: boolean = false;
  public siteCodeList: any = null;
  public selSiteCode: any = null;

  public masterForm!: FormGroup;

  private selPlannedEnergy: any = null;
  private plannedEnergyId: any = null;

  constructor(
    private util: CommonUtilService,
    private broadcast: BroadcastService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPlannedEnergyComponent>,
    private formBuilder: FormBuilder
  ) { }

  get mf() {
    return (this.masterForm as any).controls;
  }

  ngOnInit(): void {
    this.init();
    this.initForm();
    this.getData();
  }

  ngOnDestroy(): void {

  }

  init() {
    this.loadData();
  }

  initForm() {
    this.masterForm = this.formBuilder.group({
      'solarOutputEnergy': [null],
      'solarRunHrs': [null],
      'dgEnergy': [null],
      'dgRunHrs': [null],
      'mdgRunHrs': [null],
      'battDisEnergy': [null],
      'battRunHrs': [null],
      'battChargingEnergy': [null],
      'battChargingRunHrs': [null],
      'solarBattRunHrs': [null],
      'solarDGRunHrs': [null],
      'teleRunHrs': [null],
      'communityLoadEnergy': [null],
      'communityLoadRunHrs': [null],
      'opco1': [null],
      'opco1RunHrs': [null],
      'opco2': [null],
      'opco2RunHrs': [null],
      'opco3': [null],
      'opco3RunHrs': [null],
      'opco4': [null],
      'opco4RunHrs': [null]
    });
  }

  getData() {
    if (window.localStorage.getItem('selPlannedEnergy')) {
      this.selPlannedEnergy = JSON.parse((window as any).localStorage.getItem('selPlannedEnergy'));
      this.setFormData();
      this.isForEdit = true;
    } else {
      this.isForEdit = false;
    }
  }

  setFormData() {
    this.plannedEnergyId = this.selPlannedEnergy.id;
    this.masterForm.controls['solarOutputEnergy'].setValue(this.selPlannedEnergy.solarOutputEnergy);
    this.masterForm.controls['dgEnergy'].setValue(this.selPlannedEnergy.dgEnergy);
    this.masterForm.controls['dgRunHrs'].setValue(this.selPlannedEnergy.dgRunHrs);
    this.masterForm.controls['mdgRunHrs'].setValue(this.selPlannedEnergy.mdgRunHrs);
    this.masterForm.controls['battDisEnergy'].setValue(this.selPlannedEnergy.battDisEnergy);
    this.masterForm.controls['battRunHrs'].setValue(this.selPlannedEnergy.battRunHrs);
    this.masterForm.controls['battChargingEnergy'].setValue(this.selPlannedEnergy.battChargingEnergy);
    this.masterForm.controls['battChargingRunHrs'].setValue(this.selPlannedEnergy.battChargingRunHrs);
    this.masterForm.controls['solarBattRunHrs'].setValue(this.selPlannedEnergy.solarBattRunHrs);
    this.masterForm.controls['solarDGRunHrs'].setValue(this.selPlannedEnergy.solarDGRunHrs);
    this.masterForm.controls['teleRunHrs'].setValue(this.selPlannedEnergy.teleRunHrs);
    this.masterForm.controls['communityLoadEnergy'].setValue(this.selPlannedEnergy.communityLoadEnergy);
    this.masterForm.controls['communityLoadRunHrs'].setValue(this.selPlannedEnergy.communityLoadRunHrs);
    this.masterForm.controls['opco1'].setValue(this.selPlannedEnergy.opco1);
    this.masterForm.controls['opco1RunHrs'].setValue(this.selPlannedEnergy.opco1RunHrs);
    this.masterForm.controls['opco2'].setValue(this.selPlannedEnergy.opco2);
    this.masterForm.controls['opco2RunHrs'].setValue(this.selPlannedEnergy.opco2RunHrs);
    this.masterForm.controls['opco3'].setValue(this.selPlannedEnergy.opco3);
    this.masterForm.controls['opco3RunHrs'].setValue(this.selPlannedEnergy.opco3RunHrs);
    this.masterForm.controls['opco4'].setValue(this.selPlannedEnergy.opco4);
    this.masterForm.controls['opco4RunHrs'].setValue(this.selPlannedEnergy.opco4RunHrs);
  }

  loadData() {
    this.loadSiteCode();
  }

  loadSiteCode() {
    const url = '';
    this.httpClient.get(url).subscribe((data: any) => {
      this.siteCodeList = data;
      this.setSelSiteCodeDD();
    }, (err) => {
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while loading site core list!'
      });
    });
  }

  setSelSiteCodeDD() {
    for (let item of this.siteCodeList) {
      if (item.id === this.selPlannedEnergy.siteCode) {
        this.selSiteCode = item;
        break;
      }
    }
  }

  toggleSiteCode(evt?: any) {
    this.isSiteCodeDDOpen = !this.isSiteCodeDDOpen;
  }

  selectSiteCode(item?: any) {
    this.selSiteCode = item;
  }

  close(evt?: any) {

  }

  cancel(evt?: any) {
    this.close();
  }

  save(evt?: any) {
    
  }

}
