require 'rails_helper'

RSpec.describe TasksController, type: :controller do
  describe "tasks#index" do
    it "should list the tasks in the database" do
      task1 = FactoryGirl.create(:task)
      task2 = FactoryGirl.create(:task)
      # Make an arbitrary update to the first task after the second task is build:
      task1.update_attributes(title: "Something else")
      get :index
      expect(response).to have_http_status :success
      response_value = ActiveSupport::JSON.decode(@response.body)
      expect(response_value.count).to eq(2)
      # Result from the API call is an array of JSON tasks.  Extract (collect) each task's id value into an array:
      response_ids = response_value.collect do |task|
        task["id"]
      end
      # Expect items to come back in the order in which they were created:
      expect(response_ids).to eq([task1.id, task2.id])
    end
  end

  describe "tasks#update" do
    it "should allow tasks to be marked as done" do
      task = FactoryGirl.create(:task, done: false)
      put :update, id: task.id, task: { done: true }
      expect(response).to have_http_status(:success)
      task.reload
      expect(task.done).to eq(true)
    end
  end

  describe "tasks#create" do
    it "should allow new tasks to be created" do
      post :create, task: { title: "Fix things" }
      expect(response).to have_http_status(:success)
      response_value = ActiveSupport::JSON.decode(@response.body)
      expect(response_value['title']).to eq("Fix things")
      expect(Task.last.title).to eq("Fix things")
    end
  end

end
