import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '~services/auth.service';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: []
})

export class LoginComponent implements OnInit {
    public form: FormGroup;
    public isLogin = false;
    private formSubmitAttempt: boolean;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        public snack: MatSnackBar,
    ) { }

    ngOnInit() {
        if (localStorage.getItem('token')) {
            this.router.navigate(['/']);
        }

        this.form = this.fb.group({
            user_name: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    public isFieldInvalid(field: string) {
        return (
            (!this.form.get(field).valid && this.form.get(field).touched) ||
            (this.form.get(field).untouched && this.formSubmitAttempt)
        );
    }

    onSubmit() {
        if (this.form.valid) {
            this.isLogin = true;
            this.authService.login(this.form.value).subscribe(
                (data: any) => {
                    this.isLogin = false;
                    if (data.success) {
                        this.authService.loggedIn.next(true);
                        localStorage.setItem('token', data.token);
                        this.router.navigate(['/']);
                    } else {
                        this.snack.openFromComponent(SnackbarComponent, {
                            data: { data: data },
                            duration: 3000
                        });
                    }
                },
                (error) => {
                    console.log(error);
                    this.isLogin = false;
                }
            );
        }
        this.formSubmitAttempt = true;
    }
}
