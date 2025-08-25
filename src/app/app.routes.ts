import { Routes } from '@angular/router';

// import { Rng } from './rng/rng';
import { Wheel } from './wheel/wheel';

// import { UI } from './ui/ui';

export const routes: Routes = [
  { path: '', component: Wheel, pathMatch: 'full' },
  // { path: 'dashboard', component: UI },
  // { path: 'rng', component: Rng },
];
