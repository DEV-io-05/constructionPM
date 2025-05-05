// mock data for projects
export const projects = [
  {
    id: '1',
    nameProject: 'Project Alpha',
    description: 'Description of Project Alpha',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    budget: 100000,
    budgetType: 'fixed', // changed from 'variable' to 'fixed'
    currency: 'IDR', // changed from 'USD' to 'IDR'
    statusProject: 'backlog', // changed from 'in_progress' to 'backlog'
    progressPercent: 50,
    userId: ['John', 'Jane', 'Doe'],
    taskId: ['TASK-1[A,B,C,D]'], // changed from 'taskid' to 'taskId' to match schema
    resourceId: ['Resource A'], // changed from 'resourcePro' to 'resourceId' to match schema
    evmRecordId: ['EVM Record A'], // added evmRecordId to match schema
    createdAt: new Date(), // added createdAt to track when the project was created
    updatedAt: new Date(), // added updatedAt to track when the project was last updated
  },
  {
    id: '2',
    nameProject: 'Project Beta',
    description: 'Description of Project Beta',
    startDate: '2023-02-01',
    endDate: '2023-11-30',
    budget: 200000,
    budgetType: 'variable', // changed from 'fixed' to 'variable'
    currency: 'IDR', // changed from 'USD' to 'IDR'
    statusProject: 'in_progress', // changed from 'backlog' to 'in progress'
    progressPercent: 75,
    userId: ['Alice', 'Bob'],
    taskId: ['Task B'], // changed from 'taskid' to 'taskId' to match schema
    resourceId: ['Resource B'], // changed from 'resourcePro' to 'resourceId' to match schema
    evmRecordId: ['EVM Record B'], // added evmRecordId to match schema
    createdAt: new Date(), // added createdAt to track when the project was created
    updatedAt: new Date(), // added updatedAt to track when the project was last updated
  },
  {
    id: '3',
    nameProject: 'Project Gamma',
    description: 'Description of Project Gamma',
    startDate: '2023-03-01',
    endDate: '2023-10-31',
    budget: 150000,
    budgetType: 'fixed', // changed from 'variable' to 'fixed'
    currency: 'IDR', // changed from 'USD' to 'IDR'
    statusProject: 'completed', // changed from 'in_progress' to 'completed'
    progressPercent: 100,
    userId: ['Charlie'],
    taskId: ['Task C'], // changed from 'taskid' to 'taskId' to match schema
    resourceId: ['Resource C'], // changed from 'resourcePro' to 'resourceId' to match schema
    evmRecordId: ['EVM Record C'], // added evmRecordId to match schema
    createdAt: new Date(), // added createdAt to track when the project was created
    updatedAt: new Date(), // added updatedAt to track when the project was last updated
  },
  {
    id: '4',
    nameProject: 'Project Delta',
    description: 'Description of Project Delta',
    startDate: '2023-04-01',
    endDate: '2023-09-30',
    budget: 250000,
    budgetType: 'variable', // changed from 'fixed' to 'variable'
    currency: 'IDR', // changed from 'USD' to 'IDR'
    statusProject: 'canceled', // changed from 'completed' to 'canceled'
    progressPercent: 0,
    userId: ['David'],
    taskId: ['Task D'], // changed from 'taskid' to 'taskId' to match schema
    resourceId: ['Resource D'], // changed from 'resourcePro' to 'resourceId' to match schema
    evmRecordId: ['EVM Record D'], // added evmRecordId to match schema
    createdAt: new Date(), // added createdAt to track when the project was created
    updatedAt: new Date(), // added updatedAt to track when the project was last updated
  },
  {
    id: '5',
    nameProject: 'Project Epsilon',
    description: 'Description of Project Epsilon',
    startDate: '2023-05-01',
    endDate: '2023-08-31',
    budget: 300000,
    budgetType: 'fixed', // changed from 'variable' to 'fixed'
    currency: 'IDR', // changed from 'USD' to 'IDR'
    statusProject: 'backlog', // changed from 'in_progress' to 'backlog'
    progressPercent: 20,
    userId: ['Eve'],
    taskId: ['Task E'], // changed from 'taskid' to 'taskId' to match schema
    resourceId: ['Resource E'], // changed from 'resourcePro' to 'resourceId' to match schema
    evmRecordId: ['EVM Record E'], // added evmRecordId to match schema
    createdAt: new Date(), // added createdAt to track when the project was created
    updatedAt: new Date(), // added updatedAt to track when the project was last updated
  },
]
