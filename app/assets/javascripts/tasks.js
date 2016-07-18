$(function() {
  // The taskHtml method takes in a JS representation of the task and produces an HTML representation using <li> tags.
  function taskHtml(task) {
    // HTML for a checked checkbox: E.g. <input class="toggle" type="checkbox" checked data-id="2">
    var checkedStatus = task.done ? "checked" : "";
    var liElement = '<li><div class="view"><input class="toggle" type="checkbox"' + " data-id='" + task.id + "'" + checkedStatus + '><label>' + task.title + '</label></div></li>';

    return liElement;
  }

  // toggleTask takes in an HTML representation of an event that fires from an HTML representation of the toggle checkbox and performs an API request to toggle the value of the 'done' field.
  function toggleTask(e) {
    // Extract the data-id from the input element:
    var itemId = $(e.target).data("id");

    // .is() --> Check the current matched set of elements against a selector, element, or jQuery object and return true if at least one of these elements matches the given arguments.
    var doneValue = Boolean($(e.target).is(':checked'));

    // Update the task's "done" value in the database (API request):
    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        done: doneValue
      }
    });
  }

  // The items have been pulled from our database --> Task model --> Tasks controller (render JSON representation) --> JS console using AJAX .get request:
  $.get("/tasks").success(function(data) {
    var htmlString = "";

    // .each(object_to_loop_through, function_to_perform(object_index, object_value))
    $.each(data, function(index, task) {
      htmlString += taskHtml(task);
    });
    var ulTodos = $('.todo-list');
    // Set the HTML contents of the .todo-list class with htmlString:
    ulTodos.html(htmlString);

    // .change --> Event that is sent to an element when its value changes:
    $('.toggle').change(toggleTask);
  });

  // Find the #new-form element, then register a callback to happen when the form is submitted:
  $('#new-form').submit(function(event) {
    // .preventDefault() --> Stop the default behavior of reloading the page on form submission.
    event.preventDefault();
    var textbox = $('.new-todo');
    var payload = {
      task: {
        title: textbox.val()
      }
    };
    // $.post( url [, data ] [, success ] [, dataType ] )
    // Load data from the server using a HTTP POST request.
    // Append data onto the todo list as upon submission:
    $.post("/tasks", payload).success(function(data) {
      var htmlString = taskHtml(data);
      var ulTodos = $('.todo-list');
      ulTodos.append(htmlString);
      // Ensure that checking a freshly added item (no get request has been issued) sets "done" to true in the database:
      $('.toggle').click(toggleTask);
    });
  });
});