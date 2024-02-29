import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/firebase"
import store from "@/store"
import router from "@/router"

export default {
    getCurrentUser: async function () {
        try {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    store.commit("setUserDetails", user);
                } else {
                    console.log('user logged out')
                    router.replace("/login")
                }
            })
        } catch (err) {
            alert(err);
        }
    },

    logout: async function (){
        signOut(auth).then(() => {
        }).catch((error) => {
            alert(error);
        });
    }
}
