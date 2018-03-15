import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
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

    initializeForm(){
        if(this.data.action=='edit'){
            this.frm = this.fb.group({
                name: new FormControl(this.data.data.name, [Validators.required, Validators.minLength(3)]),
                age: new FormControl(this.data.data.age, [Validators.required, Validators.minLength(1)]),
                gender: new FormControl(this.data.data.gender, [Validators.required]),
                personid: new FormControl(this.data.data.personid)
            });
        }else{
            this.frm = new FormGroup({
                name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
                age: new FormControl(null, [Validators.required, Validators.minLength(1)]),
                gender: new FormControl(null, [Validators.required]),
                personid: new FormControl(null)
            });
        }
    }

    save(form:FormGroup){
        console.log(form.value);
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
        return this.frm.controls.name.hasError('required') ? 'El campo Nombre es obligatorio' :
        this.frm.controls.name.hasError('minlength') ? 'Al menos 2 caracteres' : '';
    }
    getAgeErrorMessage() {
        return this.frm.controls.age.hasError('required') ? 'El campo edad es obligatorio' :
        this.frm.controls.age.hasError('minlength') ? 'Al menos un numero debe ser ingresado' : '';
    }
    getGenderErrorMessage() {
        return this.frm.controls.gender.hasError('required') ? '' : '';
    }
}
