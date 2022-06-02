import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(fitlerDto: GetTaskFilterDto): Task[] {
    const { status, search } = fitlerDto;

    // define a temp array to hold the result
    let tasks = this.getAllTasks();

    //do something with status
    if (status) {
      tasks = tasks.filter((task: Task) => task.status === status);
    }

    //do something with search
    if (search) {
      tasks = tasks.filter((task: Task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        } else {
          return false;
        }
      });
    }

    //return final result
    return tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task: Task) => {
      return task.id === id;
    });
  }

  deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter((task: Task) => task.id !== id);
  }

  updateTaskById(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }
}
