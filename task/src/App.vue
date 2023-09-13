<template>
  <div id="app" class="background">  
    <router-view />
  </div>
</template>

<script>
import LoginPage from "./views/LoginPage.vue";

export default {
  name: "App",
  components: {
    LoginPage,
  },
};
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  max-height: 100vh;

}
</style>
