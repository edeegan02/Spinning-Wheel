import { Routes } from '@angular/router';

import { Rng } from './rng/rng';
import { Wheel } from './wheel/wheel';

export const routes: Routes = [
  { path: '', component: Wheel, pathMatch: 'full' },
  { path: 'rng', component: Rng },
];
