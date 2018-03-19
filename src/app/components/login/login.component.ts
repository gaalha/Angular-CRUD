import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { PlatformLocation } from '@angular/common';

// SERVICES
import { AuthService } from './../../services/auth.service';

// ERROR MESSAGE
import {SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    form: FormGroup;
    private formSubmitAttempt: boolean;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService ,
        private router: Router,
        public snack: MatSnackBar,
        private location: PlatformLocation
    ) {
        location.onPopState(() => {
            /*console.log('pressed back!');*/
            window.location.reload();
        });
    }

    ngOnInit() {
        if(localStorage.getItem('token')){
            this.router.navigate(['']);
        }

        this.form = this.fb.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    isFieldInvalid(field: string) {
        return (
            (!this.form.get(field).valid && this.form.get(field).touched) ||
            (this.form.get(field).untouched && this.formSubmitAttempt)
        );
    }

    onSubmit() {
        if (this.form.valid) {
            this.authService.login(this.form.value).subscribe((data:any) => {
                if(data.success){
                    this.authService.loggedIn.next(true);
                    localStorage.setItem('token', data.token);
                    this.router.navigate(['']);
                }else{
                    this.snack.openFromComponent(SnackbarComponent, {
                        data: { data: data },
                        duration: 3000
                    });
                }
            });
        }
        this.formSubmitAttempt = true;
    }
}
