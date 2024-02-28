<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router"
import "./style.css"

</script>

<template>
  <v-app class="w-100 h-100 bg-red">
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
