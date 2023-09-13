<template>
  <v-container class="registration-page" data-aos="flip-right">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="2">
          <v-card-title class="text-center">
            <h2 class="display-2">Register</h2>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field v-model="userName" label="Username" required></v-text-field>
              <v-text-field v-model="email" label="Email" required></v-text-field>
              <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
              <v-text-field v-model="confirmPassword" label="Confirm Password" type="password" required></v-text-field>
              <v-btn type="submit" color="primary" block>Register</v-btn>
            </v-form>
            <div v-if="registrationSuccess">
              Registration successful. You can now log in.
            </div>
          </v-card-text>
          <v-card-actions class="justify-center">
            <span>Already have an account? <router-link to="/">Login</router-link></span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'; 

export default {
  data() {
    return {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      registrationSuccess: false,
    };
  },
  methods: {
    async register() {
      try {
        const response = await this.$store.dispatch('registerUser', {
          username: this.userName,
          email: this.email,
          password: this.password,
        });

        if (response.success) {
          this.registrationSuccess = true;
        } else {
          console.error('Registration failed.');
        }
      } catch (error) {
        console.error('Registration failed:', error);
      }
    },
  },
};
</script>



<style scoped>
.registration-page {
  margin-top: 20px;
}

.v-card {
  border-radius: 8px;
  background-color: #f4f4f4;
}

.v-card-title {
  background-color: #2196F3; 
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 20px;
}

.display-2 {
  font-weight: bold;
  margin: 0;
}

.v-card-actions {
  background-color: #f4f4f4;
  border-radius: 0 0 8px 8px;
  padding: 20px;
  text-align: center;
}

.router-link-exact-active {
  color: #2196F3; 
}
img{
    height: 100px;
    width: 300px;
}
</style>
