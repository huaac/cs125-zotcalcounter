import { Component } from '@angular/core';

import { OnInit } from '@angular/core'; //added for the "export class HomePage implements OnInit"
import { Router } from '@angular/router'; //added
import { Preferences } from '@capacitor/preferences'; //added
import { AlertController } from '@ionic/angular'; // added
import { SearchService } from 'src/app/service/search.service'; // added


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  usernameCategory:string = "";
  passwordCategory:string = "";
  totalAccounts:number = 0;
  pageState:string = "Login";
  buttonState:String = "Login";
  switchingStates:string = "Click HERE to sign up!";
  accountExists:boolean = false;

  constructor(private router:Router, private alertController: AlertController, private searchService: SearchService) {}

  ngOnInit() {
    this.removeUsernames();
    this.removePasswords();
//     this.setTotalAccounts(String(this.totalAccounts));
    this.getTotalAccounts();
  }

  // when clicked, moves page to questions page
  onLoginClick() {
    if (this.pageState == "Login"){this.loginLogic();}
    else{this.signupLogic();}
  }

// changes the ui of the home page depending on if they want to login or sign up
  changesStates(){
    if (this.pageState == "Login"){
      this.pageState = "Sign Up";
      this.buttonState = "Sign Up";
      this.switchingStates = "Click HERE to return to Login";
    }
    else{
      this.pageState = "Login";
      this.buttonState = "Login";
      this.switchingStates = "Click HERE to sign up!";
    }
  }

//saves total accounts to database
  setTotalAccounts = async (num:string) => {
  await Preferences.set({
    key: 'totalAccounts',
    value: num,
  });
  };

// sets the sets total account variable to the one in the database
  getTotalAccounts = async () => {
    let temp = await Preferences.get({ key: 'totalAccounts' });
    this.totalAccounts = Number(temp.value);
  };

// gets the password at the index
  getPassword = async (index: number) => {
    let temp = await Preferences.get({ key: 'password' + index });
    return temp;
  };

  // function that deletes stored username
  removeUsernames = async () => {
    for(let x=0;x<this.totalAccounts;x++){
      await Preferences.remove({ key: 'username' + x });
    }
//     await Preferences.remove({ key: 'username' });
  };

  // function that deletes stored password
  removePasswords = async () => {
    for(let x=0;x<this.totalAccounts;x++){
      await Preferences.remove({ key: 'password' + x });
    }
//     should always be called after removeUsernames()
    this.totalAccounts = 0;
//     this.setTotalAccounts(0);
  };

  // function that sets username with text from input box
  setUsername = async () => {
  await Preferences.set({
    key: 'username' + this.totalAccounts,
    value: this.usernameCategory,
  });
  };

  // function that sets password with text from input box
  setPassword = async () => {
  await Preferences.set({
    key: 'password' + this.totalAccounts,
    value: this.passwordCategory,
  });
  };

// logic for signup
  async signupLogic(){
    this.checkAccountExists();
    await this.searchService.delay(1000);
    if(this.accountExists == true){this.presentUsernameTakenAlert();}
    else{
      this.setUsername();
      this.setPassword();
      this.totalAccounts += 1;
      this.setTotalAccounts(String(this.totalAccounts));
      this.presentSuccessfulSignedUpAlert();
    }
  }

//checks if an account exists. if no then proceed as planned
  async loginLogic(){
    let index = 0;
    await this.checkAccountExists().then((res) => {index = res});
//     await this.searchService.delay(1000);
    if(this.accountExists){
      const temp = Preferences.get({ key: 'password' + index });
      temp.then(
        async (res) => {
          if(res.value == this.passwordCategory) {
//             await this.searchService.delay(1000);
            this.router.navigateByUrl('/questions');
          }
          else {this.presentLoginErrorAlert();}
      });
     }
    else{this.presentLoginErrorAlert();}
  }


// checks the username if it already exists
  async checkAccountExists():Promise<number>{
    this.accountExists = false;
    let tempp:boolean = false;
    let index = 0;
    for(let x=0;x<this.totalAccounts;x++){
      const temp = Preferences.get({ key: 'username' + x });
      temp.then(
      (res) => {
        if(res.value === this.usernameCategory) {
          tempp = true;
          this.accountExists = tempp;
          index = x;
        }
      });
      await this.searchService.delay(1000);
    }
    return index;
  }

// error message for when you there are no matches for an account
  async presentLoginErrorAlert(){
    let c = await this.alertController.create({
      header: 'Invalid Username or Password',
      subHeader: 'Please try again.',
//       message: 'Head back to the Login page to sign in.',
      buttons: ['OK'],
    });

    await c.present();
  }

// popup message for when you successfully signed up for an account
  async presentSuccessfulSignedUpAlert(){
    let a = await this.alertController.create({
      header: 'Congratulations!',
      subHeader: 'You successfully made an account!',
      message: 'Head back to the Login page to sign in.',
      buttons: ['OK'],
    });

    await a.present();
  }

// error message for when user tries to sign up with an existing username
  async presentUsernameTakenAlert(){
    let b = await this.alertController.create({
      header: 'Invalid Username',
      subHeader: 'Username already exists.',
      message: 'Please try again with a different username',
      buttons: ['OK'],
    });

    await b.present();
  }
}
