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
  items: string[] = [
    'Apple',
    'Banana',
    'Cherry',
    'Mango',
    'Grape',
    'Orange',
    'Durian',
    'Plum',
    'Dragonfruit',
    'Kiwi',
    'Pineapple',
    'Star fruit',
    'Watermelon',
    'Blueberry',
    'Strawberry',
    'Orange',
  ]; // Default items
  newItem: string = '';

  rotationAngle = 0
  spinning = false;

  ngAfterViewInit(): void {
    this.drawWheel();
  }


  spinWheel(): void {
  if (this.spinning) return;
  this.spinning = true;

  let velocity = 0.3; // initial speed
  const friction = 0.98; // slows over time

  const animate = () => {
    if (velocity > 0.002) {
      this.rotationAngle += velocity;
      velocity *= friction;
      this.drawWheel();
      requestAnimationFrame(animate);
    } else {
      this.spinning = false;
    }
  };

  animate();
}




  addItem(): void {
    if (this.newItem.trim()) {
      this.items.push(this.newItem.trim());
      this.newItem = '';
      this.drawWheel(); // Redraw with new item
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
    const radius = 200;
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
  }
}
