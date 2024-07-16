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
    // resetLibrary(cardContainer);
    // displayBooks(myLibrary);
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
};

const isTaskComplete = () => {
  if (document.querySelector(".task-checkbox").checked) return true;
  else return false;
};

export default { UIController };
