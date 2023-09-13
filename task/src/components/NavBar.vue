<template>
  <div>
    <nav class="custom-navbar">
      <v-container fluid>
        <v-row>
          <v-col cols="auto">
            <span class="dashboard-text">Dashboard</span>
          </v-col>
          <v-col>
            <router-link :to="'/profile/'+userId">
              <v-avatar size="48">  
                <v-img :src="userAvatar"></v-img>
              </v-avatar>
            </router-link>
          </v-col>
          <v-col cols="auto">
            <v-btn text icon @click="logout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </nav>
    <TaskDialog
      :visible="createFormDialog"
      @update:visible="createFormDialog = $event"
      @close="closeCreateForm"
      @save="saveTask"
    ></TaskDialog>
  </div>
</template>

<script>
import TaskDialog from "./TaskDialog.vue";
import UserProfile from "./UserProfile.vue";
import { mapActions, mapGetters } from 'vuex';
import store from "../store/index";

const id = store.getters.userId;
console.log(id);
export default {
  
  components: {
    TaskDialog,
    UserProfile,
  },
  data() {
    return {
      userProfileVisible: false, 
    };
  },
  computed: {
    ...mapGetters(['userId']), 
    isAuthenticated() {
      return this.user !== null;
    },
    userAvatar() {
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_g_7YVzERozXI_mfnbSPkggiXqlljwtCQXw&usqp=CAU";
    },
  },
  methods: {
    toggleUserProfile() {
    this.userProfileVisible = !this.userProfileVisible;
  },
    openUserProfile() {
      this.userProfileVisible = !this.userProfileVisible;
    },
    ...mapActions(['logoutUser']),
    logout() {
      this.logoutUser()
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>

.dashboard-text {
  color:aliceblue;
  font-size: 36px; 
  font-weight: bold; 
}

.custom-navbar {
  background-color: #333;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 10vh;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  margin-bottom: 50px;
}

.custom-navbar v-btn {
  color: rgb(9, 9, 9);
}

v-icon {
  color: black;
}

@media (max-width: 600px) {
  .custom-navbar {
    height: 15vh;
  }
}
</style>
