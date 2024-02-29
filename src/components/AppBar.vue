<script setup>
import { reactive, onMounted } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/firebase"


const data = reactive({
    userDetails: {},
})

const store = useStore();
const router = useRouter();

onMounted(async () => {
    await getUserDetails();
    data.userDetails = store.state.userDetails;
})

const getUserDetails = async () => {
    try {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                store.commit("setUserDetails", user);
                data.userDetails = user;
            } else {
                console.log('user logged out')
                router.replace("/login")
            }
        })
    } catch (err) {
        alert(err);
    }
}

const logout = async () => {
    signOut(auth).then(() => {
    }).catch((error) => {
        alert(error);
    });
}

</script>

<template>
    <v-app-bar color="white" density="compact">
        <v-app-bar-title>To Do App</v-app-bar-title>

        <template v-slot:append>
            <h4 class="font-weight-medium">{{ data.userDetails.email }}</h4>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                </template>
                <v-list>
                    <v-list-item @click="logout">Logout</v-list-item>
                </v-list>
                <!-- <v-list>
                    <v-list-item v-for="(item, index) in items" :key="index" :value="index">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list> -->
            </v-menu>
        </template>
    </v-app-bar>
</template>