import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(
    private configService: ConfigService,
    private taskService: TasksService,
  ) {
    console.log(configService.get('TEST_ENV_VALUE'));
  }

  @Get(':id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `createTask - by ${user.username} - taskDto : ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteById(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, statusDto, user);
  }

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`getTasks - user : ${user.username}`);
    this.logger.verbose(`getTasks - Filters : ${JSON.stringify(filterDto)}`);
    return this.taskService.getTasksWithFilters(filterDto, user);
  }

  // @Get()
  // getAllTasks(): Task[] {
  //   return this.taskService.getAllTasks();
  // }

  // @Get('filter')
  // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //   if(Object.keys(filterDto).length){
  //     return this.taskService.getTasksWithFilters(filterDto);
  //   } else {
  //     return this.taskService.getAllTasks();
  //   }
  // }

  //   @Post()
  //   createTask(@Body() body) {
  //     console.log('body', body);
  //   }/

  // @Post()
  // createTask(
  //   @Body('title') title: string,
  //   @Body('description') description: string,
  // ): Task {
  //   return this.taskService.createTask(title, description);
  // }

  // @Post()
  // createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //   return this.taskService.createTask(createTaskDto);
  // }

  // @Get(':id')
  // getTaskById(@Param('id') id: any) : Task {
  //   return this.taskService.getTaskById(id);
  // }

  // @Delete(':id')
  // deleteById(@Param('id') id: string) : Task[] {
  //   return this.taskService.deleteById(id);
  // }

  // @Patch(':id/status')
  // updateTaskStatus(@Param('id') id: string, @Body() statusDto: UpdateTaskStatusDto): Task {
  //   return this.taskService.updateTaskStatus(id, statusDto)
  // }
}
