// This file contains the task data for the application.
export const tasks = [
  {
    id: 'TASK-1',
    nameTask: 'We need to bypass the neural TCP card!', // corrected property name
    description: 'We need to bypass the neural TCP card!',
    startDate: '2023-10-01',
    endDate: '2023-10-10',
    budgetTask: 100000,
    statusTask: 'in_progress',
    priorityTask: 'low',
    projectId: '1',
    parentTaskId: 'PARENT-TASK-1', // corrected property name asigned or included to parentTask id
    subTasks: ['CHILD-TASK-2', 'CHILD-TASK-3', 'CHILD-TASK-4'], // corrected property name asigned or included to subTask id
    progressTask: 50, // acumulated progressTask from subTask with grouping
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), // added comment to indicate the last edit
  }, // added a comma to separate tasks if more are added later
  {
    id: 'TASK-2',
    nameTask: 'We need to bypass the neural TCP card!',
    description: 'We need to bypass the neural TCP card!',
    startDate: '2023-10-01',
    endDate: '2023-10-10',
    budgetTask: 100000,
    statusTask: 'in_progress',
    priorityTask: 'low', // changed from 'medium' to 'low'
    projectId: '1',
    parentTaskId: 'PARENT-TASK-1', // corrected property name asigned or included to parentTask id
    subTasks: [], // corrected property name asigned or included to subTask id
    progressTask: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), // added comment to indicate the last edit
  },
  {
    id: 'TASK-3',
    nameTask: 'We need to bypass the neural TCP card!',
    description: 'We need to bypass the neural TCP card!',
    startDate: '2023-10-01',
    endDate: '2023-10-10',
    budgetTask: 100000,
    statusTask: 'in_progress',
    priorityTask: 'high',
    projectId: '1',
    parentTaskId: 'PARENT-TASK-1',
    subTasks: [],
    progressTask: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), // added comment to indicate the last edit
  },
  {
    id: 'TASK-4',
    nameTask: 'We need to bypass the neural TCP card!',
    description: 'We need to bypass the neural TCP card!',
    startDate: '2023-10-01',
    endDate: '2023-10-10',
    budgetTask: 100000,
    statusTask: 'in_progress',
    priorityTask: 'high',
    projectId: '1',
    parentTaskId: 'PARENT-TASK-2', // corrected property name asigned or included to parentTask id
    subTasks: [], // corrected property name asigned or included to subTask id
    progressTask: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), // added comment to indicate the last edit
  },
  {
    id: 'TASK-5',
    nameTask: 'We need to bypass the neural TCP card!',
    description: 'We need to bypass the neural TCP card!',
    startDate: '2023-10-01',
    endDate: '2023-10-10',
    budgetTask: 100000,
    statusTask: 'in_progress',
    priorityTask: 'high',
    projectId: '1',
    parentTaskId: 'PARENT-TASK-3', // corrected property name asigned or included to parentTask id
    subTasks: [], // corrected property name asigned or included to subTask id
    progressTask: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), // added comment to indicate the last edit
  },
]
