import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'Wheel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './wheel.html',
  styleUrls: ['./wheel.css'],
})
export class Wheel implements AfterViewInit {
  items: string[] = ['Apple', 'Banana', 'Cherry']; // Default items
  newItem: string = '';

  ngAfterViewInit(): void {
    this.drawWheel();
  }

  addItem(): void {
    if (this.newItem.trim()) {
      this.items.push(this.newItem.trim());
      this.newItem = '';
      this.drawWheel(); // Redraw with new item
    }
  }

  drawWheel(): void {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;

    const segmentAngle = (2 * Math.PI) / this.items.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous draw

    this.items.forEach((item, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      // Set color
      ctx.fillStyle = `hsl(${(index * 360) / this.items.length}, 80%, 70%)`;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      // Draw text
      const textAngle = startAngle + segmentAngle / 2;
      const textX = centerX + Math.cos(textAngle) * (radius * 0.6);
      const textY = centerY + Math.sin(textAngle) * (radius * 0.6);
      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item, textX, textY);
    });
  }
}
