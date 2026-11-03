type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const tasks: Task[] = [
  { id: 1, title: "学习 TypeScript 类型", completed: true },
  { id: 2, title: "编写一个小 demo", completed: false },
  { id: 3, title: "运行构建检查", completed: false },
];

function completeTask(taskList: Task[], taskId: number): Task[] {
  return taskList.map((task) =>
    task.id === taskId ? { ...task, completed: true } : task,
  );
}

function printTasks(taskList: Task[]): void {
  for (const task of taskList) {
    const status = task.completed ? "已完成" : "待处理";
    console.log(`[${status}] ${task.id}. ${task.title}`);
  }
}

console.log("TypeScript 待办清单 demo\n");
printTasks(tasks);

console.log("\n完成任务 2 后：");
printTasks(completeTask(tasks, 2));