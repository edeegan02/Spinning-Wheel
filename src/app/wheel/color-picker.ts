import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  template: `
    <mat-card class="color-picker-card">
      <div class="color-picker-container">
        <h2 class="mat-h2">Select a Color</h2>
        <div class="color-wheel-wrapper">
          <canvas
            #colorWheelCanvas
            class="color-wheel-canvas"
            (mousedown)="onMouseDown($event)"
            (mousemove)="onMouseMove($event)"
            (mouseup)="onMouseUp()"
            (mouseleave)="onMouseUp()"
          ></canvas>
          <div
            class="picker-handle"
            [style.left]="pickerX + 'px'"
            [style.top]="pickerY + 'px'"
          ></div>
          <div
            class="color-picker-preview"
            [style.background-color]="selectedColor"
            [matTooltip]="'Selected Color: ' + selectedColor"
            matTooltipPosition="below"
          ></div>
        </div>

        <mat-form-field appearance="outline" class="hex-input-field">
          <mat-label>Hex Code</mat-label>
          <input
            matInput
            type="text"
            [value]="selectedColor"
            (input)="onHexInputChange($event)"
            placeholder="#FFFFFF"
          />
        </mat-form-field>

        <div class="slider-container">
          <label class="slider-label">Brightness: {{ brightness }}</label>
          <mat-slider
            class="brightness-slider"
            min="0"
            max="100"
            step="1"
            [(ngModel)]="brightness"
            (ngModelChange)="onBrightnessChange()"
            matTooltip="Adjust Brightness"
          >
            <input matSliderThumb [(ngModel)]="brightness" />
          </mat-slider>
        </div>

        <mat-divider></mat-divider>

        <div class="dialog-actions">
          <button mat-raised-button color="primary" (click)="applyColor()">
            Apply
          </button>
          <button mat-button (click)="cancel()">Cancel</button>
        </div>
      </div>
    </mat-card>
  `,
  styles: `
    .color-picker-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .color-picker-container {
      width: 100%;
      max-width: 300px;
    }
    .color-wheel-wrapper {
      position: relative;
      width: 250px;
      height: 250px;
      margin: 20px auto;
    }
    .color-wheel-canvas {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      cursor: crosshair;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
    .color-picker-preview {
      width: 60px;
      height: 60px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 3px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    .picker-handle {
      position: absolute;
      width: 12px;
      height: 12px;
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
    .hex-input-field {
      width: 100%;
      margin-top: 16px;
    }
    .slider-container {
      width: 100%;
      margin-top: 24px;
    }
    .slider-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
    }
    .brightness-slider {
      width: 100%;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
  `,
})
export class ColorPickerComponent implements AfterViewInit {
  @ViewChild('colorWheelCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  @Output() colorApplied = new EventEmitter<string>();
  @Output() colorCanceled = new EventEmitter<void>();

  private ctx!: CanvasRenderingContext2D;
  private isDragging = false;

  // Base color from the wheel (hue and saturation)
  private hue = 0;
  private saturation = 100;

  // Base color as RGB (before brightness adjustment)
  private baseR = 255;
  private baseG = 0;
  private baseB = 0;

  pickerX: number = 0;
  pickerY: number = 0;

  selectedColor: string = '#FF0000';
  brightness: number = 50;

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.drawColorWheel();
    this.updatePickerPositionFromHsl();
    this.updateBaseColor();
    this.updateSelectedColor();
  }

  private drawColorWheel(): void {
    const canvas = this.canvas.nativeElement;
    const size = 250;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;

    this.ctx.clearRect(0, 0, size, size);

    // Create the hue wheel
    const hueGradient = this.ctx.createConicGradient(0, centerX, centerY);
    for (let i = 0; i <= 360; i += 1) {
      hueGradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }
    this.ctx.fillStyle = hueGradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fill();

    // Add saturation gradient (white to transparent from center to edge)
    const saturationGradient = this.ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );
    saturationGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    saturationGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.ctx.fillStyle = saturationGradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  private updateColorFromMouse(event: MouseEvent): void {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;

    // Calculate distance from center
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = rect.width / 2;

    // Don't allow selection outside the circle
    if (distance > maxRadius) {
      return;
    }

    // Calculate hue from angle
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    this.hue = (angle + 360) % 360;

    // Calculate saturation from distance
    this.saturation = Math.min(100, (distance / maxRadius) * 100);

    this.updatePickerPosition(x, y);
    this.updateBaseColor();
    this.updateSelectedColor();
  }

  private updatePickerPosition(x: number, y: number): void {
    this.pickerX = x;
    this.pickerY = y;
  }

  private updatePickerPositionFromHsl(): void {
    const size = 250;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;

    const angle = (this.hue * Math.PI) / 180;
    const distance = (this.saturation / 100) * radius;

    this.pickerX = centerX + distance * Math.cos(angle);
    this.pickerY = centerY + distance * Math.sin(angle);
  }

  // Calculate the base color from hue and saturation (at 50% lightness)
  private updateBaseColor(): void {
    const rgb = this.hslToRgb(this.hue, this.saturation, 50);
    this.baseR = rgb.r;
    this.baseG = rgb.g;
    this.baseB = rgb.b;
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.updateColorFromMouse(event);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.updateColorFromMouse(event);
    }
  }

  onMouseUp(): void {
    this.isDragging = false;
  }

  onBrightnessChange(): void {
    console.log('Brightness changed to:', this.brightness); // Debug log
    this.updateSelectedColor();
  }

  onHexInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/i;
    if (hexRegex.test(value)) {
      this.selectedColor = value.toUpperCase();

      // Update internal values from hex
      const rgb = this.hexToRgb(value);
      if (rgb) {
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        this.hue = hsl.h;
        this.saturation = hsl.s;
        this.brightness = hsl.l;
        this.updateBaseColor();
        this.updatePickerPositionFromHsl();
      }
    }
  }

  // Apply brightness to the base color
  private updateSelectedColor(): void {
    // Convert brightness (0-100) to a multiplier
    const brightnessFactor = this.brightness / 50; // 50 is the neutral point

    let r, g, b;

    if (brightnessFactor <= 1) {
      // Darken: interpolate between black and base color
      r = this.baseR * brightnessFactor;
      g = this.baseG * brightnessFactor;
      b = this.baseB * brightnessFactor;
    } else {
      // Lighten: interpolate between base color and white
      const lightenFactor = brightnessFactor - 1;
      r = this.baseR + (255 - this.baseR) * lightenFactor;
      g = this.baseG + (255 - this.baseG) * lightenFactor;
      b = this.baseB + (255 - this.baseB) * lightenFactor;
    }

    // Clamp values to 0-255
    r = Math.max(0, Math.min(255, Math.round(r)));
    g = Math.max(0, Math.min(255, Math.round(g)));
    b = Math.max(0, Math.min(255, Math.round(b)));

    this.selectedColor = this.rgbToHex(r, g, b);
  }

  applyColor(): void {
    this.colorApplied.emit(this.selectedColor);
  }

  cancel(): void {
    this.colorCanceled.emit();
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    const toHex = (c: number) => {
      const hex = Math.round(c).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  private rgbToHsl(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  private hslToRgb(
    h: number,
    s: number,
    l: number
  ): { r: number; g: number; b: number } {
    s /= 100;
    l /= 100;

    const hueToRgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToRgb(p, q, (h / 360 + 1 / 3) % 1);
      g = hueToRgb(p, q, h / 360);
      b = hueToRgb(p, q, (h / 360 - 1 / 3 + 1) % 1);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }
}
