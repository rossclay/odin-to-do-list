import { parse, format, isValid } from "date-fns";

class Task {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = this.formatDate(dueDate);
    this.priority = priority;
    this.complete = false;
    this.id = Date.now().toString();
  }

  formatDate(date) {
    if (date) {
      const dateObject = parse(date, "yyyy-MM-dd", new Date());
      if (isValid(dateObject)) {
        return format(dateObject, "MM/dd/yyyy");
      }
      return "";
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
      id: this.id,
    };
  }

  static fromJSON(json) {
    const item = new Task(
      json.title,
      json.description,
      json.dueDate,
      json.priority
    );
    item.complete = json.complete;
    item.id = json.id;
    item.dueDate = json.dueDate;
    return item;
  }
}

const createTask = (title, description, dueDate, priority) => {
  return new Task(title, description, dueDate, priority);
};

export { createTask, Task };
