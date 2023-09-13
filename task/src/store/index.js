import { createStore } from "vuex";
import axios from "axios";

const loadUserFromSessionStorage = () => {
  const user = sessionStorage.getItem("user");
  const token = sessionStorage.getItem("authToken");
  if (user && token) {
    return {
      user: JSON.parse(user),
      token,
    };
  }
  return null;
};

const store = createStore({
  state: {
    ...loadUserFromSessionStorage() || {
      user: null,
      token: null,
    },
    userProfile: null,
    tasks: [],
    sharedTasks: [],
    selectedCategoryFilter: "",
    userAvatar: "",
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SETSHARED_TASKS(state, SharedTasks) {
      state.sharedTasks = SharedTasks;
    },
    ADD_SHARED_TASK(state, task) {
      state.sharedTasks.push(task);
    },
    REMOVE_TASK(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId);
    },
    UPDATETASK(state, updatedTask) {
      const index = state.tasks.findIndex(
        (task) => task._id === updatedTask._id
      );
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
      const sharedIndex = state.SharedTasks.findIndex(
        (task) => task._id === updatedTask._id
      );
      if (sharedIndex !== -1) {
        state.SharedTasks[sharedIndex] = updatedTask;
      }
    },
    deleteTask(state, taskId) {
      state.tasks = state.tasks.filter((task) => task._id !== taskId);
    },
    SET_SELECTED_CATEGORY_FILTER(state, category) {
      state.selectedCategoryFilter = category;
    },
    SET_USER_PROFILE(state, userProfile) {
      state.userProfile = userProfile;
    },
    SET_USER_AVATAR(state, avatarUrl) {
      state.userAvatar = avatarUrl;
    },
  },
  actions: {
    async loginUser({ commit }, { user, token }) {
      commit("SET_USER", user);
      commit("SET_TOKEN", token);

      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    },
    logoutUser({ commit }) {
      commit("SET_USER", null);
      commit("SET_TOKEN", null);
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
    },
    async registerUser({ commit }, userData) {
      try {
        await axios.post("http://localhost:3000/register", userData);
        return { success: true, message: "User registered successfully" };
      } catch (error) {
        console.error("Error registering user:", error);

        return { success: false, message: "Registration failed" };
      }
    },
    async updateUserProfile({ commit }, updatedProfile) {
      try {
        const response = await axios.put(
          "http://localhost:3000/updateProfile",
          updatedProfile
        );

        commit("SET_USER_PROFILE", response.data);

        return { success: true, message: "Profile updated successfully" };
      } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, message: "Profile update failed" };
      }
    },
  },
  getters: {
    isAuthenticated: (state) => {
      return state.user !== null && state.token !== null;
    },

    userId: (state) => {
      return state.user ? state.user.id : null;
    },
  },
});
export default store;