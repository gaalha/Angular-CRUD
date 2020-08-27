import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ClientService } from '~services/client.service';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';
import { Client } from '~app/models/client';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})

export class FormsComponent implements OnInit {
  public frm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private fb: FormBuilder,
    private clientService: ClientService,
    public snack: MatSnackBar
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.initializeForm();
  }

  openSnack(data: any) {
    this.snack.openFromComponent(SnackbarComponent, {
      data: { data: data },
      duration: 3000
    });
  }

  private initializeForm() {
    const IS_EDITING = this.data.action === 'edit';
    const data = this.data.data;

    this.frm = this.fb.group({
      first_name: new FormControl(IS_EDITING ? data.first_name : null, [Validators.required, Validators.minLength(3)]),
      last_name: new FormControl(IS_EDITING ? data.last_name : null, [Validators.required, Validators.minLength(3)]),
      age: new FormControl(IS_EDITING ? data.age : null, [Validators.required, Validators.minLength(1)]),
      gender: new FormControl(IS_EDITING ? data.gender : null, [Validators.required]),
      id: new FormControl(IS_EDITING ? data.id : null)
    });
  }

  public save(form: FormGroup) {
    this.clientService.save(form.value).subscribe((data: any) => {
      this.openSnack(data);

      if (data.success) {
        this.dialogRef.close(true);
      }
    });
  }

  public getNameErrorMessage() {
    return this.frm.controls.first_name.hasError('required') ? 'First name is required' :
      this.frm.controls.name.hasError('minlength') ? 'Al menos 2 caracteres' : '';
  }

  public getLastNameErrorMessage() {
    return this.frm.controls.last_name.hasError('required') ? 'Last name is required' :
      this.frm.controls.name.hasError('minlength') ? 'Al menos 2 caracteres' : '';
  }

  public getAgeErrorMessage() {
    return this.frm.controls.age.hasError('required') ? 'Age is required' :
      this.frm.controls.age.hasError('minlength') ? 'Al menos un numero debe ser ingresado' : '';
  }

  public getGenderErrorMessage() {
    return this.frm.controls.gender.hasError('required') ? '' : '';
  }

}
