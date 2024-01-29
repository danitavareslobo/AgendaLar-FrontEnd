import { PhoneType } from "./phone-type";

export interface EditPhoneRequest {
  id: string;
  personId: string;
  number: string;
  type: PhoneType;
}
