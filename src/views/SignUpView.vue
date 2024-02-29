<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { db, auth } from "@/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

const router = useRouter();
const store = useStore();


const data = reactive({
    email: "",
    password: "",
    confirmPassword: "",
    signUpLoading: false,
})

const signupForm = ref(null);

const emailRules = store.state.emailRules
const passwordRules = store.state.passwordRules
const confirmPasswordRules = [
    v => !!v || 'Confirm Password is required',
    v => v === data.password || 'Password does not match'
]

const submitForm = async () => {
    try {
        data.signUpLoading = true;
        const validate = await signupForm.value.validate();
        if (!validate.valid) {
            data.signUpLoading = false;
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
        console.log("userCredential :", userCredential)
        const user = userCredential.user;
        const uid = user.uid;

        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
            email: data.email,
            id: uid
        })
        data.signUpLoading = false;
        router.replace('/login')
        
    } catch (err) {
        data.signUpLoading = false;
        alert(err.message);
    }
}

</script>

<template>
    <div class="w-100 h-100 d-flex align-center justify-center bg-primary">
        <v-form class="d-flex flex-column justify-center align-center w-100 h-100 pa-2" @submit.prevent="submitForm"
            ref="signupForm">
            <v-card class="w-25">
                <div class="w-100 pa-2">
                    <v-text-field v-model="data.email" class="mb-4" hide-details="auto" label="Email address"
                        variant="outlined" type="email" :rules="emailRules"></v-text-field>

                    <v-text-field v-model="data.password" class="mb-2" hide-details="auto" label="Password"
                        variant="outlined" type="password" :rules="passwordRules"></v-text-field>

                    <v-text-field v-model="data.confirmPassword" class="mb-2" hide-details="auto" label="Confirm Password"
                        variant="outlined" type="password" :rules="confirmPasswordRules"></v-text-field>
                </div>
                <div class="w-100 px-2">
                    <v-btn type="submit" :loading="data.signUpLoading" color="primary"
                        class="elevation-0 w-100 pa-2 mb-4 rounded-xl">
                        Sign Up
                    </v-btn>

                    <v-btn @click="router.push('/login')" variant="outlined" color="primaryOnColor"
                        class="w-100 mb-4 rounded-xl">
                        Cancel
                    </v-btn>
                </div>
            </v-card>
        </v-form>
    </div>
</template>