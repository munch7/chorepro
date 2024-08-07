import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { 
  AbstractControl, 
  FormBuilder, 
  FormGroup, 
  FormsModule, 
  ReactiveFormsModule, 
  ValidationErrors, 
  ValidatorFn, 
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  yourFormGroup: FormGroup;
  skills: string[] = [
    'Electronics',
    'Plumbing',
    'Deliveries / Errands',
    'Decorating',
    'House / Pet Sitting',
    'Assembly / Mounting',
    'Moving',
    'Cleaning',
    'Outdoor Help',
    'Home Repairs'
  ];
  responseMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.yourFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      contact: ['', [Validators.required, this.contactValidator]],
      location: ['', Validators.required],
      skill: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  contactValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    const validPrefix = '07';

    if (value && typeof value === 'string' && value.startsWith(validPrefix) && value.length === 10) {
      return null;  // Valid
    } else {
      return { invalidContact: true };  // Invalid
    }
  };

  onSubmit() {
    const formData = this.yourFormGroup.value;
    this.http.post('https://monkey-ec249-default-rtdb.europe-west1.firebasedatabase.app/form-data.json', formData)
    .subscribe(
      (response) => {
        console.log('Form Data submitted successfully:', response);
        this.responseMessage = 'Form Data submitted successfully!';
        this.yourFormGroup.reset();
      },
      (error) => {
        console.error('Error submitting form data:', error);
        this.responseMessage = 'Error submitting form data. Please try again.';
      }
    );    
  }
}
