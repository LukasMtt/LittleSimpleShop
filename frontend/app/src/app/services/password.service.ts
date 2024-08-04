import { Injectable } from "@angular/core";

@Injectable({  providedIn: 'root'})
export class PasswordService {
    validatePasswordEquality(password: string, confirmedPassword: string) {
        return password == confirmedPassword;
    }
}