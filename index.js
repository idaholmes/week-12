class Task {
  constructor({ title, description }) {
    this.title = title;
    this.description = description;
  }
}

class TaskService {
  static url = "http://localhost:3000/tasks";

  static getAllTasks() {
    return $.get(this.url);
  }

  static getByTaskID(id) {
    return $.get(this.url + `/${id}`);
  }

  static createTask(task) {
    return $.ajax({
      url: "http://localhost:3000/tasks",
      type: "POST",
      contentType: "application/json", // Set content type to JSON
      data: JSON.stringify(task), // Convert JavaScript object to JSON string
    });
  }

  static updateTask(task) {
    return $.ajax({
      url: this.url + `/${task.id}`,
      dataType: "json",
      data: JSON.stringify(task),
      contentType: "application/kson",
      type: "PUT",
    });
  }

  static deleteTask(id) {
    return $.ajax({
      url: "http://localhost:3000/tasks/" + id,
      type: "DELETE",
    });
  }
}

class DOMManager {
  static tasks;

  static getAllTasks() {
    TaskService.getAllTasks().then((tasks) => this.render(tasks));
  }

  static createTask(task) {
    TaskService.createTask(new Task(task)).then(() => {
      return TaskService.getAllTasks().then((tasks) => this.render(tasks));
    });
  }

  static getByTaskID(id) {
    TaskService.getByTaskID(id);
  }

  static deleteTask(id) {
    TaskService.deleteTask(id).then(() => {
      return TaskService.getAllTasks().then((tasks) => this.render(tasks));
    });
  }

  static updateTask(id) {
    return TaskService.getByTaskID(id);
  }

  static render(tasks) {
    this.tasks = tasks;
    $("#app").empty();
    for (let task of tasks) {
      $("#app").prepend(
        `<div id="${task.id}" class="card">
            <div class="card-header">
                <h2>${task.title}</h2>
                <p>${task.description}</p>
                <button class="btn btn-danger" onclick="DOMManager.deleteTask('${task.id}')" id="deleteTask">Delete</button>
            </div>
         </div>
        `
      );
    }
  }
}

$("#taskForm").submit(function (event) {
  event.preventDefault();
  var title = $("#title").val();
  var description = $("#description").val();

  let newTask = {
    title: title,
    description: description,
  };

  DOMManager.createTask(newTask);
  $("#taskForm")[0].reset();
});

DOMManager.getAllTasks();
