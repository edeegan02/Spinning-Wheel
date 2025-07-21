// import { DragDropModule } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ChangeDetectorRef, ElementRef, ViewChild,  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'Wheel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './wheel.html',
  styleUrls: ['./wheel.css'],
})
//
//
export class Wheel implements AfterViewInit {
  constructor(private cdr: ChangeDetectorRef) {}
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
  ]; // Default items
  newItem: string = '';

  rotationAngle = 0;
  spinning = false;

itemText: string = JSON.stringify(this.items); // for textarea


  ngAfterViewInit(): void {
  const storedWinner = localStorage.getItem('winner');
  if (storedWinner) {
    this.winner = storedWinner;
  }
  this.drawWheel();
}

  MakeArr = () => {
  try {
    const parsed = JSON.parse(this.itemText);
    if (Array.isArray(parsed)) {
      this.items = parsed.map((item: any) => item.toString());
      this.drawWheel();
    }
  } catch (e) {
    console.error("Invalid JSON input", e);
  }
};


  // started code for dragging items
  //  newX = 0; newY = 0; startX = 0; startY = 0;
  //  card = document.getElementById('card')

  Drag = document.getElementById('card');

  getRandomInteger(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //function for spinning wheel
  spinWheel(): void {
    if (this.spinning) return;
    this.spinning = true;
    this.winner = null;

    let velocity = 100.0 * this.getRandomInteger(1, 6); // initial speed
    console.log('velocity:', velocity);
    const friction = 0.975; // slows over time

    const animate = () => {
      if (velocity > 0.002) {
        this.rotationAngle += velocity;
          velocity *= friction;

      const normalizedRotation = this.rotationAngle % (2 * Math.PI);
      const segmentAngle = (2 * Math.PI) / this.items.length;
      

      const smallOffset = segmentAngle / 2.5; // or try /2.3, /2.7 etc. if still off
      const adjustedRotation = (normalizedRotation + smallOffset) % (2 * Math.PI);
      const index = (this.items.length - Math.floor(adjustedRotation / segmentAngle)) % this.items.length;

      
      this.winner = this.items[index];
      this.cdr.detectChanges();

      this.drawWheel();
      requestAnimationFrame(animate);
  } else {
      this.spinning = false;

      const normalizedRotation = this.rotationAngle % (2 * Math.PI);
      const segmentAngle = (2 * Math.PI) / this.items.length;
      const index = (this.items.length - Math.floor(normalizedRotation / segmentAngle)) % this.items.length;
      this.winner = this.items[index];

      localStorage.setItem('winner', this.winner);
      
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
      this.drawWheel(); // Redraw with new item
      // this.triangle();
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

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous draw
    ctx.save();

    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotationAngle);

    this.items.forEach((item, index) => {
      // const startAngle = index + segmentAngle;
      const startAngle = index * segmentAngle + this.rotation_angle;
      const endAngle = startAngle + segmentAngle;

      // Set color
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `hsl(${(index * 360) / this.items.length}, 80%, 70%)`;
      ctx.fill();

      // Draw text
      // const textAngle = startAngle + segmentAngle / 2;
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
