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

  constructor(private candidateService: CandidateService) {}

  onSearch(): void {
    if (!this.searchTerm?.trim()) return;
    
    this.isSearching = true;
    this.result_of_candidates = null;

    this.candidateService.searchCandidates(this.searchTerm)
      .subscribe({
        next: (results) => {
          this.result_of_candidates = results;
          this.isSearching = false;
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
}
