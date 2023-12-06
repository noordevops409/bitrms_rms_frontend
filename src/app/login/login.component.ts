import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonUtilService } from '../shared/common-util.service';
import { UserService } from '../shared/services/user.service';
import { BroadcastService } from '../shared/broadcast.service';
import { WindowsNotificationService } from '../shared/windows-notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  // username : ympadmin
  // password : ympadmin@123

  public isLogining: boolean = false;
  public loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  checkboxData: any = {
    isChecked: false,
    text: 'Check me out'
  };

  constructor(
    private util: CommonUtilService,
    private userService: UserService,
    private broadcast: BroadcastService,
    private formBuilder: FormBuilder,
    private router: Router,
    private winNotification: WindowsNotificationService
  ) { }


  get lf() {
    return (this.loginForm as any).controls;
  }


  ngOnInit(): void {
    this.init();
    this.initForm();
  }

  ngOnDestroy(): void {

  }

  init() {

  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      "email": [null, [Validators.required]],
      "password": [null, [Validators.required]]
    });
  }

  cancel($event: any) {
    this.isLogining = false;
    this.loginForm.reset();
  }

  login($event: any) {
    if (this.isLogining) {
      return;
    }
  
    let formData = this.loginForm.value;
    let param: any = {
      username: formData.email,
      password: formData.password
    };
  
    this.isLogining = true;
    this.userService.login(param).subscribe((res?: any) => {
      this.isLogining = false;
  
      if (res.status === 401 || res.status === 400) {
        // Handle invalid credentials scenario
        this.loginForm.setErrors({ 'invalidCredentials': true });
  
        // if (res.message === 'invalid.username') {
        //   this.loginForm.get('email')?.setErrors({ 'invalidUsername': true });
        // } else if (res.message === 'invalid.password') {
        //   this.loginForm.get('password')?.setErrors({ 'invalidPassword': true });
        // }
      } else {
        console.log("83", res.data);
        this.userService.setData(res.data);
        this.winNotification.init();
        this.router.navigate(['pages', 'dashboard'], { replaceUrl: true });
      }
    }, (err?: any) => {
      this.isLogining = false;
      this.util.notification.error({
        title: 'Error',
        msg: 'Error while login!'
      });
      this.router.navigate(['login']);
    });
  }
  
}
