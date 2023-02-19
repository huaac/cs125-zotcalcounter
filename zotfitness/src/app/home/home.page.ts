import { Component } from '@angular/core';

import { OnInit } from '@angular/core'; //added for the "export class HomePage implements OnInit"
import { Router } from '@angular/router'; //added
import { Preferences } from '@capacitor/preferences'; //added

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  usernameCategory:string = "";
  passwordCategory:string = "";

  constructor(private router:Router) {}

  ngOnInit(): void {}

  // when clicked, moves page to questions page
  onLoginClick() {
    this.router.navigateByUrl('/questions');
//     this.setUsername();
//     this.setPassword();

    this.removeUsername();
    this.removePassword();
  }

  // function that deletes stored username
  removeUsername = async () => {
    await Preferences.remove({ key: 'username' });
  };

  // function that deletes stored password
  removePassword = async () => {
    await Preferences.remove({ key: 'password' });
  };

  // function that sets username with text from input box
  setUsername = async () => {
  await Preferences.set({
    key: 'username',
    value: this.usernameCategory,
  });
  };

  // function that sets password with text from input box
  setPassword = async () => {
  await Preferences.set({
    key: 'password',
    value: this.passwordCategory,
  });
  };

}
