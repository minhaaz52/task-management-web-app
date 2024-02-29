<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { signInWithEmailAndPassword } from "firebase/auth"
import { db, auth } from "@/firebase"


const router = useRouter();
const store=useStore();

const data=reactive({
    email: "",
    password: "",
    loginLoading: false,
})

const loginForm = ref(null);

const emailRules=store.state.emailRules
const passwordRules=store.state.passwordRules

const submitForm = async() => {
    try{
        data.loginLoading=true;
        const validate=await loginForm.value.validate();
        if (!validate.valid){
            data.loginLoading=false;
            return;
        }

        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user=userCredential.user;

        store.commit("setUserDetails", user);

        console.log("user :", store.state.userDetails);
        data.loginLoading=false;
        router.replace('/')
    } catch(err){
        data.loginLoading=false;
        alert(err);
    }
}

</script>

<template>
    <div class="w-100 h-100 d-flex align-center justify-center bg-primary">
        <v-form class="d-flex flex-column justify-center align-center w-100 h-100 pa-2" @submit.prevent="submitForm"
            ref="loginForm">
            <v-card class="w-25">
                <div class="w-100 pa-2">
                    <v-text-field v-model="data.email" class="mb-4" hide-details="auto" label="Email address" variant="outlined"
                        type="email" :rules="emailRules"></v-text-field>
                    <v-text-field v-model="data.password" class="mb-2" hide-details="auto" label="Password" variant="outlined"
                        type="password" :rules="passwordRules"></v-text-field>
                </div>
                <div class="w-100 px-2">
                    <v-btn :loading="data.loginLoading" type="submit" color="primary" class="elevation-0 w-100 pa-2 mb-4 rounded-xl">
                        Login
                    </v-btn>

                    <v-btn @click="router.push('/signup')" variant="outlined" color="primaryOnColor" class="w-100 mb-4 rounded-xl">
                        Create An Account
                    </v-btn>
                </div>
            </v-card>
        </v-form>
    </div>
</template>