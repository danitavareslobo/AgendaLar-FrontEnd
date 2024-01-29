import { EditPhoneRequest } from "../phone/edit-phone-request";
import { NewPhoneRequest } from "../phone/new-phone-request";

export interface EditPersonRequest {
  id: string;
  personId: string;
  name: string;
  email: string;
  socialNumber: string;
  birthDate: Date;
  ativo: boolean;
  newPhones: NewPhoneRequest[];
  updatedPhones: EditPhoneRequest[];
}
