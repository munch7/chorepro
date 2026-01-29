import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Skill } from '../shared/skills.model';
import { Skills } from '../shared/skills.service';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  providers: [Skills],
})
export class ServicesComponent implements OnInit {
  selectedSkill: string = '- select -';
  filteredPosts: any[] = [];
  posts: any[] = [];
  skills: Skill[] = [];
  private firestore: Firestore = inject(Firestore);

  constructor(
    private route: ActivatedRoute,
    private sservice: Skills,
  ) {
    this.skills = this.sservice.getSkills();
  }

  ngOnInit() {
    this.getFormData();
  }

  async getFormData() {
    console.log('ServicesComponent: Fetching providers from Firestore...');
    try {
      const providersRef = collection(this.firestore, 'providers');
      const snapshot = await getDocs(providersRef);

      console.log(`ServicesComponent: Found ${snapshot.size} providers.`);

      this.posts = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      this.shufflePosts();
      this.filterBySkill();
    } catch (error) {
      console.error('ServicesComponent: Error fetching providers:', error);
    }
  }

  shufflePosts() {
    for (let i = this.posts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.posts[i], this.posts[j]] = [this.posts[j], this.posts[i]];
    }
    console.log('Shuffled Posts:', this.posts);
  }

  filterBySkill() {
    console.log(
      `ServicesComponent: Filtering providers by skill: ${this.selectedSkill}`,
    );
    if (this.selectedSkill === '' || this.selectedSkill === 'All Services') {
      this.filteredPosts = this.posts;
    } else if (this.selectedSkill && this.selectedSkill !== '- select -') {
      this.filteredPosts = this.posts.filter(
        (post) => post && post.skill === this.selectedSkill,
      );
    } else {
      this.filteredPosts = [];
    }
    console.log(
      `ServicesComponent: Filter complete. Found ${this.filteredPosts.length} posts.`,
    );
  }

  onSkillChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedSkill = target.value;
    this.filterBySkill();
  }
}
