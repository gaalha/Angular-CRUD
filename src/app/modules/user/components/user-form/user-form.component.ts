import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { UserService } from '~services/user.service';
import { BaseForm } from '~utils/base-form';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  public IS_EDITING = false;

  public userForm: FormGroup;

  public isSaving = false;

  public isChangingPassword = false;

  private baseForm = new BaseForm();

  constructor(
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private fb: FormBuilder,
    private userService: UserService,
    public snack: MatSnackBar
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (this.data.action === 'edit') {
      this.IS_EDITING = true;
    }
    console.log(this.IS_EDITING)
    this.initializeForm();
  }

  private initializeForm() {
    this.userForm = this.fb.group({
      id: [this.IS_EDITING ? this.data.id : null],
      user_name: [
        this.IS_EDITING ? this.data.user_name : null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30)
        ]
      ],
      email: [
        this.IS_EDITING ? this.data.email : null,
        [
          Validators.required,
          Validators.email,
          Validators.minLength(6),
          Validators.maxLength(150)
        ]
      ],
      changePassword: [false],
      password: [
        this.IS_EDITING ? this.data.password : null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(150)
        ]
      ],
      repeat_password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(150)
        ]
      ],
    },
    {
      validators: this.baseForm.MustMatch('password', 'repeat_password')
    });
  }

  public save() {
    if (this.userForm.valid) {
      this.isSaving = true;

      this.userService.save(this.userForm.value).subscribe(
        (data: any) => {
          this.snack.open(data.message, 'Close');
          if (data.success) { this.dialogRef.close(true); }
          this.isSaving = false;
        },
        (error) => {
          this.snack.open(error, 'Close');
          this.isSaving = false;
        }
      );
    }
  }

  public getUsernameErrorMessages() {
    const user_name = this.userForm.controls.user_name;

    if (user_name.hasError('required')) {
      return 'Username is required';
    } else if (user_name.hasError('minlength')) {
      return 'Al menos 2 caracteres';
    } else if (user_name.hasError('maxlength')) {
      return '';
    } else {
      return '';
    }
  }

  public getEmailErrorMessages() {
    const email = this.userForm.controls.email;

    if (email.hasError('email')) {
      return 'Invalid email';
    } else if (email.hasError('required')) {
      return 'Email is required';
    } else if (email.hasError('minlength')) {
      return 'Al menos 2 caracteres';
    } else if (email.hasError('maxlength')) {
      return 'El maximo es';
    } else { return ''; }
  }

  public getPasswordErrorMessages() {
    const password = this.userForm.controls.password;

    if (password.hasError('required')) {
      return 'Password is required';
    } else if (password.hasError('minlength')) {
      return 'Al menos 2 caracteres';
    } else if (password.hasError('maxlength')) {
      return 'El maximo es';
    } else {
      return '';
    }
  }

  public getRepeatPasswordErrorMessages() {
    const repeat_password = this.userForm.controls.repeat_password;

    if (repeat_password.hasError('required')) {
      return 'Repeat password is required';
    } else if (repeat_password.hasError('minlength')) {
      return 'Al menos 2 caracteres';
    } else if (repeat_password.hasError('maxlength')) {
      return 'El maximo es';
    } else if (repeat_password.hasError('mustMatch')) {
      return 'Las contraseñas no cohinciden';
    } else {
      return '';
    }
  }

}
