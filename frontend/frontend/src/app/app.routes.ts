import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ExploreComponent } from './components/explore/explore.component';
import { CreateComponent } from './components/create/create.component';
import { AuthGuard } from '../services/guards/auth.guard';
import { ConversationGuard } from '../services/guards/conversation.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent},
    { path: 'mess/:name/:chat', component: ChatComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent},
    { path: 'profile/:name', component: ProfileComponent, canActivate: [AuthGuard]},
    { path: 'explore/:name', component: ExploreComponent, canActivate: [AuthGuard]},
    { path: 'create/:name', component: CreateComponent, canActivate: [AuthGuard]},
    { path: 'reset-password/:id', component: ResetPasswordComponent},
    { path: 'update-password', component: UpdatePasswordComponent}
];
