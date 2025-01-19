// src/app/services/candidate.service.ts
import { Injectable } from '@angular/core';
import { SearchResponse } from '../interfaces/candidate.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AIPayload, AIResponse } from '../interfaces/ai.interface';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
    private baseUrl = 'http://127.0.0.1:5000';
    // private baseUrl = 'https://talent-backend.orangegrass-f60c0e61.brazilsouth.azurecontainerapps.io';
    constructor(private http: HttpClient) {}

    searchCandidates(term: string): Observable<SearchResponse> {
        const encodedTerm = encodeURIComponent(term);
        return this.http.get<SearchResponse>(`${this.baseUrl}/search_candidates/${encodedTerm}`);
    }

    searchByName(name: string): Observable<SearchResponse> {
      const encodedTerm = encodeURIComponent(name);
      return this.http.get<SearchResponse>(`${this.baseUrl}/search-by-name/${encodedTerm}`);
    }

    justifyCandidate(candidateData: any): Observable<{ msg: string }> {
        return this.http.post<{ msg: string }>(`${this.baseUrl}/justify_candidate`, candidateData);
    }

    pdfEnrichmentChat(payload: AIPayload): Observable<AIResponse> {
      return this.http.post<AIResponse>(`${this.baseUrl}/enrichment-chat`, payload);
    }

    pdfUpdateChat(payload: AIPayload): Observable<AIResponse> {
      return this.http.post<AIResponse>(`${this.baseUrl}/update-chat`, payload);
    }

    saveCV(id: string, payload: any): Observable<any> {
      const encodedTerm = encodeURIComponent(id);
      return this.http.post<any>(`${this.baseUrl}/save-cv/${encodedTerm}`, payload);
    }
}
