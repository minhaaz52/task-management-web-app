<script setup>
import { reactive } from "vue"
import CreateTask from "@/components/CreateTask.vue"


const data = reactive({
  items: [
    {
      name: 'African Elephant',
      species: 'Loxodonta africana',
      diet: 'Herbivore',
      habitat: 'Savanna, Forests',
    },
  ],

  filterItems: [
    { name: "To Do", id: "toDo" },
    { name: "In Progress", id: "inProgress" },
    { name: "Done", id: "done" }
  ],

  dialog: true,

})


const closeAddTaskDialog=()=>{
  data.dialog=false;
}

</script>

<template>
  <div class="d-flex w-100 h-100 align-center justify-center bg-primary">
    <div class="w-75 h-75 d-flex flex-column">
      <v-card width="100%" class="pa-4 mb-4 d-flex align-center justify-space-around">
        <h5 class="text-h5 font-weight-medium">Tasks</h5>
        <div class="d-flex h-25 align-center justify-space-between w-75">
          <v-text-field class="mb-4 mr-4" hide-details="auto" label="Search" prepend-inner-icon="mdi-magnify"
            variant="outlined"></v-text-field>

          <v-autocomplete label="Filter" class="mr-4" :items="data.filterItems" item-title="name"
            item-value="id" variant="outlined"></v-autocomplete>
          <v-btn color="primary" class="rounded-xl" @click="data.dialog=true;">Create</v-btn>
        </div>
      </v-card>

      <v-card>
        <v-data-table :items="data.items"></v-data-table>
      </v-card>
    </div>
  </div>

  <!-- Dialog for task creation -->

  <v-dialog v-model="data.dialog" persistent>
    <CreateTask v-if="data.dialog" @close-dialog-emit="closeAddTaskDialog"/>
  </v-dialog>
</template>
