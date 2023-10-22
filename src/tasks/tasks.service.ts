import { Injectable } from '@nestjs/common';
//import { InjectRepository } from '@nestjs/typeorm';
//import { v4 as uuid } from 'uuid';

//import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    //@InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id: id, user });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteById(id: string, user: User): Promise<void> {
    //const result = await this.tasksRepository.delete(id);
    const result = await this.tasksRepository.delete({ id, user });

    //console.log(result);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    statusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const { status } = statusDto;

    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);

    return task;

    //const result = await this.tasksRepository.update(id, { status: status })
    //console.log(result)
  }

  getTasksWithFilters(
    filtqDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return this.tasksRepository.getTasksWithFilters(filtqDto, user);
  }

  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTasksWithFilters(filtqDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filtqDto;

  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((t) => t.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter(
  //       (t) =>
  //         t.title.toLowerCase().includes(search.toLowerCase()) ||
  //         t.description.toLowerCase().includes(search.toLowerCase()),
  //     );
  //   }

  //   return tasks;
  // }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;

  //   const task = {
  //     id: uuid(),
  //     title: title,
  //     description: description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }

  // getTaskById(id: string): Task {
  //   const task = this.tasks.find((t) => t.id === id);

  //   if (!task) {
  //     throw new NotFoundException(`Task with ID ${id} not found`);
  //   }

  //   return task;
  // }

  // deleteById(id: string): Task[] {
  //   const task = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((t) => t.id !== task.id);
  //   return this.tasks;
  // }

  // updateTaskStatus(id: string, statusDto: UpdateTaskStatusDto) {
  //   const { status } = statusDto
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
