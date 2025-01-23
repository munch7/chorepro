import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Skill } from '../shared/skills.model';
import { Skills } from '../shared/skills.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
  providers: [Skills]
})
export class BookComponent {
  yourFormGroup: FormGroup;
  responseMessage: string | null = null;
  skills: Skill [] = [];
  formSubmitted: boolean = false;
  selectedSkills: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private sservice: Skills,
    private http: HttpClient
  ) {
    this.yourFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required]
    });
    this.skills = this.sservice.getSkills();
  }

  toggleSkillSelection(skillName: string) {
    if (this.selectedSkills.includes(skillName)) {
      this.selectedSkills = this.selectedSkills.filter((name) => name !== skillName);
    } else {
      this.selectedSkills.push(skillName);
    }
  }
  
  onSubmit() {
    this.formSubmitted = true;
    if (this.yourFormGroup.valid && this.selectedSkills.length > 0) {
      const formData = {
        ...this.yourFormGroup.value,
        skills: this.selectedSkills,
      };

      this.http
        .post(
          'https://chorepro-d76fe-default-rtdb.europe-west1.firebasedatabase.app/form-data.json',
          formData
        )
        .subscribe(
          (response) => {
            console.log('Form Data submitted successfully:', response);
            this.responseMessage = 'Form Data submitted successfully!';
            this.yourFormGroup.reset();
            this.selectedSkills = [];
            this.formSubmitted = false;
          },
          (error) => {
            console.error('Error submitting form data:', error);
            this.responseMessage =
              'Error submitting form data. Please try again.';
          }
        );   
    }
  }
}
