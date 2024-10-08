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
  const cardSectionHeader = document.querySelector(".content-header");
  // identify which project is currently being displayed to and edited by the user
  let currentDOMProjectID;
  const getCurrentDOMProject = () => {
    let currentProject = projectModule.projects.find((project) => {
      if (project.id === currentDOMProjectID) {
        return project;
      }
    });
    return currentProject;
  };
  const clearCardsSection = () => {
    tasksSection.innerHTML = "";
  };

  const hideAddTaskBtn = () => {
    if (addTaskBtn.classList.contains("show")) {
      addTaskBtn.setAttribute("class", "add-task-btn hide");
    }
  };

  const showTaskBtn = () => {
    if (addTaskBtn.classList.contains("hide")) {
      addTaskBtn.setAttribute("class", "add-task-btn show");
    }
  };

  const populateCardSectionByProject = (project) => {
    clearCardsSection();
    showTaskBtn();
    projectModule.setAllImportantTasksView(false);
    projectModule.setAllTasksTodayView(false);
    projectModule.setAllTasksView(false);
    cardSectionHeader.textContent = project.name;
    project.taskList.forEach((task) => {
      createNewTaskCard(task, project);
    });
    currentDOMProjectID = project.id;
  };

  // Filter tasks
  const todayBtn = document.getElementById("today-btn");
  todayBtn.addEventListener("click", () => {
    handleAllTasksTodayDisplay();
  });
  const handleAllTasksTodayDisplay = () => {
    hideAddTaskBtn();
    if (!projectModule.checkAllTasksTodayView()) {
      projectModule.setAllTasksTodayView(true);
      projectModule.setAllTasksView(false);
      projectModule.setAllImportantTasksView(false);
      clearCardsSection();
      cardSectionHeader.textContent = `Today's Tasks`;
      const allTodayTasks = projectModule.getAllTodayTasks();
      allTodayTasks.forEach((task) => {
        createNewTaskCard(task);
      });
    }
  };

  const allBtn = document.getElementById("all-btn");
  allBtn.addEventListener("click", () => {
    handleAllTasksDisplay();
  });
  const handleAllTasksDisplay = () => {
    hideAddTaskBtn();
    if (!projectModule.checkAllTasksView()) {
      projectModule.setAllTasksTodayView(false);
      projectModule.setAllTasksView(true);
      projectModule.setAllImportantTasksView(false);
      clearCardsSection();
      cardSectionHeader.textContent = "All Tasks";
      const allTasks = projectModule.getAllTasks();
      allTasks.forEach((task) => {
        createNewTaskCard(task);
      });
    }
  };
  const importantBtn = document.getElementById("important-btn");
  importantBtn.addEventListener("click", () => {
    handleImportantTasksDisplay();
  });
  const handleImportantTasksDisplay = () => {
    hideAddTaskBtn();
    if (!projectModule.checkAllImportantTasksView()) {
      projectModule.setAllTasksTodayView(false);
      projectModule.setAllTasksView(false);
      projectModule.setAllImportantTasksView(true);
      clearCardsSection();
      cardSectionHeader.textContent = "Important Tasks";
      const importantTasks = projectModule.getAllImportantTasks();
      importantTasks.forEach((task) => {
        createNewTaskCard(task);
      });
    }
  };

  // create new tasks
  const createNewTask = (
    newTaskTitle = document.querySelector("#task-title").value,
    newTaskDescription = document.querySelector("#task-description").value,
    newTaskDueDate = format(
      document.querySelector("#task-date").value,
      "yyyy-MM-dd"
    ),
    newTaskPriority = document.querySelector("#task-priority").value,
    project = getCurrentDOMProject()
  ) => {
    let newTask = taskModule.createTask(
      newTaskTitle,
      newTaskDescription,
      newTaskDueDate,
      newTaskPriority
    );
    project.addTask(newTask);
    return newTask;
  };
  const createNewTaskCard = (task, project) => {
    const newTaskCard = document.createElement("div");
    // separate out populating the task card from creating the task card
    populateTaskCard(task, newTaskCard, project);
    tasksSection.appendChild(newTaskCard);
  };
  // we can use this for new task cards and for editing them
  const populateTaskCard = (popTask, popTaskCard, project) => {
    popTaskCard.innerHTML = "";
    popTaskCard.id = popTask.id;
    popTaskCard.setAttribute("class", `task-card ${popTask.priority}`);
    // using creating elements instead of innerHTML to allow for easier editing of the task cards
    let newTaskHeaderDiv = document.createElement("div");
    newTaskHeaderDiv.classList.add("task-header");
    let newTaskCheckbox = document.createElement("input");
    newTaskCheckbox.classList.add("task-checkbox");
    newTaskCheckbox.setAttribute("type", "checkbox");
    newTaskCheckbox.setAttribute("name", "task-checkbox");
    // dynamic checkbox functionality
    newTaskCheckbox.addEventListener("click", (e) => {
      handleTaskBoxClick(e, popTask);
    });
    newTaskHeaderDiv.appendChild(newTaskCheckbox);
    let newTaskContentDiv = document.createElement("div");
    newTaskContentDiv.classList.add("task-content");
    newTaskHeaderDiv.appendChild(newTaskContentDiv);
    let newTaskTitleDiv = document.createElement("div");
    newTaskTitleDiv.classList.add("task-title");
    newTaskTitleDiv.textContent = popTask.title;
    newTaskContentDiv.appendChild(newTaskTitleDiv);
    if (popTask.description) {
      let newTaskDescriptionDiv = document.createElement("div");
      newTaskDescriptionDiv.classList.add("task-description");
      newTaskDescriptionDiv.textContent = popTask.description;
      newTaskContentDiv.appendChild(newTaskDescriptionDiv);
    }
    let newTaskFooterDiv = document.createElement("div");
    newTaskFooterDiv.classList.add("task-footer");
    let newTaskDueDateDiv = document.createElement("div");
    newTaskDueDateDiv.classList.add("task-date");
    newTaskDueDateDiv.textContent = popTask.dueDate;
    let imgContainer = document.createElement("div");
    let newTaskWriteImg = document.createElement("img");
    newTaskWriteImg.classList.add("img-write");
    newTaskWriteImg.src = writeImgSrc;
    newTaskWriteImg.addEventListener("click", (e) => {
      if (e.target.matches(".img-write")) {
        handleEditTask(popTask, popTaskCard);
      }
    });
    let newTrashImg = document.createElement("img");
    newTrashImg.classList.add("img-trash");
    newTrashImg.src = trashImgSrc;
    newTrashImg.addEventListener("click", (e) => {
      if (e.target.matches(".img-trash")) {
        handleDeleteTask(popTask, popTaskCard, project);
      }
    });
    imgContainer.appendChild(newTaskWriteImg);
    imgContainer.appendChild(newTrashImg);
    newTaskFooterDiv.appendChild(newTaskDueDateDiv);
    newTaskFooterDiv.appendChild(imgContainer);
    popTaskCard.appendChild(newTaskHeaderDiv);
    popTaskCard.appendChild(newTaskFooterDiv);
  };
  // responsive task cards: strike through tasks once they are complete
  const isTaskComplete = (event, task) => {
    if (event.target.checked) {
      task.complete = true;
      saveToLocalStorage(projectModule.projects);
      return true;
    } else {
      task.complete = false;
      return false;
    }
  };
  const handleTaskBoxClick = (e, task) => {
    if (isTaskComplete(e, task)) {
      e.target.parentNode.classList.add("strike-through");
    } else e.target.parentNode.classList.remove("strike-through");
  };

  // modal functionality
  // task modal
  const addTaskBtn = document.querySelector(".add-task-btn");
  const closeBtn = document.querySelector(".close-modal");
  const taskModal = document.querySelector(".task-modal");
  const submitTaskModalBtn = document.querySelector(".submit-task-modal-btn");
  addTaskBtn.addEventListener("click", () => taskModal.showModal());
  closeBtn.addEventListener("click", () => {
    clearTaskModalInputs();
    taskModal.close();
  });

  const handleTaskModalSubmit = () => {
    createNewTaskCard(createNewTask(), getCurrentDOMProject());
    clearTaskModalInputs();
    taskModal.close();
  };
  const clearTaskModalInputs = () => {
    const taskModalInputs = taskModal.querySelectorAll("input");
    taskModalInputs.forEach((taskModalInput) => {
      taskModalInput.value = "";
    });
  };

  submitTaskModalBtn.addEventListener("click", () => {
    handleTaskModalSubmit();
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
      clearTaskModalInputs();
      taskModal.close();
    }
  });

  // edit tasks
  const handleEditTask = (task, taskCard) => {
    const existingTaskCard = taskCard;
    const existingTaskCardHTML = taskCard.innerHTML;

    taskCard.innerHTML = "";
    const editTaskHeaderDiv = document.createElement("div");
    editTaskHeaderDiv.classList.add("editing-task-header");
    taskCard.appendChild(editTaskHeaderDiv);
    const priorityLegend = document.createElement("legend");
    priorityLegend.textContent = "Priority:";
    editTaskHeaderDiv.appendChild(priorityLegend);
    const prioritySelect = document.createElement("select");
    prioritySelect.setAttribute("name", "task-priority");
    prioritySelect.setAttribute("id", "edit-task-priority");
    prioritySelect.setAttribute("value", `${task.priority}`);
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
    taskTitleInput.classList.add("editing-task-input");
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
    taskDescriptionInput.classList.add("editing-task-input");
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
    editDueDateInput.setAttribute("id", "edit-task-date");
    editDueDateInput.setAttribute("name", "task-date");
    editDueDateInput.setAttribute("type", "date");
    editTaskFooterDiv.appendChild(editDueDateInput);
    const submitUpdateBtn = document.createElement("button");
    submitUpdateBtn.classList.add("task-editing-btns");
    submitUpdateBtn.textContent = "update";
    editTaskFooterDiv.appendChild(submitUpdateBtn);
    const cancelUpdateBtn = document.createElement("button");
    cancelUpdateBtn.classList.add("task-editing-btn");
    cancelUpdateBtn.textContent = "cancel";
    editTaskFooterDiv.appendChild(cancelUpdateBtn);

    submitUpdateBtn.addEventListener("click", () => {
      try {
        // update the js object and the DOM
        handleEditTaskUpdate(task, taskCard);
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
    taskCard,
    newTitle = document.getElementById("edit-task-title").value,
    newDescription = document.getElementById("edit-task-description").value,
    newDueDate = document.getElementById("edit-task-date").value,
    newPriority = document.getElementById("edit-task-priority").value
  ) => {
    task.updateTitle(newTitle);
    task.updateDescription(newDescription);
    if (newDueDate) {
      task.updateDueDate(newDueDate);
    }
    task.updatePriority(newPriority);
    populateTaskCard(task, taskCard);
  };

  const handleCancelTaskUpdate = (
    previousTaskCard,
    previousHTML,
    previousTask,
    project = getCurrentDOMProject()
  ) => {
    previousTaskCard.innerHTML = previousHTML;
    // using innerHTML loses the event listeners, so we need to get them back
    const editBtn = previousTaskCard.querySelector(".img-write");
    editBtn.addEventListener("click", () => {
      handleEditTask(previousTask, previousTaskCard);
    });
    const taskCheckBox = previousTaskCard.querySelector(".task-checkbox");
    taskCheckBox.addEventListener("click", (e) => {
      handleTaskBoxClick(e, previousTask);
    });
    const delBtn = previousTaskCard.querySelector(".img-trash");
    delBtn.addEventListener("click", () => {
      handleDeleteTask(previousTask, previousTaskCard, project);
    });
  };

  const handleDeleteTask = (
    task,
    taskCard,
    project = projectModule.getProjectForTask(task)
  ) => {
    projectModule.deleteTaskFromProject(project.id, task);
    tasksSection.removeChild(taskCard);
  };

  // project modal
  const addProjectBtn = document.querySelector(".add-project-btn");
  const projectModal = document.querySelector("#project-modal");
  const projectInput = projectModal.querySelector(".project-input");
  const projectModalImg = projectModal.querySelector(".img-project");
  projectModalImg.src = projectImgSrc;
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
    projectInput.value = "";
  });
  // create new projects
  const createNewProject = (
    newProjectTitle = document.querySelector("#project-title").value
  ) => {
    let newProject = projectModule.createProject(newProjectTitle);
    createNewProjectCard(newProject);
    return newProject;
  };
  // DOM
  const createNewProjectCard = (project) => {
    const newProjectCard = document.createElement("div");
    newProjectCard.classList.add("project-card");
    populateProjectCard(project, newProjectCard);
  };
  const submitProjectModalBtn = document.querySelector(
    ".submit-project-modal-btn"
  );
  const projectsSection = document.querySelector("#projects-section");
  submitProjectModalBtn.addEventListener("click", () => {
    createNewProject();
    toggleProjectModalVisibility();
  });
  const populateProjectCard = (popProject, popProjectCard) => {
    popProjectCard.innerHTML = "";
    popProjectCard.id = popProject.id;
    const newProjectImg = document.createElement("img");
    newProjectImg.classList.add("img-project");
    newProjectImg.setAttribute("src", `${projectImgSrc}`);
    popProjectCard.appendChild(newProjectImg);
    const newProjectTitle = document.createElement("div");
    newProjectTitle.classList.add("project-title");
    newProjectTitle.textContent = `${popProject.name}`;
    popProjectCard.appendChild(newProjectTitle);
    const newProjectFooter = document.createElement("div");
    newProjectFooter.classList.add("project-footer");
    popProjectCard.appendChild(newProjectFooter);
    const newProjectEditBtn = document.createElement("div");
    newProjectEditBtn.classList.add("project-btn");
    newProjectEditBtn.classList.add("edit-btn");
    newProjectEditBtn.textContent = "edit";
    newProjectFooter.appendChild(newProjectEditBtn);
    newProjectEditBtn.addEventListener("click", (e) => {
      if (e.target.matches(".edit-btn")) {
        handleEditProject(popProject, popProjectCard);
      }
    });
    const newProjectDeleteBtn = document.createElement("div");
    newProjectDeleteBtn.classList.add("project-btn");
    newProjectDeleteBtn.classList.add("del-btn");
    newProjectDeleteBtn.textContent = "delete";
    newProjectFooter.appendChild(newProjectDeleteBtn);
    newProjectDeleteBtn.addEventListener("click", (e) => {
      if (e.target.matches(".del-btn")) {
        handleDeleteProject(popProject, popProjectCard);
      }
    });
    projectsSection.appendChild(popProjectCard);
    popProjectCard.addEventListener("click", (e) => {
      if (
        e.target.matches(".project-card") ||
        e.target.matches(".project-title")
      ) {
        populateCardSectionByProject(popProject);
        currentDOMProjectID = popProject.id;
      }
    });
    projectInput.value = "";
  };

  const handleEditProject = (project, previousProjectCard) => {
    let existingProjectCard = previousProjectCard;
    let existingProjectCardHTML = previousProjectCard.innerHTML;
    const projectFooter = previousProjectCard.querySelector(".project-footer");
    previousProjectCard.removeChild(projectFooter);
    const editProjectTitleDiv =
      previousProjectCard.querySelector(".project-title");
    editProjectTitleDiv.textContent = "";
    editProjectTitleDiv.setAttribute("class", "");
    const editProjectInput = document.createElement("input");
    editProjectInput.classList.add("project-input");
    editProjectInput.value = project.name;
    editProjectTitleDiv.appendChild(editProjectInput);
    const editProjectFooter = document.createElement("div");
    editProjectFooter.classList.add("project-footer");
    previousProjectCard.appendChild(editProjectFooter);
    const updateProjectBtnDiv = document.createElement("div");
    updateProjectBtnDiv.classList.add("project-btn");
    updateProjectBtnDiv.textContent = "update";
    updateProjectBtnDiv.addEventListener("click", () => {
      handleSubmitProjectUpdate(project, previousProjectCard);
    });
    editProjectFooter.appendChild(updateProjectBtnDiv);
    const cancelProjectUpdateBtnDiv = document.createElement("div");
    cancelProjectUpdateBtnDiv.classList.add("project-btn");
    cancelProjectUpdateBtnDiv.textContent = "cancel";
    cancelProjectUpdateBtnDiv.addEventListener("click", () => {
      handleCancelProjectUpdate(
        existingProjectCard,
        existingProjectCardHTML,
        project
      );
    });
    editProjectFooter.appendChild(cancelProjectUpdateBtnDiv);
  };

  const handleSubmitProjectUpdate = (
    project,
    projectCard,
    newTitle = projectCard.querySelector(".project-input").value
  ) => {
    projectModule.updateName(project.id, newTitle);
    populateProjectCard(project, projectCard);
  };

  const handleCancelProjectUpdate = (previousCard, previousHTML, project) => {
    previousCard.innerHTML = previousHTML;
    const editBtn = previousCard.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      handleEditProject(project, previousCard);
    });
    const delBtn = previousCard.querySelector(".del-btn");
    delBtn.addEventListener("click", () => {
      handleDeleteProject(project, previousCard);
    });
  };
  const handleDeleteProject = (project, projectCard) => {
    projectModule.deleteProject(project);
    projectsSection.removeChild(projectCard);
    if (project.id === currentDOMProjectID) {
      clearCardsSection();
      cardSectionHeader.textContent = "Your Tasks";
      currentDOMProjectID = null;
    }
  };
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
