import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppServiceService} from '../app-service.service';
import {VALID} from "@angular/forms/src/model";

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {

  loginForm: FormGroup;
  passwordMessage: string;
  usernameMessage: string;


  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.maxLength(10)]]
    });
  }

  constructor(private appService: AppServiceService, private routes: Router, private fb: FormBuilder) {
  }

  usernameValidation(control: AbstractControl) {
    if (control.errors === null) {
      return null;
    } else {
      if (control.errors.required === true) {
        return this.usernameMessage = `Name is required`;
      }
      if (control.value.length > 10) {
        return this.usernameMessage = `Maximum length is 10`;
      }
      if (control.value.length < 2) {
        return this.usernameMessage = `Minimum length is 2`;
      }
    }
  }

  passwordValidation(control: AbstractControl) {
    if (control.errors === null) {
      return null;
    } else {
      if (control.errors.required === true) {
        return this.passwordMessage = `Password is required`;
      }
      if (control.value.length > 10) {
        return this.passwordMessage = `Maximum length is 10`;
      }
    }
  }

  // isRequired(control: AbstractControl){
  //   return control.errors.required;
  // }

  login(formValue: any) {
    if (this.loginForm.valid === true) {
      const url = `signin`;
      this.appService.postAPI(url, formValue)
        .subscribe(res => {
          console.log(res);
          const response = res;
          const token = response.payload.token.access_token;
          sessionStorage.setItem('currentUser', token);
          if (response.status === 200) {
            this.routes.navigate(['infoTable']);
          }
        });
    }
  }

  /* Login User Details:
   * Username: visumenu
   * Password: visumenu1 */

  // doHeader(token: string){
  //   let header = new Headers();
  //   header.append('Authorization', token );
  //   let option = new RequestOptions();
  //   option.headers = header;
  //   let url = `https://mvp-dev-extensionsapi.visumenu.com/phoneDetail?pageNumber=1&recordsPerPage=3&totalPage=0&sortBy=phone_number&sortOrder=asc`;
  //   this.http.get(url, option)
  //     .subscribe(res => {
  //         const response = res.json();
  //         const path = response.payload.data;
  //         this.array.push(path);
  //         },
  //       msg => console.log(`Error: ${msg.status} ${msg.statusText}`));
  // }

}
