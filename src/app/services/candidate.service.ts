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
    constructor(private http: HttpClient) {}

    searchCandidates(term: string): Observable<SearchResponse> {
        const encodedTerm = encodeURIComponent(term);
        return this.http.get<SearchResponse>(`${this.baseUrl}/search_candidates/${encodedTerm}`);
    }

    justifyCandidate(candidateData: any): Observable<{ msg: string }> {
        return this.http.post<{ msg: string }>(`${this.baseUrl}/justify_candidate`, candidateData);
    }

    pdfEnrichmentChat(payload: AIPayload): Observable<AIResponse> {
      return this.http.post<AIResponse>(`${this.baseUrl}/enrichment-chat`, payload);
    }
}
