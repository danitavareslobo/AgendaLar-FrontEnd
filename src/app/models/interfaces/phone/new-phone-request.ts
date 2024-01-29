import { PhoneType } from "./phone-type";

export interface NewPhoneRequest {
  personId: string;
  number: string;
  type: PhoneType;
}
