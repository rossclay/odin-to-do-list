import { format, transpose } from "date-fns";
import { saveToLocalStorage } from "./storage";
import writeImgSrc from "./img/icons8-write-48.png";
import trashImgSrc from "./img/icons8-trash-24.png";
import projectImgSrc from "./img/icons8-project-32.png";
import faviconSrc from "./img/icons8-list-50.png";
import * as taskModule from "./task";
import * as projectModule from "./project";

const UIController = (() => {
  const cardSection = document.querySelector(".card-section");

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
    // need to rework these from the library project to make it work here
    addTaskToProject(newTask);
  };

  // create new projects
  const createNewProject = () => {
    let newProjectTitle = document.querySelector("#project-title").value;
    let newProject = projectModule.Project(newProjectTitle);
  };

  // add srcs for images in sample tasks and projects
  const writeImgs = document.querySelectorAll(".img-write");
  writeImgs.forEach((image) => (image.src = writeImgSrc));
  const trashImgs = document.querySelectorAll(".img-trash");
  trashImgs.forEach((image) => (image.src = trashImgSrc));
  const projectImgs = document.querySelectorAll(".img-project");
  projectImgs.forEach((image) => (image.src = projectImgSrc));

  // modal functionality
  const addTaskBtn = document.querySelector(".add-task-btn");
  const closeBtn = document.querySelector(".close-modal");
  const taskModal = document.querySelector(".task-modal");
  const submitTaskModalBtn = document.querySelector(".submit-task-modal-btn");
  addTaskBtn.addEventListener("click", () => taskModal.showModal());
  closeBtn.addEventListener("click", () => taskModal.close());

  submitTaskModalBtn.addEventListener("click", () => {
    createNewTask();
    // need to create functions related to displaying tasks and reset projects?
    resetProjects(cardSection);
    displayTasks(myProjects);
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
  const projectModal = document.querySelector(".project-modal");
  addProjectBtn.addEventListener("click", () => {
    projectModal.showModal();
  });

  // responsive task cards: strike through tasks once they are complete
  const isTaskComplete = (event) => {
    if (event.target.checked) return true;
    else return false;
  };
  const taskBoxes = document.querySelectorAll(".task-checkbox");
  taskBoxes.forEach((taskBox) => {
    taskBox.addEventListener("click", (e) => {
      if (isTaskComplete(e)) {
        e.target.parentNode.classList.add("strike-through");
      } else e.target.parentNode.classList.remove("strike-through");
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
