import { PhoneResponse } from "../phone/phone-response";

export interface PersonResponse {
    id: string;
    userId: string;
    name: string;
    email: string;
    socialNumber: string;
    birthDate: string;
    ativo: boolean;
    phones: PhoneResponse[];
}
