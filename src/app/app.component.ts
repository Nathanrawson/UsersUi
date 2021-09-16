import { Component } from '@angular/core';
import { User } from './user';
import { HttpClient } from '@angular/common/http';

declare var angular: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  readonly ROOT_URL = 'https://localhost:44325/api';
  constructor(private http: HttpClient) { }

  searchBox = "";
  title = 'Aiimee';
  users: User[] = [];
  selectedUsers: User[] = [];
  ShowAddUser = "container hidden"
  showSuccess = "hidden"

  newUserName: string = "";
  newSurName: string = "";
  newJobName: string = "";
  newMobile: string = "";
  newEmail: string = "";
  Success: String = "";
  ErrorMessage: String[] = [];

  onSelect(user: User): void {
    var containsSelectedUser = false;
    this.selectedUsers.forEach(x => {
      if (this.filterExactResults(x.name, x.surname, user.name + " " + user.surname)) {
        containsSelectedUser = true;
      }
    })

    if (!containsSelectedUser) {
      this.selectedUsers.push(user)
    }
  }

  removeSuccess() {
    this.showSuccess = "hidden";
    this.Success = "";
  }

  ShowAddUserBox() {
    if (this.ShowAddUser.includes("hidden")) {
      this.ShowAddUser = "container"
    } else {
      this.ShowAddUser = "container hidden"
    }
  }

  validateString(stringToValidate: String, message: String, expectedLength: number) {
    if (stringToValidate == null || expectedLength > stringToValidate.length) {
      this.ErrorMessage.push(message);
      return false;
    }

    return true;
  }

  onSubmitNewUser(userName: string, surName: string, job: string, mobile: string, email: string,) {
    this.ErrorMessage = [];
    var validation =
      [{
        Name: userName, Value: "Please enter a valid user name that is at least 4 letters long", ExpectedLength: 4
      },
      {
        Name: surName, Value: "Please enter a valid Surname that is at least 4 letters long", ExpectedLength: 4
      },
      {
        Name: job, Value: "Please enter a valid job name that is at least 4 letters long", ExpectedLength: 4
      }, {
        Name: mobile, Value: "Please enter a mobile number that is at least 11 digits long", ExpectedLength: 11
      }, {
        Name: email, Value: "Please enter a valid email", ExpectedLength: 4
      }]

    var validationSuccess = true;

    validation.forEach(x => {
      var validation = this.validateString(x.Name, x.Value, x.ExpectedLength)
      if (!validation) {
        validationSuccess = false;
      }
    })
    if (!validationSuccess) {
      return;
    }

    const headers = { 'content-type': 'application/json' }
    var body = JSON.stringify({ Name: userName, Surname: surName, Job: job, Mobile: mobile, Email: email, Id: (Math.random() * 10).toString() });

    this.http.post<string>(this.ROOT_URL + '/user', body, { 'headers': headers }).subscribe(data => {
      var addUserResult = data.valueOf();

      if (!addUserResult.toLocaleLowerCase().includes("success")) {
        this.ErrorMessage.push(addUserResult);
      } else {
        this.Success = "New User Added"
        this.showSuccess = "";
        this.ShowAddUser = "container hidden"
      }
    });
  }

  filterResults(firstname: string, surname: string, search: string) {
    var fullname = firstname.toLocaleLowerCase() + " " + surname.toLocaleLowerCase();

    if (fullname.includes(search.toLocaleLowerCase())) {
      return true;
    }
    return false;
  }

  filterExactResults(firstname: string, surname: string, search: string) {
    var fullname = firstname.toLocaleLowerCase() + " " + surname.toLocaleLowerCase();

    if (fullname == search.toLocaleLowerCase()) {
      return true;
    }
    return false;
  }

  onSearch(search: string) {
    this.users = [];
    this.removeSuccess();
    this.ErrorMessage = [];

    if (search.length < 2) {
      return;
    }

    this.searchBox = search;

    this.http.get(this.ROOT_URL + '/user').subscribe((data => {
      var userObject = data.valueOf();
      var userArr: User[] = [];

      for (var key in userObject) {
        userArr.push({ id: parseInt(key), name: (userObject as any)[key].name, surname: (userObject as any)[key].surname, email: (userObject as any)[key].email, mobile: (userObject as any)[key].mobile, job: (userObject as any)[key].job })
      }

      if (userArr.length >= 1 && search.length > 2) {

        userArr.forEach(x => {
          if (this.filterResults(x.name, x.surname, search)) {
            this.users.push(x);
          }
        });

      } else {
        this.users = [];
      }
    }));
  }
}
