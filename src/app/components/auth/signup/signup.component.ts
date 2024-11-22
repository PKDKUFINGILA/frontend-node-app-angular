import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'node-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    })
  }

  //Get values form
  onSubmit() {
    const emailControl = this.signupForm.get('email');
    const passwordControl = this.signupForm.get('password');

    if (emailControl && passwordControl) {
      const email = emailControl.value;
      const password = passwordControl.value;

      this.auth.signup(email, password)
        .then(() => {
          this.router.navigate(['/shop']);
        })
        .catch((err) => {
          this.errorMessage = err.message ? err.message : 'Une erreur est survenue lors de l\'inscription.';
        });
    } else {
      this.errorMessage = 'Les champs du formulaire ne sont pas valides.';
    }
  }

}
