import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Aboutus } from './pages/aboutus/aboutus';
import { Team } from './pages/team/team';
import { Contactus } from './pages/contactus/contactus';
import { ProjectNew } from './admin/project/project-new/project-new';
import { ProjectList } from './admin/project/project-list/project-list';

export const routes: Routes = [
    {path: "home", component: Home},
    {path: "aboutus", component: Aboutus},
    {path: "team", component: Team},
    {path: "contactus", component: Contactus},
    {path: "admin/project/new", component: ProjectNew},
    {path: "admin/project/list", component: ProjectList},

];
