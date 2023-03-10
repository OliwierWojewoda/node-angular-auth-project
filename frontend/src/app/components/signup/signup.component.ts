import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  newuser: User = new User()
  failureMessage = false;

  constructor(private router: Router,private authService: AuthService){}
    ngOnInit() : void{}

     signup(user: User){
      setTimeout( () => {this.failureMessage=true},1000)
      this.authService.signup(this.newuser)
       .subscribe({
        next: (msg) => {
          console.log(msg)
          this.router.navigate(['login'])
          this.failureMessage = false
        }  
      });
      }
}

