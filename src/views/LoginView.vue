<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"

const router = useRouter();

const loginForm = ref(null);

const submitForm = () => {
    router.replace('/')
}

</script>

<template>
    <div class="w-100 h-100 d-flex align-center justify-center">
        <v-form class="d-flex flex-column justify-center align-center w-100 h-100 pa-2" @submit.prevent="submitForm"
            ref="loginForm">
            <v-card class="w-25">
                <div class="w-100 pa-2">
                    <v-text-field class="mb-4" hide-details="auto" label="Email address" variant="outlined"
                        type="email"></v-text-field>
                    <v-text-field class="mb-2" hide-details="auto" label="Password" variant="outlined"
                        type="email"></v-text-field>
                </div>
                <div class="w-100 px-2">
                    <v-btn type="submit" variant="outlined" color="deep-purple-accent-4" class="w-100 pa-2 mb-4">
                        Login
                    </v-btn>

                    <v-btn @click="router.push('/signup')" variant="outlined" color="deep-purple-accent-4" class="w-100 mb-4">
                        Create An Account
                    </v-btn>
                </div>
            </v-card>
        </v-form>
    </div>
</template>