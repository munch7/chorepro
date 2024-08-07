import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule ],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  selectedSkill: string = ''; // To store the selected skill from dropdown
  filteredPosts: any[] = [];
  posts: any[] = [];
  skills: string[] = []; // Array to hold unique skills

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

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
          this.extractSkills(); // Extract skills after data is loaded
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

  extractSkills() {
    const skillSet = new Set<string>(); // Use a Set to get unique skills
    this.posts.forEach(post => {
      if (post && post.skill) { // Check if post and post.skill are not null
        skillSet.add(post.skill);
      }
    });
    this.skills = Array.from(skillSet);
    console.log('Available Skills:', this.skills); // Debugging log
  }

  filterBySkill() {
    if (this.selectedSkill) {
      this.filteredPosts = this.posts.filter(post => post && post.skill === this.selectedSkill); // Check if post is not null
    } else {
      this.filteredPosts = this.posts;
    }
    console.log('Filtered Posts:', this.filteredPosts); // Debugging log
  }

  onSkillChange(event: Event) {
    const target = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
    this.selectedSkill = target.value;
    this.filterBySkill(); // Apply filter when skill changes
  }
}
