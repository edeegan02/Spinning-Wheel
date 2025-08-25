import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ColorChangerDialog } from './color-changer-dialog';

@Component({
  selector: 'Wheel',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    DragDropModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './wheel.html',
  styleUrls: ['./wheel.css'],
})
export class Wheel implements AfterViewInit {
  constructor(private cdr: ChangeDetectorRef, public dialog: MatDialog) {}

  winner: string | null = null;
  private ctx!: CanvasRenderingContext2D;
  items: string[] = [
    'Apple',
    'Banana',
    'Cherry',
    'Mango',
    'Grape',
    'Watermelon',
    'Blueberry',
    'Strawberry',
    'Orange',
  ];
  newItem: string = '';
  rotationAngle = 0;
  spinning = false;

  itemText: string = this.items.join(', ');
  previousWinners: string[] = [];

  uiComponents = [
    { id: 'input', type: 'input', label: 'Add Item Input' },
    { id: 'buttons', type: 'buttons', label: 'Action Buttons' },
    { id: 'textarea', type: 'textarea', label: 'Items JSON Editor' },
  ];

  backgroundColor: string = '#ffffff';

  openColorChangerDialog(): void {
    const dialogRef = this.dialog.open(ColorChangerDialog, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.backgroundColor = result;
      }
    });
  }

  dropUIComponent(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.uiComponents, event.previousIndex, event.currentIndex);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    this.itemText = this.items.join(', ');
    this.drawWheel();
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.itemText = this.items.join(', ');
    this.drawWheel();
  }

  ngAfterViewInit(): void {
    const storedWinners = localStorage.getItem('previousWinners');
    if (storedWinners) {
      this.previousWinners = JSON.parse(storedWinners);
    }
    const storedWinner = localStorage.getItem('winner');
    if (storedWinner) {
      this.winner = storedWinner;
    }
    this.drawWheel();
  }

  // REVISED: This method now correctly handles a comma-separated string
  MakeArr = () => {
    try {
      const newItems = this.itemText
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== ''); // Filter out any empty items from extra commas
      if (newItems.length > 0) {
        this.items = newItems;
        this.drawWheel();
      } else {
        // Optional: clear the wheel if the input is empty
        this.items = [];
        this.drawWheel();
      }
    } catch (e) {
      console.error('Invalid input', e);
    }
  };

  Drag = document.getElementById('card');

  getRandomInteger(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  spinWheel(): void {
    if (this.spinning) return;
    this.spinning = true;
    this.winner = null;
    let velocity = 100.0 * this.getRandomInteger(1, 6);
    const friction = 0.975;

    const animate = () => {
      if (velocity > 0.002) {
        this.rotationAngle += velocity;
        velocity *= friction;
        const normalizedRotation = this.rotationAngle % (2 * Math.PI);
        const segmentAngle = (2 * Math.PI) / this.items.length;
        const pointerPosition =
          (2 * Math.PI - normalizedRotation) % (2 * Math.PI);
        const index =
          Math.floor(pointerPosition / segmentAngle) % this.items.length;
        this.winner = this.items[index];
        this.cdr.detectChanges();
        this.drawWheel();
        requestAnimationFrame(animate);
      } else {
        this.spinning = false;
        const normalizedRotation = this.rotationAngle % (2 * Math.PI);
        const segmentAngle = (2 * Math.PI) / this.items.length;
        const pointerPosition =
          (2 * Math.PI - normalizedRotation) % (2 * Math.PI);
        const index =
          Math.floor(pointerPosition / segmentAngle) % this.items.length;
        this.winner = this.items[index];
        localStorage.setItem('winner', this.winner);

        if (this.winner) {
          this.previousWinners.unshift(this.winner);
          if (this.previousWinners.length > 10) {
            this.previousWinners.pop();
          }
          localStorage.setItem(
            'previousWinners',
            JSON.stringify(this.previousWinners)
          );
        }

        this.drawWheel();
        this.cdr.detectChanges();
      }
    };
    animate();
  }

  addItem(): void {
    if (this.newItem.trim()) {
      this.items.push(this.newItem.trim());
      this.newItem = '';
      this.drawWheel();
    }
  }

  spin = () => {
    this.drawWheel();
  };

  rotation_angle: number = 0;
  drawWheel(): void {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 250;
    const segmentAngle = (2 * Math.PI) / this.items.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotationAngle);
    this.items.forEach((item, index) => {
      const startAngle = index * segmentAngle + this.rotation_angle;
      const endAngle = startAngle + segmentAngle;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `hsl(${(index * 360) / this.items.length}, 80%, 70%)`;
      ctx.fill();
      const textAngle = startAngle + segmentAngle / 2;
      const textX = Math.cos(textAngle) * (radius * 0.6);
      const textY = Math.sin(textAngle) * (radius * 0.6);
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle);
      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item, 0, 0);
      ctx.restore();
    });
    ctx.restore();
    this.triangle();
  }

  triangle(): void {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 300;
    const triangleWidth = 50;
    const triangleHeight = 80;
    const tipX = centerX + radius + 10;
    const tipY = centerY;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX + triangleWidth, tipY - triangleHeight / 2);
    ctx.lineTo(tipX + triangleWidth, tipY + triangleHeight / 2);
    ctx.closePath();
    ctx.fillStyle = '#8F00FF';
    ctx.fill();
  }
}
