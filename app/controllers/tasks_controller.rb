class TasksController < ApplicationController
  def index
    # Show JSON representation of the Task items in the database:
    render json: Task.all
  end

  def update
    task = Task.find(params[:id])
    task.update_attributes(task_params)
    render json: task
  end

  private

  def task_params
    params.require(:task).permit(:done)
  end
end
