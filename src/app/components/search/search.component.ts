import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { CandidateService } from '../../services/candidate.service';
import { SearchResponse } from '../../interfaces/candidate.interface';
import { HttpClientModule } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    MatDividerModule,
    HttpClientModule
  ],
  providers: [CandidateService],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchTerm: string = '';
  isSearching: boolean = false;
  result_of_candidates: SearchResponse | null = null;
  candidateJustifications: { [key: string]: string } = {};

  constructor(private candidateService: CandidateService) { }

  onSearch(): void {
    if (!this.searchTerm?.trim()) return;

    this.isSearching = true;
    this.result_of_candidates = null;

    this.candidateService.searchCandidates(this.searchTerm)
      .subscribe({
        next: (results) => {
          this.result_of_candidates = results;
          this.isSearching = false;
          this.getCandidateJustifications()
        },
        error: (error) => {
          console.error('Error en la búsqueda:', error);
          this.isSearching = false;
        }
      });
  }

  onViewCV(candidateId: string): void {
    console.log('Ver CV del candidato:', candidateId);
  }

  private getCandidateJustifications(): void {
    if (!this.result_of_candidates) return;

    this.result_of_candidates.result.forEach(candidate => {
      this.candidateService.justifyCandidate({
        user_promt: this.searchTerm,
        candidate: candidate.json_data,
        searched_skills: this.result_of_candidates?.searched_skills || [],
        matched_skills: candidate.matched_skills
      }).subscribe({
        next: (response) => {
          this.candidateJustifications[candidate.json_data._id] = response.msg;
        },
        error: (error) => {
          console.error(`Error obteniendo justificación para ${candidate.json_data.nombre}:`, error);
          this.candidateJustifications[candidate.json_data._id] = 'No se pudo obtener la justificación.';
        }
      });
    });
  }
}
