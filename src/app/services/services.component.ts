import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Skill } from '../shared/skills.model';
import { Skills } from '../shared/skills.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule ],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  providers: [Skills]
})
export class ServicesComponent implements OnInit {
  selectedSkill: string = '- select -';
  filteredPosts: any[] = [];
  posts: any[] = [];
  skills: Skill[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sservice: Skills
  ) {
    this.skills = this.sservice.getSkills();
  }

  ngOnInit() {
    this.getFormData();
  }

  getFormData() {
    this.http.get('https://monkey-ec249-default-rtdb.europe-west1.firebasedatabase.app/form-data.json')
      .subscribe(
        (data: any) => {
          console.log('Form data retrieved successfully:', data);
          this.posts = data ? Object.values(data) : []; // Ensure data is not null
          this.shufflePosts();
          this.filterBySkill(); // Apply filter after data is loaded
        },
        error => console.error('Error retrieving form data:', error)
      );
  }

  shufflePosts() {
    for (let i = this.posts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.posts[i], this.posts[j]] = [this.posts[j], this.posts[i]];
    }
    console.log('Shuffled Posts:', this.posts); // Debugging log
  }


  filterBySkill() {
    if (this.selectedSkill === '' || this.selectedSkill === 'All Services') {
      // If 'All Services' is selected, show all posts
      this.filteredPosts = this.posts;
    } else if (this.selectedSkill && this.selectedSkill !== '- select -') {
      // Otherwise, filter by the selected skill
      this.filteredPosts = this.posts.filter(post => post && post.Skills === this.selectedSkill);
    } else {
      // Default case (e.g., '- select -'), show no posts
      console.log('error');
      this.filteredPosts = [];
    }
    console.log('Filtered Posts:', this.filteredPosts); // Debugging log
  }    

  onSkillChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedSkill = target.value;
    this.filterBySkill(); // Apply the filter logic whenever the dropdown changes
  }
  
}
