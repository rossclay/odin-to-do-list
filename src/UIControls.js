import { format } from "date-fns";
import { saveToLocalStorage } from "./storage";
import taskModule from "./task.js";

let isProjectFormOpen = false;
let isTaskModalOpen = false;

const UIController = () => {
  // modal to allow the user to add tasks
  const addTaskBtn = document.querySelector(".add-task-btn");
  const closeBtn = document.querySelector(".close-modal");
  const taskModal = document.querySelector(".task-modal");
  const submitModalBtn = document.querySelector(".submit-modal-btn");
  const content = document.querySelector(".content");

  addTaskBtn.addEventListener("click", () => taskModal.showModal());

  closeBtn.addEventListener("click", () => taskModal.close());

  submitModalBtn.addEventListener("click", () => {
    let newTaskTitle = document.querySelector("#task-title").value;
    let newTaskDescription = document.querySelector("#task-description").value;
    let newTaskDueDate = format(
      document.querySelector("#task-date").value,
      "yyyy-MM-dd"
    );
    let newTaskPriority = document.querySelector("#task-priority").value;

    let newTask = new Task(
      newTaskTitle,
      newTaskDescription,
      newTaskDueDate,
      newTaskPriority
    );
    // need to rework these from the library project to make it work here
    addTaskToProject(newTask);
    // need to create functions related to displaying tasks and reset projects?
    resetProjects(content);
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

  // responsive task cards: strike through tasks once they are complete

  const strikeThruCompleteTasks = (existingTaskInformationHTML) => {
    if (isTaskComplete) {
      let newTaskInformationHTML = "<s>" + existingTaskInformationHTML + "<s>";
      return newTaskInformationHTML;
    }
  };

  const isTaskComplete = (event) => {
    if (event.target.checked) return true;
    else return false;
  };

  const taskBoxes = document.querySelectorAll("task-checkbox");
  // use forEach to add an event listener to all of these
  taskBoxes.forEach((taskBox) =>
    taskBox.addEventListener("click", (event) => {
      let existingTaskInformationHTML = event.target.innerHTML;
      event.target.innerHTML = strikeThruCompleteTasks(
        existingTaskInformationHTML
      );
    })
  );
};

export default { UIController };
