import { PhoneType } from "./phone-response";

export interface EditPhoneRequest {
  id: string;
  personId: string;
  number: string;
  type: PhoneType;
}
