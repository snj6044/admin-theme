
import { FormControl, FormGroup } from '@angular/forms';

// Validator : Allow Alphnumeric char and space only
export class TextFieldValidator {
    static validTextField(fc: FormControl) {
        if (fc.value != undefined && fc.value != '') {
            const regex = /^[0-9a-zA-Z ]+$/;
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validTextField: true };
            }
        } else {
            return null;
        }
    }
}

// Validator : Allow Numeric char only
export class NumericFieldValidator {
    static validNumericField(fc: FormControl) {
        if (fc.value != undefined && fc.value != '') {
            const regex = /[0-9]+/;
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validNumericField: true };
            }
        } else {
            return null;
        }
    }
}


// Validator : Allow char and space only
export class OnlyCharFieldValidator {
    static validOnlyCharField(fc: FormControl) {
        if (fc.value != undefined && fc.value != '') {
            const regex = /^[a-zA-Z ]+$/;
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validOnlyCharField: true };
            }
        } else {
            return null;
        }
    }
}

// Validator : Allow Email Pattern only
export class EmailValidator {
    static validEmail(fc: FormControl) {
        if (fc.value != undefined && fc.value != '') {
            const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validEmail: true };
            }
        } else {
            return null;
        }
    }
}


// Validator : Only Allow Whitespace 
export class NoWhitespaceValidator {
    static notWhiteSpaceValidator(fc: FormControl) {
        if (fc.value != undefined && fc.value != '' && fc.value != null) {
            // const regex = /^[ ]+$/;
            // if (regex.test(fc.value)) {
            //     return null;
            // } else {
            //     return { notWhiteSpaceValidator: true };
            // }

            const isWhiteSpace = (fc.value.toString() || '').trim().length === 0;
            if (!isWhiteSpace) {
                return null;
            } else {
                return { notWhiteSpaceValidator: true };
            }

        } else {
            return null;
        }
    }
}

// custom validator to check two fields match
export function MustMatchValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has al;ready found an error on match control
            return;
        }

        // if error on matching control 
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }

    }
}


