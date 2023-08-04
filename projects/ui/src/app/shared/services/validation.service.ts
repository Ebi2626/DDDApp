import { Injectable } from "@angular/core";
import { AbstractControl, FormArray, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";


@Injectable({
  providedIn: 'root',
})
export class ValidationService {

  public static maxTruthLengthArray(max: number): ValidatorFn {
    return (controls: AbstractControl): ValidationErrors | null => {
      if(Array.isArray(controls.value) && controls.value.length > 0) {
        const trueValuesCount = controls.value.filter(Boolean).length;
        if(trueValuesCount > max) {
          return {
            'maxTruthLengthArray': true
          };
        }
      }
      return null;
    }
  }
}
