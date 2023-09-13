<template>
  <div class="main">
    <NavBar />
    <MainTabs />
  </div>
</template>

<script>
import MainTabs from '../components/MainTabs.vue';
import NavBar from '../components/NavBar.vue';
import axios from 'axios';
import { mapGetters } from 'vuex'; 

export default {
  components: {
    MainTabs,
    NavBar,
  },
  computed: {
    ...mapGetters(['userId']),
    getToken() {
      return this.$store.state.token; 
    },
  },
  data() {
    return {
      tasks: [],
    };
  },
  created() {
    this.fetchUserTasks();
  },
  methods: {
    async fetchUserTasks() {
      try {
        const token = this.getToken;
        console.log('Token:', token);
        const headers = {
          Authorization: `Bearer ${token}`, 
        };

        const response = await axios.get('http://localhost:3000/tasks', { headers });
        this.tasks = response.data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
  },
};
</script>

<style scoped>
.main {
  height: 100vh;
}
</style>
