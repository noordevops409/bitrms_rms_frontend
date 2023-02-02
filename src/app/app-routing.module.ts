import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/pages/dashboard', pathMatch: 'full' },
  { path: 'pages', canActivate: [AuthGuardService], loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
