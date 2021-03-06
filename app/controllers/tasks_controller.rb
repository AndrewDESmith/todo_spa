class TasksController < ApplicationController
  def index
    # Show JSON representation of the Task items in the database, ordering by id:
    render json: Task.order(:id)
  end

  def update
    task = Task.find(params[:id])
    task.update_attributes(task_params)
    render json: task
  end

  def create
    task = Task.create(task_params)
    render json: task
  end

  private

  def task_params
    params.require(:task).permit(:done, :title)
  end
end
