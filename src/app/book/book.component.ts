import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Skill } from '../shared/skills.model';
import { Skills } from '../shared/skills.service';
import { RouterModule, Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { ClientService } from '../shared/client.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
  providers: [Skills],
})
export class BookComponent implements OnInit {
  yourFormGroup: FormGroup;
  responseMessage: string | null = null;
  skills: Skill[] = [];
  formSubmitted: boolean = false;
  selectedSkills: string[] = [];
  submittedBookingId: string | null = null;

  private firestore: Firestore = inject(Firestore);
  private clientService: ClientService = inject(ClientService);
  private router: Router = inject(Router);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private sservice: Skills = inject(Skills);

  constructor() {
    this.yourFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required],
      date: ['', Validators.required],
    });
    this.skills = this.sservice.getSkills();
  }

  ngOnInit() {
    this.submittedBookingId = this.clientService.getLastBookingId();
    if (this.submittedBookingId) {
      this.responseMessage = 'You have active booking sessions.';
    }
  }

  toggleSkillSelection(skillName: string) {
    if (this.selectedSkills.includes(skillName)) {
      this.selectedSkills = this.selectedSkills.filter(
        (name) => name !== skillName,
      );
    } else {
      this.selectedSkills.push(skillName);
    }
  }

  async onSubmit() {
    this.formSubmitted = true;
    if (this.yourFormGroup.valid && this.selectedSkills.length > 0) {
      const services: any = {};
      this.selectedSkills.forEach((skill) => {
        services[skill] = { status: 'pending' };
      });

      const formData = {
        ...this.yourFormGroup.value,
        skills: this.selectedSkills,
        services: services,
        createdAt: new Date().toISOString(),
      };

      try {
        const bookingsRef = collection(this.firestore, 'bookings');
        const docRef = await addDoc(bookingsRef, formData);

        this.clientService.saveBookingToStorage(docRef.id);
        this.submittedBookingId = docRef.id;

        this.responseMessage = 'Booking submitted successfully!';
        this.yourFormGroup.reset();
        this.selectedSkills = [];
        this.formSubmitted = false;
      } catch (error) {
        this.responseMessage = 'Error submitting booking. Please try again.';
      }
    }
  }
}
