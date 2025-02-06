import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AnimalService} from './services/animal.service';
import {NgForOf, NgIf} from '@angular/common';
import { AudioService } from './audio.service';


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
  previousStatus: string | null = null;
  pigImage = '';
  gratitudeMessage: string = '';

  constructor(private animalService: AnimalService, private audioService: AudioService) {
  }

  play(music: string) {
    this.audioService.playMusic(music).then(() => {});
  }

  stop() {
    this.audioService.stopMusic();
  }

  ngOnInit() {
    this.fetchAnimals();
    this.fetchMasterStatus();
  }

  fetchAnimals() {
    this.animalService.getAnimals().subscribe({
      next: (response) => {
        this.animals = response.animals;

        this.masterAnimal = this.animals.find(animal => animal.type === 'MASTER') || null;
        this.otherAnimals = this.animals.filter(animal => animal.type !== 'MASTER');
      },
      error: (error) => console.error('Error fetching animals:', error),
    });
  }

  fetchMasterStatus() {
    this.animalService.getMasterStatus().subscribe({
      next: (response: MasterStatus) => {
        this.masterStatus = response;
      },
      error: (error) => console.error('Error fetching MASTER status:', error),
    });
  }

  feedAnimal(animalId: number) {
    this.animalService.feedAnimal(animalId).subscribe({
      next: (response: MasterStatus) => {
        this.masterStatus = response;
        this.handleMusic();
        this.fetchAnimals();

        for (let i = 0; i < this.animals.length; i++) {
          if (this.animals[i].id === animalId) {
            this.gratitudeMessage = `${this.animals[i].name}: Thank you Бидзина 🇷🇺🇷🇺🇷🇺`;
            break;
          }
        }

        setTimeout(() => {
          this.gratitudeMessage = '';
        }, 5000);
      },
      error: (error) => alert(`Error feeding animal: ${error.message}`),
    });
  }

  toggleMasterAnimalImage() {
    if (this.masterAnimal) {

      if (this.pigImage === '') {
        this.pigImage = this.masterAnimal.image_url;
      }
      this.masterAnimal.image_url = this.masterAnimal.image_url === 'putin.avif' ? this.pigImage : 'putin.avif';
    }
  }

  private handleMusic() {
    if (!this.masterStatus) {
      return;
    }
    if (this.masterStatus.status === 'HAPPY') {
      if (this.previousStatus !== 'HAPPY') {
        console.log('Master is happy');
        this.play("ChemiSakartveloAqAris.mp3");
      }
    } else if (this.masterStatus.status === 'PUTIN') {
      if (this.previousStatus !== 'PUTIN') {
        console.log('Master is putin');
        this.play("USSR.mp3");
      }
    } else {
      if (this.previousStatus !== 'DEFAULT') {
        console.log('Master is default');
        this.stop();
      }
    }
    this.previousStatus = this.masterStatus.status;
  }
}
