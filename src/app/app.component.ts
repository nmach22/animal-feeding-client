import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AnimalService} from './services/animal.service';
import {NgForOf, NgIf} from '@angular/common';


interface Animal {
  id: number;
  name: string;
  type: string;
  gratitude_count: number;
  image_url: string;
  update_date: string;
}

interface MasterStatus {
  status: string;
  points: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgForOf, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  animals: Animal[] = [];
  masterAnimal: Animal | null = null;
  otherAnimals: Animal[] = [];
  masterStatus: MasterStatus | null = null;

  constructor(private animalService: AnimalService) {
  }

  ngOnInit() {
    this.fetchAnimals();
    this.fetchMasterStatus();
  }

  fetchAnimals() {
    this.animalService.getAnimals().subscribe({
      next: (response) => {
        this.animals = response.animals;

        // Separate MASTER animal and other animals
        this.masterAnimal = this.animals.find(animal => animal.type === 'MASTER') || null;
        this.otherAnimals = this.animals.filter(animal => animal.type !== 'MASTER');
      },
      error: (error) => console.error('Error fetching animals:', error),
    });
  }

  fetchMasterStatus() {
    // Fetch status from the given URL for the MASTER animal
    this.animalService.getMasterStatus().subscribe({
      next: (response: MasterStatus) => {
        // Now `response` is typed as MasterStatus, and we can safely access `status`
        this.masterStatus = response; // Store the full response
      },
      error: (error) => console.error('Error fetching MASTER status:', error),
    });
  }


  feedAnimal(animalId: number) {
    this.animalService.feedAnimal(animalId).subscribe({
      next: (response: MasterStatus) => {
        // alert(`Animal ${animalId} has been fed! 🥕`);
        this.masterStatus = response;
        this.fetchAnimals();
      },
      error: (error) => alert(`Error feeding animal: ${error.message}`),
    });
  }
}
