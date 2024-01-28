export interface PhoneResponse {
    id: string;
    personId: string;
    type: PhoneType;
    number: string;

}

export enum PhoneType {
  Mobile = 1,
  Home = 2,
  Commercial = 3
}
