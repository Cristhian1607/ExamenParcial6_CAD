import { Component } from '@angular/core';
import { TaskListComponent } from './components/task-list.component';

@Component({
  imports: [TaskListComponent],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
