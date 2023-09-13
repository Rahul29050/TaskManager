<template>
  <div>
    <v-dialog :value="visible" max-width="1000" @input="updateVisible">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props" class="btn">
          Create Task
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Create Task</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="newTask.Title"
                  label="Title*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newTask.Description"
                  label="Description*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
              <v-text-field
                v-model="newTask.DueDate"
                label="DueDate*"
                type="date"
                required
                :min="getTodayDate()"
              ></v-text-field>
            </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="newTask.Priority"
                  :items="priorities"
                  label="Priority*"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="newTask.Category"
                  :items="categories"
                  label="Category"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="closeDialog"
          >
            Close
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="saveTask"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import axios from "axios";
import { mapMutations, mapGetters } from "vuex";
import store from "../store/index";

const id = store.getters.userId;

export default {
  props: {
    visible: Boolean,
  },
  computed: {
    ...mapGetters(["userId"]), 
  },
  data() {
    return {
      newTask: {
        Title: "",
        Description: "",
        DueDate: "",
        Priority: "",
        Category: [],
        user: id,
      },
      priorities: ["High", "Medium", "Low"],
      categories: ["learning", "daily", "games", "other"],
      categoryDialogVisible: false,
    };
  },
  methods: {
    closeCategoryDialog() {
      this.categoryDialogVisible = false;
    },
    closeDialog() {
      this.$emit("update:visible", false);
    },
    updateVisible(value) {
      this.$emit("update:visible", value);
    },
        getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); 
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    fetchTasks() {
      axios
        .get('http://localhost:3000/tasks') 
        .then((response) => {
          this.tasks = response.data;
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
        });
    },
    saveTask() {
     this.newTask.user = this.id;

     axios
      .post("http://localhost:3000/addTask", this.newTask, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data.message);
        console.log(this.newTask);
        this.$emit("task-added", response.data);
        this.$emit("update:visible", false);
        this.$emit("save");
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
    },
  },
};
</script>


<style scoped>
body {
  position: fixed;
  z-index: 999;
}

.btn {
  margin-top: 40px;
}

.btn1 {
  margin-top: 40px;
  margin-right: 20px;
}
</style>
