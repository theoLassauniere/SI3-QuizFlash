import {Injectable} from "@angular/core";
import {BehaviorSubject, firstValueFrom} from "rxjs";
import {User} from "../models/user.models";
import {HOBBIES} from "../mocks/hobbies.mock";
import {Patient} from "../models/patient.models";
import {HttpClient} from "@angular/common/http";
import {apiUrl, httpOptionsBase} from "../configs/server.config";

const USER_KEY = "user";

@Injectable({providedIn: "root"})
export class UserService {
  public users: User[] = [];
  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(this.users);
  public user?: User;
  public user$: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(this.user);
  public hobbies: string[] = HOBBIES;
  public hobbies$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(this.hobbies);
  private userUrl = apiUrl + "/users";
  private httpOptions = httpOptionsBase;

  constructor(private http: HttpClient) {
    /* let json = sessionStorage.getItem(USER_KEY);
    if (json) this.setLoggedUser(JSON.parse(json)); */
    this.retrieveUsers().then();
  }

  async retrieveUsers() {
    this.users = await firstValueFrom(this.http.get<User[]>(this.userUrl));
    this.users$.next(this.users);
  }

  addUser(patient: Patient, callback: ((user: User) => void)) {
    /* patient.id = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
    patient.access = AccessRestriction.User;
    this.users.push(patient);
    this.users$.next(this.users);
    return patient.id; */
    this.http.post<User>(this.userUrl, patient, this.httpOptions).subscribe(user => {
      this.retrieveUsers().then(() => callback(user));
    });
  }

  deleteUser(user: User): void {
    /* let userIndex = this.users.findIndex(user => user.id == id);
    if (userIndex < 0) return;
    this.users.splice(userIndex, 1);
    this.users$.next(this.users); */
    const urlWithId = this.userUrl + "/" + user.id;
    this.http.delete<User>(urlWithId, this.httpOptions).subscribe(() => this.retrieveUsers().then());
  }

  updateUser(userId: string, updatedUser: User) {
    let userIndex = this.users.findIndex(user => user.id == userId);
    if (userIndex < 0) return;
    this.users[userIndex] = Object.assign({}, this.users[userIndex], updatedUser);
    this.users$.next(this.users);
  }

  public setLoggedUser(user?: User): void {
    if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(USER_KEY);
    this.user$.next(this.user = user);
  }
}
