import { parse, format, isValid } from 'date-fns'

class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
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

}


class Project {
    constructor(tasks) {
        this.tasks
    }
}