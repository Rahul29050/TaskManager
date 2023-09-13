<template>
  <div class="user-profile">
    <div class="user-info">
      <h2>User Profile</h2>
      <div class="avatar-container">
        <img :src="userAvatar" alt="User Avatar" class="user-avatar" />
      </div>
      <p><strong>Username:</strong> {{ userProfile.username }}</p>
      <p><strong>Email:</strong> {{ userProfile.email }}</p>
    </div>

    <div class="password-update">
      <h3>Update Password</h3>
      <v-form @submit="updatePassword">
        <v-text-field
          v-model="newPassword"
          label="New Password"
          type="password"
          required
        ></v-text-field>
        <v-btn type="submit" color="primary">Update Password</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script >
import axios from 'axios';
import {onMounted} from 'vue';
import { mapActions, mapGetters } from 'vuex';


export default {
  data() {
    return {
      newPassword: '',
      userProfile: null,  
    };
  },
  computed: {
    ...mapGetters(['userId']), 
        userAvatar() {
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_g_7YVzERozXI_mfnbSPkggiXqlljwtCQXw&usqp=CAU";
    },
    user() {
    return this.$store.getters.user;
  },
   
  },
  methods: {
    fetchUserProfile() {
  axios.get(`http://localhost:3000/users/${this.userId}`)
    .then(response => {
      this.userProfile = response.data;
      console.log('User Profile Response:', this.userProfile); 
    })
    .catch(error => {
      console.error('Error fetching user profile:', error);
    });
},

updatePassword() {
    axios
      .post(`http://localhost:3000/change-password/${this.userId}`, {
        newPassword: this.newPassword,
      })
      .then(response => {
        console.log('Password updated successfully');
        this.newPassword = '';
      })
      .catch(error => {
        console.error('Error updating password:', error);
      });
    },
  },  
  created() {
    this.fetchUserProfile();
  },
};
</script>

<style scoped>
.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center;
  height: 100vh; 
}

.user-info {
  text-align: center;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.avatar-container {
  margin-bottom: 20px;
}

.user-avatar {
  width: 100px; 
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.password-update {
  text-align: center;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>  
