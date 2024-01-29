import { PhoneType } from "./phone-type";

export const PhoneTypeLabels = new Map<number, string>([
  [PhoneType.Commercial, 'Comercial'],
  [PhoneType.Home, 'Casa'],
  [PhoneType.Mobile, 'Celular'],
  [PhoneType.Other, 'Outro']
]);
