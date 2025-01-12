import { Component, ViewChild } from '@angular/core';
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
import { CandidateResult, SearchResponse } from '../../interfaces/candidate.interface';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatComponent } from "../chat-modal/chat.component";
import { PdfService } from '../../services/pdf.service';

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
    MatListModule,
    MatTooltipModule,
    ChatComponent
],
  providers: [CandidateService],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @ViewChild(ChatComponent) chatModal!: ChatComponent;
  searchTerm: string = '';
  isSearching: boolean = false;
  watchDetail: boolean = false;
  detailJustification: string = '';
  errorMessage?: string = '';
  actualDetail: CandidateResult = {json_data:{
    _id: '',
    conocimientos: [],
    educacion: [],
    email: '',
    experiencia: [],
    idiomas: [],
    nombre: '',
    perfil: '',
    skills: [],
    telefono: '',
    ubicacion: ''
  },
  matched_skills: []
  };
  result_of_candidates: SearchResponse | null = null;

  constructor(private candidateService: CandidateService, private pdfService: PdfService) { }

  onSearch(): void {
    if (!this.searchTerm?.trim()) return;

    this.isSearching = true;
    this.result_of_candidates = null;
    this.watchDetail = false;
    this.candidateService.searchCandidates(this.searchTerm)
      .subscribe({
        next: (results) => {
          if(results.status === 500){
            this.errorMessage = `- ${results.msg}`;
            this.result_of_candidates = {result: []}
            this.isSearching = false;
            return
          }
          this.errorMessage = '';
          this.result_of_candidates = results;
          this.isSearching = false;
        },
        error: (error) => {
          console.error('Error en la búsqueda:', error);
          this.isSearching = false;
        }
      });
  }

  onViewCV(candidateObj: CandidateResult): void {
    this.detailJustification = ''
    this.getCandidateJustifications(candidateObj)
    this.actualDetail = candidateObj;
    this.watchDetail = true;

  }

  onBack(){
    this.watchDetail = false;
  }

  private getCandidateJustifications(candidate: CandidateResult): void {
      this.candidateService.justifyCandidate({
        user_promt: this.searchTerm,
        candidate: candidate.json_data,
        searched_skills: this.result_of_candidates?.searched_skills || [],
        matched_skills: candidate.matched_skills
      }).subscribe({
        next: (response) => {
          this.detailJustification = response.msg;
        },
        error: (error) => {
          console.error(`Error obteniendo justificación para ${candidate.json_data?.nombre}:`, error);
          this.detailJustification = 'No se pudo obtener la justificación.';
        }
      });
  }

  getColorClass(score: number): string {
    if (score <= 0.40) {
      return 'red-circle';
    } else if (score > 0.40 && score <= 0.70) {
      return 'yellow-circle';
    } else {
      return 'green-circle';
    }
  }

  abrirChat() {
    this.chatModal.open();
  }

  downloadPDF(): void {
    this.pdfService.generatePdf(this.actualDetail.json_data);
  }

  public get isJustificationEmpty() : boolean {
    return this.detailJustification.trim().length === 0
  }

}
