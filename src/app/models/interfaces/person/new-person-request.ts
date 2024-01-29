import { NewPhoneRequest } from "../phone/new-phone-request";

export interface NewPersonRequest {
  personId: string;
  name: string;
  email: string;
  socialNumber: string;
  birthDate: Date;
  phones: NewPhoneRequest[];
}
