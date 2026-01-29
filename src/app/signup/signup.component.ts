import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Skills } from '../shared/skills.service';
import { Skill } from '../shared/skills.model';
import { ProviderService } from '../shared/provider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [Skills],
})
export class SignupComponent {
  yourFormGroup: FormGroup;
  skills: Skill[] = [];
  responseMessage: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private sservice: Skills,
    private providerService: ProviderService,
    private router: Router,
  ) {
    console.log('SignupComponent: Initializing form...');
    this.yourFormGroup = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        contact: ['', [Validators.required, this.contactValidator]],
        location: ['', Validators.required],
        skill: ['', Validators.required],
        description: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );

    this.skills = this.sservice.getSkills();
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  };

  contactValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const value: string = control.value;
    const validPrefix = '07';

    if (
      value &&
      typeof value === 'string' &&
      value.startsWith(validPrefix) &&
      value.length === 10
    ) {
      return null; // Valid
    } else {
      return { invalidContact: true }; // Invalid
    }
  };

  onSubmit() {
    console.log('SignupComponent: onSubmit triggered');
    if (this.yourFormGroup.invalid) {
      console.warn(
        'SignupComponent: Form is invalid',
        this.yourFormGroup.errors,
      );
      return;
    }

    const { confirmPassword, ...submitData } = this.yourFormGroup.value;
    submitData.availability = 'Available';
    submitData.createdAt = new Date().toISOString();

    console.log(
      'SignupComponent: Submitting following data to ProviderService:',
      JSON.stringify(submitData, null, 2),
    );

    this.providerService.createAccount(submitData).subscribe({
      next: (response) => {
        console.log(
          'SignupComponent: SUCCESS - Account created. Response:',
          response,
        );
        this.responseMessage = 'Account created successfully! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/login'], {
            queryParams: {
              email: submitData.email,
              password: this.yourFormGroup.value.password, // Original password from form
              newAccount: 'true',
            },
          });
        }, 2000);
      },
      error: (error) => {
        console.error(
          'SignupComponent: FAILURE - Error creating account:',
          error,
        );
        console.dir(error); // Log full error object
        this.responseMessage =
          'Error creating account. Check console for details.';
      },
      complete: () =>
        console.log('SignupComponent: createAccount observable completed'),
    });
  }
}
