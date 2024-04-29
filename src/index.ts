import { v4 as uuidV4 } from 'uuid';

const inputTask = document.querySelector<HTMLInputElement>('.TaskInput')!;
const btnAddTask = document.querySelector<HTMLButtonElement>('.btn');
const BodyTask = document.querySelector<HTMLTableElement>('.fl-table Tbody');
const BodyTr = document.querySelector<HTMLTableElement>('.fl-table Tbody tr');

type Task = {
  id: string;
  title: string;
  completed: string;
  createdAt: string;
};
loadTasks();
let tasks: Task[] = loadTasks();
tasks.forEach(AddNewTask);

btnAddTask?.addEventListener('click', (e) => {
  e.preventDefault();

  if (inputTask?.value === '' || inputTask?.value === null) return;

  const now = new Date();
  const datePart = now.toDateString();

  const NewTask: Task = {
    id: uuidV4(),
    title: inputTask.value,
    completed: 'Progress',
    createdAt: datePart,
  };
  tasks.push(NewTask);
  saveTasks();
  AddNewTask(NewTask);
  inputTask.value = '';
});

function AddNewTask(task: Task) {
  let checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.addEventListener('change', () => {
    if (checkBox.checked) {
      task.completed = 'completed';
      const tableRow = checkBox.parentElement
        ?.parentElement as HTMLTableRowElement | null;
      if (tableRow) {
        tableRow.style.backgroundColor = 'red';
      }
    } else {
      task.completed = 'progress';
    }
  });

  let tableRow = document.createElement('tr');
  let tableData = document.createElement('td');
  tableData.appendChild(checkBox);
  tableRow.appendChild(tableData);

  tableRow.innerHTML += `
      <td>${task.id}</td>
      <td>${task.title}</td>
      <td>${task.completed}</td>
      <td>${task.createdAt}</td>
      <td> <i onclick="window.deleteTask(${tasks.indexOf(
        task,
      )})" class="fa-solid fa-trash"></i></td>
    `;

  BodyTask?.appendChild(tableRow);
  loadTasks();
}

function saveTasks() {
  localStorage.setItem('TASKS', JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  let allTasks = localStorage.getItem('TASKS');
  if (allTasks == null) return [];
  return JSON.parse(allTasks);
}

declare global {
  interface Window {
    deleteTask: (e: number) => void;
  }
}

window.deleteTask = function (e: number) {
  tasks.splice(e, 1);
  localStorage.TASKS = JSON.stringify(tasks);
  while (BodyTask?.firstChild) {
    BodyTask?.removeChild(BodyTask.firstChild);
  }
  tasks.forEach(AddNewTask);
};
