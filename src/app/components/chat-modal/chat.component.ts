import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatMessage, AIResponse, AIPayload } from '../../interfaces/ai.interface';
import { CandidateService } from '../../services/candidate.service';
import { PdfService } from '../../services/pdf.service';
import { finalize } from 'rxjs';
import { CvPreviewComponent } from "../cv-preview/cv-preview.component";
import { CandidateData, CandidateResult } from '../../interfaces/candidate.interface';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    CvPreviewComponent
],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @Input() originalData !: CandidateResult;

  isOpen : boolean = false;
  messages : ChatMessage[] = [];
  currentMessage : string = '';
  isLoading : boolean = false;
  isDownloadable = false;
  chatHistory : string[] = [];
  lastPdfData : CandidateData | null = null;

  constructor(private candidateService: CandidateService, private pdfService: PdfService) {}

  ngOnInit() {
    this.messages = [{
      content: '¡Hola! ¿Como desea enriquecer la hoja de vida?',
      isUser: false,
      timestamp: new Date()
    }];
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  closeOnBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).className === 'modal-backdrop') {
      this.close();
    }
  }

  async sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const userMessage: ChatMessage = {
      content: this.currentMessage,
      isUser: true,
      timestamp: new Date()
    };
    this.messages.push(userMessage);

    const messageToSend = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;
    let data_to_send : CandidateResult | null = null;

    if(this.lastPdfData == null)
      data_to_send = this.originalData;
    else
      data_to_send = {"json_data": this.lastPdfData, "matched_skills": []};

    const payload: AIPayload = {
      original_data: data_to_send,
      user_prompt: messageToSend,
      chat_history: this.messages
    };

    await this.candidateService.pdfEnrichmentChat(payload)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.scrollToBottom();
        })
      )
      .subscribe({
          next: (response : AIResponse) => {
              this.isDownloadable = response.isDownloadable;
              if (response.pdf_file) {
                this.lastPdfData = response.pdf_file;
              }

              this.messages.push({
                content: response.bot_response,
                isUser: false,
                timestamp: new Date()
              });

              this.chatHistory.push(messageToSend);
          },
          error: (error) => {
            console.error('Error al enviar mensaje:', error);
            this.messages.push({
              content: 'Lo siento, hubo un error al procesar tu mensaje.',
              isUser: false,
              timestamp: new Date()
            });
          }
      });
  }

  clearChatHistory(): void {
    this.chatHistory = [];
    this.messages = [{
      content: '¡Hola! ¿Como desea enriquecer la hoja de vida?',
      isUser: false,
      timestamp: new Date()
    }];
    this.isDownloadable = false;
    this.lastPdfData = null;
  }

  downloadEnrichedPDF(): void {
    if (!this.lastPdfData) return;
    if (this.lastPdfData != null) this.pdfService.generatePdf(this.lastPdfData);
  }

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      }, 100);
    } catch(err) {}
  }
}
