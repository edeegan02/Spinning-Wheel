import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'wheel',
  imports: [],
  templateUrl: './wheel.html',
  styleUrl: './wheel.css',
})
export class Wheel implements AfterViewInit {
  ngAfterViewInit(): void {
    this.draw_circle();
  }
  //cavas ele

  //2d render?

  draw_circle() {
    let canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D = canvas?.getContext('2d')!;
    console.log(ctx);
    if (ctx) {
      //circle prop
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 150;

      //new path
      ctx.beginPath();

      //Draw arc (circle)
      //arc(x, y, radius, startAngle, endAngle, counterclockwise)
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

      //Set Line style (optional)
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#';

      // Draw circle outline
      ctx.stroke();

      //Fill circle color
      ctx.fillStyle = 'red';
      ctx.fill();
    } else {
      console.error('Could not get 2D rendering context for canvas.');
    }
  }
}
