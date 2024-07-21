import { parse, format, isValid } from 'date-fns'
import { saveToLocalStorage, loadFromLocalStorage } from "./storage";

let projects = []

let allTasksView = false

const checkAllTasksView = () => allTasksView

class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title
        this.description = description
        this.dueDate = this.formatDate(dueDate)
        this.priority = priority
        this.complete = false
        this.id = Date.now().toString()
    }

    formatDate(date) {
        if (date) {
            const dateObject = parse(date, "yyyy-MM-dd", new Date())
            if (isValid(dateObject)) {
                return this.format(dateObject, 'MM/dd/yyyy')
            }
            return '';
        }
    }
    updateTitle(newTitle) {
        this.title = newTitle;
    }

    updateDescription(newDescription) {
        this.description = newDescription;
    }

    updateDueDate(newDueDate) {
        this.dueDate = this.formatDate(newDueDate);
    }

    updatePriority(newPriority) {
        this.priority = newPriority;
    }

    toJSON() {
        return {
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            complete: this.complete,
            id: this.id
        };
    }

    static fromJSON(json) {
        const item = new Task(json.title, json.description, json.dueDate, json.priority);
        item.complete = json.complete;
        item.id = json.id;
        item.dueDate = json.dueDate;
        return item;
    }
}


const createTask = (title, description, dueDate, priority) => {
    return new Task(title, description, dueDate, priority);
};


class Project {
    constructor(name) {
        this.id = Date.now().toString()
        this.name
        this.taskList = []
    }

    addTask(task) {
        this.taskList.push(task)
    }

    removeTask(task) {
        const index = this.taskList.indexOf(task)
        if (index < -1) {
            this.taskList.splice(index, 1)
        }

    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            taskList: this.taskList.map(task => task.toJSON())
        };
    }


}

projects = loadFromLocalStorage(Project)

const addTaskToProject = (projectID, task) => {
    const project = getProject(projectID)
    project.addTask(task)
    saveToLocalStorage(projects)
}

const deleteTaskFromProject = (projectID, task) => {
    const project = getProject(projectID)
    project.removeTask(task)
    saveToLocalStorage(projects)
}

const createProject = (name) => {
    const myProject = new Project(name)
    projects.push(myProject)
    saveToLocalStorage(projects)
}

const deleteProject = (projectID) => {
    const index = getProjectIndex(projectID)
    if (index !== -1) {
        lists.splice(index, 1)
        saveToLocalStorage(lists)
    }
}

const getProjectIndex = (projectID) => {
    projects.findIndex((project) => project.id === projectID)
}
const getProject = (projectID) => projects.find((project) => project.id === projectID)

const getCurrentProject = () => projects.find((project) => project.selected)

const setAllTasksView = (state) => allTasksView = state

const getProjectForTask = (task) => projects.find(project => project.taskList.includes(task))

export { createTask, Task, createProject, Project, projects, deleteProject, addTaskToProject, deleteTaskFromProject, getProject, getCurrentProject, getProjectForTask, setAllTasksView, checkAllTasksView };