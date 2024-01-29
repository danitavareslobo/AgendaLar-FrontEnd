import { PhoneType } from "./phone-response";

export interface NewPhoneRequest {
  personId: string;
  number: string;
  type: PhoneType;
}
