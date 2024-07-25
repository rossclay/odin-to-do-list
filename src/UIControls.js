import { format, transpose } from "date-fns";
import { saveToLocalStorage } from "./storage";
import writeImgSrc from "./img/icons8-write-48.png";
import trashImgSrc from "./img/icons8-trash-24.png";
import projectImgSrc from "./img/icons8-project-32.png";
import faviconSrc from "./img/icons8-list-50.png";
import * as taskModule from "./task";
import * as projectModule from "./project";

const UIController = (() => {
  const tasksSection = document.querySelector(".card-section");

  // create new tasks
  const createNewTask = () => {
    let newTaskTitle = document.querySelector("#task-title").value;
    let newTaskDescription = document.querySelector("#task-description").value;
    let newTaskDueDate = format(
      document.querySelector("#task-date").value,
      "yyyy-MM-dd"
    );
    let newTaskPriority = document.querySelector("#task-priority").value;

    let newTask = taskModule.createTask(
      newTaskTitle,
      newTaskDescription,
      newTaskDueDate,
      newTaskPriority
    );
    return newTask;
  };
  const createNewTaskCard = (task) => {
    const newTaskCard = document.createElement("div");
    newTaskCard.classList.add("task-card");
    newTaskCard.classList.add(`${task.priority}`);
    newTaskCard.innerHTML = `
          <div class="task-header">
            <input type="checkbox" class="task-checkbox" name="task-checkbox" />
            <div class="task-content">
              <div class="task-title">${task.title}</div>
              <div class="task-description">${task.description}</div>
            </div>
          </div>
          <div class="task-footer">
            <div class="task-date">${task.dueDate}</div>
            <div><img class="img-write" src="${writeImgSrc}"/><img class="img-trash" src="${trashImgSrc}"/></div>
          </div>`;
    tasksSection.appendChild(newTaskCard);
  };

  // add srcs for images in sample tasks and projects
  const writeImgs = document.querySelectorAll(".img-write");
  writeImgs.forEach((image) => (image.src = writeImgSrc));
  const trashImgs = document.querySelectorAll(".img-trash");
  trashImgs.forEach((image) => (image.src = trashImgSrc));
  const projectImgs = document.querySelectorAll(".img-project");
  projectImgs.forEach((image) => (image.src = projectImgSrc));

  // modal functionality
  // task modal
  const addTaskBtn = document.querySelector(".add-task-btn");
  const closeBtn = document.querySelector(".close-modal");
  const taskModal = document.querySelector(".task-modal");
  const submitTaskModalBtn = document.querySelector(".submit-task-modal-btn");
  addTaskBtn.addEventListener("click", () => taskModal.showModal());
  closeBtn.addEventListener("click", () => taskModal.close());

  submitTaskModalBtn.addEventListener("click", () => {
    createNewTaskCard(createNewTask());
    taskModal.close();
  });
  // additional feature for closing modal when clicking outside of dialog window
  taskModal.addEventListener("click", (e) => {
    const dialogDimensions = taskModal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      taskModal.close();
    }
  });

  // project modal - UNDER CONSTRUCTION
  const addProjectBtn = document.querySelector(".add-project-btn");
  const projectModal = document.querySelector("#project-modal");
  const toggleProjectModalVisibility = () => {
    projectModal.classList.toggle("hide");
  };
  addProjectBtn.addEventListener("click", () => {
    if (projectModal.classList.contains("hide")) {
      toggleProjectModalVisibility();
    }
  });
  const cancelProjectBtn = document.querySelector(".cancel-project-modal-btn");
  cancelProjectBtn.addEventListener("click", () => {
    toggleProjectModalVisibility();
  });
  // create new projects
  const createNewProject = () => {
    let newProjectTitle = document.querySelector("#project-title").value;
    let newProject = projectModule.createProject(newProjectTitle);
    createNewProjectCard(newProjectTitle);
    return newProject;
  };
  // DOM
  const createNewProjectCard = (title) => {
    const newProjectCard = document.createElement("div");
    newProjectCard.classList.add("project-card");
    newProjectCard.innerHTML = `<img class="img-project" src="${projectImgSrc}"/>
            <div class="project-title">${title}</div>
            <div class="project-footer">
              <div class="project-btn">edit</div>
              <div class="project-btn">delete</div>`;
    projectsSection.appendChild(newProjectCard);
  };

  const submitProjectModalBtn = document.querySelector(
    ".submit-project-modal-btn"
  );
  const projectsSection = document.querySelector("#projects-section");
  submitProjectModalBtn.addEventListener("click", () => {
    createNewProject();
    toggleProjectModalVisibility();
  });

  // responsive task cards: strike through tasks once they are complete
  const isTaskComplete = (event) => {
    if (event.target.checked) return true;
    else return false;
  };
  // how can we add this functionality to NEW task checkboxes too?
  const taskBoxes = document.querySelectorAll(".task-checkbox");
  const handleTaskBoxClick = (e) => {
    if (isTaskComplete(e)) {
      e.target.parentNode.classList.add("strike-through");
    } else e.target.parentNode.classList.remove("strike-through");
  };
  taskBoxes.forEach((taskBox) => {
    taskBox.addEventListener("click", (e) => {
      handleTaskBoxClick(e);
    });
  });

  // favicon
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = faviconSrc;
})();

export default { UIController };
