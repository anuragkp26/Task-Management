import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  username: 'akp',
  id: 'sampleId',
  password: 'samplePassword',
  tasks: [],
};

const mockTaskRepository = () => ({
  getTasksWithFilters: jest.fn(),
  findOneBy: jest.fn(),
});

describe('TasksService', () => {
  let taskService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    //initialise a modulle, service and repository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    taskService = module.get(TasksService);
    taskRepository = module.get(TasksRepository);
  });

  describe('getTasksWithFilters', () => {
    it('call TasksRepository.getTasksWithFilters and return the results', async () => {
      expect(taskRepository.getTasksWithFilters).not.toHaveBeenCalled();
      //call taskRepository.getTasksWithFilters
      // using mockResolvedValue because we actually return a promise else use mockReturnValue
      taskRepository.getTasksWithFilters.mockResolvedValue('some value');
      const result = await taskService.getTasksWithFilters(null, mockUser);
      expect(taskRepository.getTasksWithFilters).toHaveBeenCalled();
      expect(result).toEqual('some value');
    });
  });

  describe('getTaskById', () => {
    it('call tasksRepository.findOneBy returns result', async () => {
      const mockTask = {
        id: 'testId1',
        title: 'test title',
        description: 'Test description',
        status: TaskStatus.OPEN,
        user: mockUser,
      };
      taskRepository.findOneBy.mockResolvedValue(mockTask);
      const result = await taskService.getTaskById('testId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('call tasksRepository.findOneBy and handles an error', async () => {
      taskRepository.findOneBy.mockResolvedValue(null);
      expect(taskService.getTaskById('testId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
