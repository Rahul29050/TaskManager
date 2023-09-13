<template>
  <div>
    <h1 class="page-title">Task Done</h1>
    <ul class="task-list">
      <li v-for="task in sharedTasks" :key="task.id" class="task-item">
        <div class="task-info">
          <span class="task-title">{{ task.Title }} : </span>
          <span class="task-description">{{ task.Description }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["sharedTasks"]),
  },
  methods: {
    addTask(task) {
      console.log('Shared task received:', task);
    },
  },
};
</script>

<style scoped>
.page-title {
background-color: #3498db; 
color: #fff; 
padding: 10px 20px; 
border-radius: 5px; 
display: inline-block; 
box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); 
margin-bottom: 30px;
}

.task-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap : 25px;
}

.task-item {
  width: calc(33.33% - 20px);
  margin-bottom: 20px;
  padding: 16px;
  background-color: #a5a5a5;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease-in-out;
}

.task-info {
  text-align: center;
  margin-bottom: 10px;
}

.task-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.task-description {
  font-size: 16px;
  color: #000000;
  overflow: hidden; 
  white-space: nowrap; 
  text-overflow: ellipsis; 
}

.task-action-button {
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.task-action-button:hover {
  background-color: #0b7dda;
}
</style>
