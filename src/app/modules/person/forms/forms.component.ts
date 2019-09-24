import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PersonService } from '../../../services/person.service';
import { SnackbarComponent } from '../../../components/snackbar/snackbar.component';

@Component({
    selector: 'app-forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.css']
})

export class FormsComponent {
    frm:FormGroup;

    constructor(
        public dialogRef: MatDialogRef<FormsComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any,
        private fb:FormBuilder,
        private personService:PersonService,
        public snack: MatSnackBar
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.initializeForm();
    }

    openSnack(data) {
        this.snack.openFromComponent(SnackbarComponent, {
            data: { data: data },
            duration: 3000
        });
    }

    initializeForm() {
        if(this.data.action=='edit'){
            let data = this.data.data;
            this.frm = this.fb.group({
                first_name: new FormControl(data.first_name, [Validators.required, Validators.minLength(3)]),
                last_name: new FormControl(data.last_name, [Validators.required, Validators.minLength(3)]),
                age: new FormControl(data.age, [Validators.required, Validators.minLength(1)]),
                gender: new FormControl(data.gender, [Validators.required]),
                id: new FormControl(data.id)
            });
        }else{
            this.frm = new FormGroup({
                first_name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
                last_name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
                age: new FormControl(null, [Validators.required, Validators.minLength(1)]),
                gender: new FormControl(null, [Validators.required]),
                id: new FormControl(null)
            });
        }
    }

    save(form: FormGroup) {
        this.personService.save(form.value).subscribe((data:any) => {
            if(data.success){
                this.dialogRef.close(true);
                this.openSnack(data);
            }else{
                this.openSnack(data);
            }
        });
    }

    getNameErrorMessage() {
        return this.frm.controls.first_name.hasError('required') ? 'First name is required' :
        this.frm.controls.name.hasError('minlength') ? 'Al menos 2 caracteres' : '';
    }
    getLastNameErrorMessage() {
        return this.frm.controls.last_name.hasError('required') ? 'Last name is required' :
        this.frm.controls.name.hasError('minlength') ? 'Al menos 2 caracteres' : '';
    }
    getAgeErrorMessage() {
        return this.frm.controls.age.hasError('required') ? 'Age is required' :
        this.frm.controls.age.hasError('minlength') ? 'Al menos un numero debe ser ingresado' : '';
    }
    getGenderErrorMessage() {
        return this.frm.controls.gender.hasError('required') ? '' : '';
    }
}
