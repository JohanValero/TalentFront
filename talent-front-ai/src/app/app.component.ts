import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'talent-front-ai';
  isSelected1 = false;
  isSelected2 = false;
  isSelected3 = false;

  constructor(private router: Router){}

  selectComponent(component: number) {
    // Resetear la selección de los íconos
    this.isSelected1 = false;
    this.isSelected2 = false;
    this.isSelected3 = false;

    // Establecer el ícono seleccionado
    if (component === 1) {
      this.isSelected1 = true;
      this.router.navigate(['/search']);
    } else if (component === 2) {
      this.isSelected2 = true;
      this.router.navigate(['/update']);
    } else if (component === 3) {
      this.isSelected3 = true;
      this.router.navigate(['/end-session']);
    }
  }
}
