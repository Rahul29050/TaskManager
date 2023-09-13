<template>
  <div class="cards">
    <v-app class="main">
      <v-tabs v-model="activeTab">
        <v-tab v-for="(tab, index) in tabs" :key="index">{{ tab }}</v-tab>
      </v-tabs>
      <v-card>
        <v-card-text>  
         <component :is="selectedComponent" @task-done="handleTaskDone" />
        </v-card-text>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import MyTasks from './MyTasks.vue';
import SharedTasks from './SharedTasks.vue';


export default {
  components: {
    MyTasks,
    SharedTasks,
  },
  data() {
    return {
      activeTab: 0, 
      tabs: ['My Tasks', 'Completed Tasks'], 
      tasks: [], 
    };
  },
  computed: {
    selectedComponent() {
      if (this.activeTab === 0) {
        return 'MyTasks'; 
      } else if (this.activeTab === 1) {
        return 'SharedTasks'; 
      }
    },
  },
  methods: {
    handleTaskAdded(newTask) {
      this.tasks.push(newTask);
    },
    handleTaskDone(task) {
      console.log('Task done event received:', task);
      if (this.$refs.sharedTasks) {
        this.$refs.sharedTasks.addTask(task);
      }
    },
  },
};
</script>

<style scoped>
.main {
  margin: 80px 30px !important;
  background: transparent;
}

v-card-text {
  background: transparent;
  background-color: grey;
}

v-tabs {
  color: white;
}

</style>
