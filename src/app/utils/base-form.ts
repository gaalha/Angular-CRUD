import { FormControl, FormGroup } from '@angular/forms';


export class BaseForm {

  public MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
  }

  public isEqual(a: FormControl, b: FormControl) {
    return (a === b) ? null : {
        isEqual: {
            valid: false
        }
    };
  }

}
