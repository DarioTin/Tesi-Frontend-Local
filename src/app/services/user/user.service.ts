import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {User} from "../../model/user/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  user = new BehaviorSubject<User>(new User());


}
