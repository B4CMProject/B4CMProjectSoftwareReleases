import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  cus = false;
  loginType: string = 'Provider';
  public loginform: FormGroup;
  constructor(
    private authSrv: AuthService,
    private fBuilder: FormBuilder,
    private router: Router,
    private popSrv: PopupService
  ) {
    this.loginform = this.fBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      orgname: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  toggleCus(login_type: string) {
    this.loginType = login_type;
    if (login_type === 'Provider') {
      this.cus = false;
    } else {
      this.cus = true;
    }
  }

  login() {
    const data = {
      email: this.loginform.controls.email.value,
      password: this.loginform.controls.password.value,
      orgname: this.loginform.controls.orgname.value
    }
    this.authSrv.uLogin(data).subscribe(res => {
      sessionStorage.setItem('uToken', res.token);
      sessionStorage.setItem('uEmail', res.user.email);
      sessionStorage.setItem('uType', res.user.type);
      if (res.token !== '' || res.token !== null || res.token !== undefined) {
        if (res.user.type === 'Consumer' && this.cus) {
          this.popSrv.showSuccess('Login Successfull');
          this.router.navigateByUrl('/home/all-offers');
        } else if (res.user.type === 'Provider' && !this.cus) {
          this.popSrv.showSuccess('Login Successfull');
          this.router.navigateByUrl('/home/new-offers');
        } else {
          this.popSrv.showWarning(this.cus ? 'User is a Provider' : 'User is a Consumer');
        }
      } else {
        this.popSrv.showError('Something Error happens');
        this.router.navigateByUrl('');
      }
    }, (error: HttpErrorResponse) => {
      this.popSrv.showError(error.error.errors.message);
    });
  }

}
