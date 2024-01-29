import { Pipe, PipeTransform } from '@angular/core';
import { PhoneTypeLabels } from 'src/app/models/interfaces/phone/phone-type-labels';

@Pipe({
  name: 'phoneTypeDescription'
})
export class PhoneTypeDescriptionPipe implements PipeTransform {

  transform(value: string): any {
    return this.getDescription(value);
  }

  getDescription(value: string): string {
    return PhoneTypeLabels.get(Number.parseInt(value)) || '';
  }
}
