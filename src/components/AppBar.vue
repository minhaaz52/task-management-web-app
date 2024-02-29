<script setup>
import { reactive, onMounted } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import AuthService from "@/controllers/AuthService"

const data = reactive({
    userDetails: {},
})

const store = useStore();
const router = useRouter();

onMounted(async () => {
    await getUserDetails();
})

const getUserDetails = async () => {
    await AuthService.getCurrentUser();
}

const logout = async () => {
    await AuthService.logout();
}

</script>

<template>
    <v-app-bar color="white" density="compact">
        <v-app-bar-title>To Do App</v-app-bar-title>

        <template v-slot:append>
            <h4 class="font-weight-medium">{{ store.state.userDetails.email }}</h4>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                </template>
                <v-list>
                    <v-list-item @click="logout">Logout</v-list-item>
                </v-list>
            </v-menu>
        </template>
    </v-app-bar>
</template>