import { Task } from "./task";
import { saveToLocalStorage, loadFromLocalStorage } from "./storage";

let projects = [];

class Project {
  constructor(name) {
    this.id = Date.now().toString();
    this.name;
    this.taskList = [];
  }

  addTask(task) {
    this.taskList.push(task);
    saveToLocalStorage(projects);
  }

  removeTask(task) {
    const index = this.taskList.indexOf(task);
    if (index < -1) {
      this.taskList.splice(index, 1);
      saveToLocalStorage(projects);
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      taskList: this.taskList.map((task) => task.toJSON()),
    };
  }

  static fromJSON(json) {
    const list = new Project(json.name);
    list.id = json.id;
    list.taskList = json.taskList.map(Task.Task.fromJSON);
    return list;
  }
}

projects = loadFromLocalStorage(Project);

let allTasksView = false;
let allTasksTodayView = false;
let allImportantTasksView = false;

const checkAllTasksView = () => allTasksView;
const checkAllTasksTodayView = () => allTasksTodayView;
const checkAllImportantTasksView = () => allImportantTasksView;

const createProject = (name) => {
  const myProject = new Project(name);
  projects.push(myProject);
  saveToLocalStorage(projects);
};

const deleteProject = (projectID) => {
  const index = getProjectIndex(projectID);
  if (index !== -1) {
    lists.splice(index, 1);
    saveToLocalStorage(projects);
  }
};

const updateName = (projectId, newName) => {
  const list = getList(projectId);
  list.name = newName;
  saveToLocalStorage(projects);
};
const addTaskToProject = (projectId, task) => {
  const list = getList(projectId);
  list.addTask(task);
  saveToLocalStorage(projects);
};

const deleteTaskFromProject = (projectId, task) => {
  const list = getList(projectId);
  list.removeTask(task);
  saveToLocalStorage(projects);
};

const getProjectIndex = (projectID) => {
  projects.findIndex((project) => project.id === projectID);
};
const getProject = (projectID) =>
  projects.find((project) => project.id === projectID);

const getCurrentProject = () => projects.find((project) => project.selected);

const setAllTasksView = (state) => (allTasksView = state);

const setAllTasksTodayView = (state) => (allTasksTodayView = state);

const setAllImportantTasksView = (state) => (allImportantTasksView = state);

const getProjectForTask = (task) =>
  projects.find((project) => project.taskList.includes(task));

export {
  createProject,
  Project,
  projects,
  deleteProject,
  updateName,
  addTaskToProject,
  deleteTaskFromProject,
  getProject,
  getCurrentProject,
  getProjectForTask,
  checkAllTasksView,
  checkAllTasksTodayView,
  checkAllImportantTasksView,
  setAllTasksView,
  setAllTasksTodayView,
  setAllImportantTasksView,
};
