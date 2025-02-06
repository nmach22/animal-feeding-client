import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = `${environment.apiUrl}/animals`;
  private masterStatusUrl = 'http://localhost:3000/api/bidzina/status';

  constructor(private http: HttpClient) {
  }

  getAnimals(): Observable<{ animals: Animal[] }> {
    return this.http.get<{ animals: Animal[] }>(this.apiUrl);
  }

  // Fetch status for MASTER
  getMasterStatus(): Observable<MasterStatus> {
    return this.http.get<MasterStatus>(this.masterStatusUrl);
  }

  feedAnimal(animalId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${animalId}/feed`, {});
  }
}
