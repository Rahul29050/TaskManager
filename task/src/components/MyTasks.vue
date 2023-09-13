<template>
  <div>
    <v-select
      v-model="selectedCategoryFilter"
      :items="categoryFilterOptions"
      label="Filter by Category"
      @change="applyCategoryFilter"
      class="category-filter"
    ></v-select>
   <div class="task-cards">
      <v-card
      v-for="task in filteredTasks"
      :key="task.id"
      class="task-card"
      max-width="300"
    >
      <v-card-title class="task-title">{{ task.Title }}</v-card-title>
      <v-card-text class="task-description">
        <div class="task-label"><b>Description:</b></div>
        <div class="task-detail">{{ task.Description }}</div>
        <div class="task-label"><b>Due Date:</b></div>
        <div class="task-detail">{{ task.DueDate }}</div>
        <div class="task-label"><b>Priority:</b></div>
        <div class="task-detail">{{ task.Priority }}</div>
        <div class="task-label"><b>Category:</b></div>
        <div class="task-detail">{{ task.Category }}</div>
      </v-card-text>
      <v-card-actions class="task-actions">
        <!-- Edit Button -->
        <v-icon left class="icon" @click="doneTask(task)">mdi-check</v-icon>

        <v-btn class="edit-button" color="White" @click="editTask(task)"
        >Edit
        </v-btn
          >
          <!-- Delete Button -->
        <v-btn class="delete-button" color="White" @click="deleteTask(task.id)"
        >Delete</v-btn
        >
      </v-card-actions>
    </v-card>

    <!-- Edit Task Form -->
    <v-dialog v-model="editingTaskDialog">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Task</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                v-model="editingTask.Title"
                label="Title*"
                required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editingTask.Description"
                  label="Description*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editingTask.DueDate"
                  label="Due Date*"
                  type="date"
                  required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                  v-model="editingTask.Priority"
                  :items="priorities"
                  label="Priority*"
                  required
                  ></v-select>
                </v-col>
              <v-col cols="12" sm="6">
                <v-select
                v-model="editingTask.Category"
                :items="categories"
                label="Category*"
                required
                solo
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updateTask">Save</v-btn>
          <v-btn color="red" @click="cancelEdit">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <v-snackbar
      v-model="sharedSuccessfully"
      :timeout="3000" 
      color="success"
    >
      Completed Successfully
    </v-snackbar>
</div>
</template>

<script>
import axios from "axios";
import { useStore } from "vuex";
import { mapState, mapMutations } from "vuex";  

export default {
  data() {
    return {
      tasks: [],
      newTask: {
        Title: "",
        Description: "",
        DueDate: "",
        Priority: "",
        Category: "",
      },
      sharedSuccessfully: false,
      selectedCategoryFilter: "View All", 
      categoryDialogVisible: false,
      editingTask: null,
      editingTaskDialog: false,
      priorities: ["High", "Medium", "Low"],
      categories: ["learning", "daily", "games", "other"],

    };
  },
  computed: {
    ...mapState(["tasks", "selectedCategoryFilter"]),

    categoryFilterOptions() {
      return ["View All", ...this.categories];
    },
    filteredTasks() {
      console.log(this.selectedCategoryFilter); 
      console.log(this.tasks); 
      if (this.selectedCategoryFilter === "View All") {
        return this.tasks;
      }

      return this.tasks.filter((task) =>
        task.Category.includes(this.selectedCategoryFilter)
      );
    },
  },
  methods: {
    ...mapMutations(["ADD_SHARED_TASK", "REMOVE_TASK"]),
    doneTask(task) {
      console.log("Task to be added to sharedTasks:", task);
      this.ADD_SHARED_TASK(task);
      this.REMOVE_TASK(task.id);   

      localStorage.setItem('myTasks', JSON.stringify(this.tasks));

      this.sharedSuccessfully = true;
    },

    fetchTasks() {
    const apiUrl = this.selectedCategoryFilter
      ? `http://localhost:3000/tasks?category=${this.selectedCategoryFilter}`
      : 'http://localhost:3000/tasks';

    axios
      .get(apiUrl)
      .then((response) => {
        this.tasks = response.data;
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  },
    createTask() {
      axios
        .post("http://localhost:3000/tasks", this.newTask)
        .then((response) => {
          console.log(response.data.message);
          this.tasks.push(response.data);
          this.clearForm();
        })
        .catch((error) => {
          console.error("Error creating task:", error);
        });
    },
    editTask(task) {
      this.editingTask = { ...task };
      this.editingTaskDialog = true;
    },
    updateTask() {
      axios
        .put(
          `http://localhost:3000/tasks/${this.editingTask.id}`,
          this.editingTask
        )
        .then((response) => {
          console.log(response.data.message);
          const taskIndex = this.tasks.findIndex(
            (t) => t.id === this.editingTask.id
          );
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = this.editingTask;
          }
          this.editingTask = null;
          this.editingTaskDialog = false;
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });
    },
    cancelEdit() {
      this.editingTask = null;
      this.editingTaskDialog = false;
    },
    deleteTask(taskId) {
      axios
        .delete(`http://localhost:3000/tasks/${taskId}`)
        .then((response) => {
          console.log(response.data.message);
          this.tasks = this.tasks.filter((task) => task.id !== taskId);
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
    },
    openCategoryFilterDialog() {
      this.categoryDialogVisible = true;
    },
    applyCategoryFilter() {
      this.categoryDialogVisible = false;
      this.fetchTasks(); 
    },
    closeCategoryDialog() {
      this.categoryDialogVisible = false;
    },
    clearForm() {
      this.editingTask = {
        Title: "",
        Description: "",
        DueDate: "",
        Priority: "",
        Category: "",
      };
    },
  },
  created() {
  const myTasks = JSON.parse(localStorage.getItem('myTasks'));
  if (myTasks) {
    this.tasks = myTasks;
  }

  this.fetchTasks();
},

  setup() {
    const store = useStore();
  },
};
</script>

<style scoped>
.task-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap : 25px;
}

.task-card {
  flex: 0 1 calc(25% - 20px); 
  margin-bottom: 20px;
  border-radius: 10px;
  background-color: #f0f0f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.v-snackbar.success {
  background-color: #0d0072; 
  color: white; 
  font-weight: bold;
}

.icon {
  margin-right: 20px;
  background-color: green;
  font-size: 24px;
  color: #ffffff;
  border-radius: 5px;
}

.icon:hover {
  background-color: rgb(0, 77, 0);
}


.task-card:hover {
  transform: translateY(-4px);
}

.task-title {
  font-size: 20px;
  font-weight: bold;
  padding: 16px;
  background-color: #4caf50;
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.task-description {
  padding: 16px;
  min-height: 120px;
  background-color: #fff;
}

.task-label {
  font-weight: bold;
}

.task-detail {
  margin-left: 8px;
}

.task-actions {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}

.category-filter {
  width: 200px;
  background-color: #636363;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 1px;
  margin-bottom: 10px;
  margin-left: 1050px;
  font-size: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;
}

.category-filter:hover {
  background-color: #636363;
}

.edit-button {
  margin-right: 8px;
  background-color: #2196f3;
  color: white;
}

.delete-button {
  background-color: #ff5722;
  color: white;
}
</style>
