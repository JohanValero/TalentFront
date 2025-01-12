import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateData } from '../../interfaces/candidate.interface';

@Component({
  selector: 'app-cv-preview',
  imports: [CommonModule],
  templateUrl: './cv-preview.component.html',
  styleUrl: './cv-preview.component.scss'
})
export class CvPreviewComponent {
  @Input() json_data !: CandidateData;

  constructor() {}
}
