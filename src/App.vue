<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router"
import AppBar from "./components/AppBar.vue";
import "./style.css"

const route=useRoute();

</script>

<template>
  <v-app>
    <div v-if="route.name != 'login' && route.name != 'signUp'">
      <AppBar />
    </div>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
