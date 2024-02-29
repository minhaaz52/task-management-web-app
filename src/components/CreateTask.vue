<script setup>
import { ref, reactive } from "vue"
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "@/firebase"

const data = reactive({
    statusItems: [
        { name: "To Do", id: "To Do" },
        { name: "In Progress", id: "In Progress" },
        { name: "Done", id: "Done" }
    ],

    selectedStatus: "To Do",
    name: "",
    description: "",
    btnLoading: false,
})

const createTaskForm = ref(null)

const emits = defineEmits(['closeDialogEmit'])


const nameRules = [v => !!v || 'Name is required']
const descriptionRules = [v => !!v || 'Description is required']
const statusRules = [v => !!v || "Status is required"]


const closeDialog = () => {
    emits('closeDialogEmit')
}

const submitForm = async () => {
    try{
        data.btnLoading=true;
        const validate = await createTaskForm.value.validate();

        if (!validate.valid){
            data.btnLoading=false;
            return;
        }

        const date=new Date();
        const taskRef=collection(db, "tasks");
        const docRef=doc(taskRef)
        await setDoc(docRef, {
            name: data.name,
            description: data.description,
            status: data.selectedStatus,
            createdOn: date.toString(),
            updatedOn: "",
            id: docRef.id
        })
        closeDialog();
        data.btnLoading=false;
    } catch(err){
        data.btnLoading=false;
        alert("Something went wrong");
    }
}

</script>


<template>
    <v-form class="d-flex flex-column justify-center align-center w-100 h-100 pa-2" @submit.prevent="submitForm"
        ref="createTaskForm">
        <v-card class="pa-4 w-50">
            <div class="d-flex align-center mb-2">
                <v-icon size="large">mdi-plus</v-icon>
                <h4>Create Task</h4>
            </div>
            <v-text-field v-model="data.name" class="mb-4 mr-4" required hide-details="auto" label="Task Name" :rules="nameRules"
                variant="outlined"></v-text-field>

            <v-text-field v-model="data.description" class="mb-4 mr-4" required hide-details="auto" label="Task Description" :rules="descriptionRules"
                variant="outlined"></v-text-field>

            <v-autocomplete v-model="data.selectedStatus" label="Status" required class="mr-4" :items="data.statusItems"
                item-title="name" item-value="id" :rules="statusRules" variant="outlined"></v-autocomplete>

            <div class="">
                <v-btn :loading="data.btnLoading" type="submit" color="primary" class="elevation-0 w-100 pa-2 mb-4 rounded-xl">
                    Create
                </v-btn>

                <v-btn @click="closeDialog" variant="outlined" color="primaryOnColor" class="w-100 mb-4 rounded-xl">
                    Cancel
                </v-btn>
            </div>
        </v-card>
    </v-form>
</template>