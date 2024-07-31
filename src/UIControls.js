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
    // using creating elements instead of innerHTML to allow for easier editing of the task cards
    let newTaskHeaderDiv = document.createElement("div");
    newTaskHeaderDiv.classList.add("task-header");
    let newTaskCheckbox = document.createElement("input");
    newTaskCheckbox.classList.add("task-checkbox");
    newTaskCheckbox.setAttribute("type", "checkbox");
    newTaskCheckbox.setAttribute("name", "task-checkbox");
    // dynamic checkbox functionality
    newTaskCheckbox.addEventListener("click", (e) => {
      handleTaskBoxClick(e);
    });
    newTaskHeaderDiv.appendChild(newTaskCheckbox);
    let newTaskContentDiv = document.createElement("div");
    newTaskContentDiv.classList.add("task-content");
    newTaskHeaderDiv.appendChild(newTaskContentDiv);
    let newTaskTitleDiv = document.createElement("div");
    newTaskTitleDiv.classList.add("task-title");
    newTaskTitleDiv.textContent = task.title;
    newTaskContentDiv.appendChild(newTaskTitleDiv);
    if (task.description) {
      let newTaskDescriptionDiv = document.createElement("div");
      newTaskDescriptionDiv.classList.add("task-description");
      newTaskDescriptionDiv.textContent = task.description;
      newTaskContentDiv.appendChild(newTaskDescriptionDiv);
    }
    let newTaskFooterDiv = document.createElement("div");
    newTaskFooterDiv.classList.add("task-footer");
    let newTaskDueDateDiv = document.createElement("div");
    newTaskDueDateDiv.classList.add("task-date");
    newTaskDueDateDiv.textContent = task.dueDate;
    let imgContainer = document.createElement("div");
    let newTaskWriteImg = document.createElement("img");
    newTaskWriteImg.classList.add("img-write");
    newTaskWriteImg.src = writeImgSrc;
    newTaskWriteImg.addEventListener("click", () => {
      handleEditTask(newTaskCard, task);
    });
    let newTrashImg = document.createElement("img");
    newTrashImg.classList.add("img-trash");
    newTrashImg.src = trashImgSrc;
    newTrashImg.addEventListener("click", () => {
      console.log("delete works");
    });
    imgContainer.appendChild(newTaskWriteImg);
    imgContainer.appendChild(newTrashImg);
    newTaskFooterDiv.appendChild(newTaskDueDateDiv);
    newTaskFooterDiv.appendChild(imgContainer);
    newTaskCard.appendChild(newTaskHeaderDiv);
    newTaskCard.appendChild(newTaskFooterDiv);
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
    try {
      createNewTaskCard(createNewTask());
      taskModal.close();
    } catch {
      alert("Task Title and Date are required!");
    }
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

  // edit tasks - UNDER CONSTRUCTION
  const handleEditTask = (taskCard, task) => {
    const existingTaskCard = taskCard;
    const existingTaskCardHTML = taskCard.innerHTML;
    // taskCard.innerHTML = `<div class="task-header">
    //         <legend>Priority:</legend>
    //         <select name="task-priority" id="task-priority">
    //           <option value="high">high</option>
    //           <option value="medium">medium</option>
    //           <option value="low">low</option>
    //         </select>
    //         <label for="task-title"
    //           >Task Title <span aria-label="required">*</span></label
    //         >
    //         <div class="task-content">
    //           <input
    //           class="task-input"
    //           type="text"
    //           id="task-title"
    //           name="task-title"
    //           value=${task.title}
    //           required
    //         />
    //           <label for="task-description">Task Description</label>
    //         <input
    //           class="task-input"
    //           type="text"
    //           id="task-description"
    //           name="task-description"
    //           value=${task.description}
    //           type="text"
    //         />
    //       </div>
    //       <div class="task-footer">
    //         <label for="task-date"
    //           >Due date <span aria-label="required">*</span></label
    //         >
    //         <input type="date" id="task-date" name="task-date" value=${task.dueDate} required />
    //         <div><img class="img-write" src="${writeImgSrc}"/><img class="img-trash" src="${trashImgSrc}"/></div>
    //       </div>`;

    taskCard.innerHTML = "";
    const editTaskHeaderDiv = document.createElement("div");
    editTaskHeaderDiv.classList.add("editing-task-header");
    taskCard.appendChild(editTaskHeaderDiv);
    const priorityLegend = document.createElement("legend");
    priorityLegend.textContent = "Priority:";
    editTaskHeaderDiv.appendChild(priorityLegend);
    const prioritySelect = document.createElement("select");
    prioritySelect.setAttribute("name", "task-priority");
    prioritySelect.setAttribute("id", "task-priority");
    priorityLegend.appendChild(prioritySelect);
    const optionHigh = document.createElement("option");
    optionHigh.setAttribute("value", "high");
    optionHigh.textContent = "high";
    prioritySelect.appendChild(optionHigh);
    const optionMedium = document.createElement("option");
    optionMedium.setAttribute("value", "medium");
    optionMedium.textContent = "medium";
    prioritySelect.appendChild(optionMedium);
    const optionLow = document.createElement("option");
    optionLow.setAttribute("value", "low");
    optionLow.textContent = "low";
    prioritySelect.appendChild(optionLow);
    const taskTitleLabel = document.createElement("label");
    taskTitleLabel.setAttribute("for", "task-title");
    taskTitleLabel.textContent = "Task Title";
    editTaskHeaderDiv.appendChild(taskTitleLabel);
    const taskTitleInput = document.createElement("input");
    taskTitleInput.classList.add("task-input");
    taskTitleInput.setAttribute("type", "text");
    taskTitleInput.setAttribute("name", "task-title");
    taskTitleInput.setAttribute("id", "edit-task-title");
    taskTitleInput.setAttribute("value", `${task.title}`);
    taskTitleLabel.appendChild(taskTitleInput);
    const taskDescriptionLabel = document.createElement("label");
    taskDescriptionLabel.setAttribute("for", "task-description");
    taskDescriptionLabel.textContent = "Task Description";
    editTaskHeaderDiv.appendChild(taskDescriptionLabel);
    const taskDescriptionInput = document.createElement("input");
    taskDescriptionInput.classList.add("task-input");
    taskDescriptionInput.setAttribute("type", "text");
    taskDescriptionInput.setAttribute("name", "task-description");
    taskDescriptionInput.setAttribute("id", "edit-task-description");
    taskDescriptionLabel.appendChild(taskDescriptionInput);
    if (task.description) {
      taskDescriptionInput.setAttribute("value", `${task.description}`);
    }
    const editTaskFooterDiv = document.createElement("div");
    editTaskFooterDiv.classList.add("task-footer");
    taskCard.appendChild(editTaskFooterDiv);
    const editDueDateInput = document.createElement("input");
    editDueDateInput.setAttribute("id", "task-date");
    editDueDateInput.setAttribute("name", "task-date");
    editDueDateInput.setAttribute("type", "date");
    editDueDateInput.setAttribute("value", `${task.dueDate}`);
    editTaskFooterDiv.appendChild(editDueDateInput);
    const submitUpdateBtn = document.createElement("button");
    submitUpdateBtn.classList.add("task-editing-btns");
    submitUpdateBtn.textContent = "update";
    editTaskFooterDiv.appendChild(submitUpdateBtn);
    const cancelUpdateBtn = document.createElement("button");
    cancelUpdateBtn.classList.add("task-editing-btn");
    cancelUpdateBtn.textContent = "cancel";
    editTaskFooterDiv.appendChild(cancelUpdateBtn);

    // also need to update the js object
    submitUpdateBtn.addEventListener("click", () => {
      try {
        handleEditTaskUpdate();
      } catch {
        alert("Task Title and Date are required!");
      }
    });
    cancelUpdateBtn.addEventListener("click", () => {
      handleCancelTaskUpdate(existingTaskCard, existingTaskCardHTML, task);
    });
  };

  const handleEditTaskUpdate = (
    task,
    newTitle,
    newDescription,
    newDueDate,
    newPriority
  ) => {
    task.updateTitle(newTitle);
    task.updateDescription(newDescription);
    task.updateDueDate(newDueDate);
    task.updatePriority(newPriority);
  };

  const handleCancelTaskUpdate = (
    previousTaskCard,
    previousHTML,
    previousTask
  ) => {
    previousTaskCard.innerHTML = previousHTML;
    // using innerHTML loses the event listeners, so we need to get them back
    const editBtn = previousTaskCard.querySelector(".img-write");
    editBtn.addEventListener("click", () => {
      handleEditTask(previousTaskCard, previousTask);
    });
    // delete btn functionality not yet implemented
    // const delBtn = document.taskCard.querySelector('img-trash')
    // delBtn.addEventListener('click',()=>{
    // })
  };

  // these actually won't exist in the final product, as they only represent the imgs in the index.html file
  writeImgs.forEach((writeImg) => {
    writeImg.addEventListener("click", (e) => {
      let taskCard = e.target.parentNode.parentNode.parentNode;
      console.log(taskCard);
      // handleEditTask(taskCard);
    });
  });

  // project modal
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
  // need to update js object to reflect this as well.
  const isTaskComplete = (event) => {
    if (event.target.checked) return true;
    else return false;
  };
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
