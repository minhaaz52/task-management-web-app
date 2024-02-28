<script setup>
import { ref } from "vue"

const createTaskForm = ref(null)

const emits = defineEmits(['closeDialogEmit'])

const closeDialog = () => {
    emits('closeDialogEmit')
}

const submitForm = () => {
    console.log("submitted")
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
            <v-text-field class="mb-4 mr-4" hide-details="auto" label="Task Name"
                variant="outlined"></v-text-field>

            <v-text-field class="mb-4 mr-4" hide-details="auto" label="Task Description"
                variant="outlined"></v-text-field>

            <v-autocomplete label="Status" class="mr-4" item-title="name" item-value="id" variant="outlined"></v-autocomplete>

            <div class="">
                <v-btn type="submit" variant="outlined" color="deep-purple-accent-4" class="w-100 pa-2 mb-4 rounded-xl">
                    Create
                </v-btn>

                <v-btn @click="closeDialog" variant="outlined" color="deep-purple-accent-4" class="w-100 mb-4 rounded-xl">
                    Cancel
                </v-btn>
            </div>
        </v-card>
    </v-form>
</template>