import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ColorPickerComponent } from './color-picker';

@Component({
  selector: 'app-color-changer-dialog',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    ColorPickerComponent,
  ],
  template: `
    <app-color-picker
      (colorApplied)="dialogRef.close($event)"
      (colorCanceled)="dialogRef.close()"
    ></app-color-picker>

    <h2 class="dialog-title">Change Background Color</h2>
    <div class="color-options">
      <button
        mat-button
        class="color-button red"
        [mat-dialog-close]="'#f82727ff'"
      >
        Red
      </button>
      <button
        mat-button
        class="color-button blue"
        [mat-dialog-close]="'#25b1f7ff'"
      >
        Blue
      </button>
      <button
        mat-button
        class="color-button green"
        [mat-dialog-close]="'#51ac51ff'"
      >
        Green
      </button>
      <button
        mat-button
        class="color-button yellow"
        [mat-dialog-close]="'#fdfd69ff'"
      >
        Yellow
      </button>
      <button
        mat-button
        class="color-button white"
        [mat-dialog-close]="'#ffffff'"
      >
        White
      </button>
    </div>
    <div class="dialog-actions">
      <button mat-button [mat-dialog-close]="'#ffffff'">Cancel</button>
    </div>
  `,
  styles: [
    `
      .dialog-title {
        font-family: 'Inter', sans-serif;
        text-align: center;
        color: #333;
      }
      .color-options {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        padding: 20px;
      }
      .color-button {
        width: 80px;
        height: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        color: #333;
        font-weight: bold;
        transition: transform 0.2s;
      }
      .color-button:hover {
        transform: scale(1.05);
      }
      .red {
        background-color: #f82727ff;
      }
      .blue {
        background-color: #25b1f7ff;
      }
      .green {
        background-color: #51ac51ff;
      }
      .yellow {
        background-color: #fdfd69ff;
      }
      .white {
        background-color: #ffffff;
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        padding: 10px 20px;
      }
    `,
  ],
})
export class ColorChangerDialog {
  rValue: number = 255;
  gValue: number = 255;
  bValue: number = 255;

  constructor(public dialogRef: MatDialogRef<ColorChangerDialog>) {}

  createRgbColor(): string {
    const r = this.clamp(this.rValue, 0, 255);
    const g = this.clamp(this.gValue, 0, 255);
    const b = this.clamp(this.bValue, 0, 255);
    return 'rgb(${r}, ${g}, ${b})';
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
