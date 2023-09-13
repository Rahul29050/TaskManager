<template>
  <div class="login-page">
    <v-container data-aos="flip-right">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card elevation="2">
            <v-card-title class="text-center">
              <h2 class="display-2">Login</h2>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="login">
                <v-text-field v-model="email" label="Email" required></v-text-field>
                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                <v-btn type="submit" color="primary" block>Login</v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-center">
              <span>Don't have an account? <router-link to="/register">Sign up now</router-link></span>
            </v-card-actions>
          </v-card>
          <div v-if="loginResult === 'success'" class="success-message">
            Login successful. You can now access your dashboard.
          </div>
          <div v-if="loginResult === 'failed'" class="error-message">
            Login failed. Please check your credentials.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      loginResult: null,
    };
  },
  computed: {
    ...mapGetters(['userId']), 
  },
  methods: {
   ...mapActions(['loginUser']),
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email: this.email,
          password: this.password,
        });
      
        if (response.status === 200) {
          this.loginUser({
            user: response.data.user,
            token: response.data.token,
          });
          this.loginResult = 'success';
          this.$router.push('/dashboard');
        } else {
          console.error('Login failed:', response.data.error);
          this.loginResult = 'failed';
        }
      } catch (error) {
        console.error('Login failed:', error);
        this.loginResult = 'failed';
      }
    },
  },
};
</script>