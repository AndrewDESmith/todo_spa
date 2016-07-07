class TasksController < ApplicationController
  def index
    # Show JSON representation of the Task items in the database:
    render json: Task.all
  end
end
