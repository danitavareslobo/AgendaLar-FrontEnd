import { PhoneType } from "./phone-type";

export interface PhoneResponse {
    id: string;
    personId: string;
    type: PhoneType;
    number: string;
}
