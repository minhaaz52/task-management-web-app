<script setup>
import { ref, reactive, onMounted } from "vue"
import { doc, setDoc, collection, getDoc, updateDoc } from "firebase/firestore";
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
    preLoader: true,
})

const createTaskForm = ref(null)

const emits = defineEmits(['closeDialogEmit'])
const props=defineProps(['itemId'])

const nameRules = [v => !!v || 'Name is required']
const descriptionRules = [v => !!v || 'Description is required']
const statusRules = [v => !!v || "Status is required"]


onMounted(async()=>{
    try{
        await getItemData();
        data.preLoader=false;
    } catch(err){
        data.preLoader=false;
        alert("Something went wrong")
    }
})

const closeDialog = () => {
    emits('closeDialogEmit')
}

const getItemData=async()=>{
    try{
        const docRef=doc(db, "tasks", props.itemId);
        const docSnap=await getDoc(docRef);

        if (docSnap.exists()){
            const temp=docSnap.data();
            data.name=temp.name;
            data.description=temp.description
            data.selectedStatus=temp.status;
            return;
        }
        closeDialog();
        alert("Document not found");
    } catch(err){
        alert("Something went wrong");
    }

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
        const taskRef=doc(db, "tasks", props.itemId);

        await updateDoc(taskRef, {
            name: data.name,
            description: data.description,
            status: data.selectedStatus,
            updatedOn: date.toString(),
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
            <div v-if="data.preLoader" class="h-100 w-100">
                <v-skeleton-loader type="card"></v-skeleton-loader>
            </div>
            <div v-else>
            <div class="d-flex align-center mb-2">
                <v-icon size="medium">mdi-pencil</v-icon>
                <h4>Edit Task</h4>
            </div>
            <v-text-field v-model="data.name" class="mb-4 mr-4" required hide-details="auto" label="Task Name" :rules="nameRules"
                variant="outlined"></v-text-field>

            <v-text-field v-model="data.description" class="mb-4 mr-4" required hide-details="auto" label="Task Description" :rules="descriptionRules"
                variant="outlined"></v-text-field>

            <v-autocomplete v-model="data.selectedStatus" label="Status" required class="mr-4" :items="data.statusItems"
                item-title="name" item-value="id" :rules="statusRules" variant="outlined"></v-autocomplete>

            <div class="">
                <v-btn :loading="data.btnLoading" type="submit" variant="outlined" color="deep-purple-accent-4" class="w-100 pa-2 mb-4 rounded-xl">
                    Update
                </v-btn>

                <v-btn @click="closeDialog" variant="outlined" color="deep-purple-accent-4" class="w-100 mb-4 rounded-xl">
                    Cancel
                </v-btn>
            </div>
            </div>
        </v-card>
    </v-form>
</template>