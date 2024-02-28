<script setup>
import { reactive, onMounted, watch } from "vue"
import { collection, onSnapshot, doc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase"

import CreateTask from "@/components/CreateTask.vue"


const data = reactive({
  items: [],
  filterdItems:[],

  filterStatus: [
    {name : "All", id: "All"},
    { name: "To Do", id: "To Do" },
    { name: "In Progress", id: "In Progress" },
    { name: "Done", id: "Done" }
  ],

  selectedFilter: "All",
  search: "",
  dialog: false,
  selectedItems:[],
})

watch(
  ()=>data.search,
  ()=>{
    getFilteredData();
  }
)

watch(
  ()=>data.selectedFilter,
  ()=>{
    getFilteredData();
  }
)

const headers = [
    { title: 'Name', align: 'start', sortable: true, key: 'name' },
    { title: 'Description', align: 'center', sortable: true, key: 'description' },
    { title: 'Status', align: 'center', sortable: true, key: 'status' },
    { title: 'Created On', align: 'center', sortable: true, key: 'createdOn' },
    { title: 'Updated On', align: 'center', sortable: true, key: 'updatedOn' },
    { title: 'Actions', align: 'center', key: 'actions', sortable: false },
]

const closeAddTaskDialog=()=>{
  data.dialog=false;
}

const getFilteredData=()=>{
  data.filterdItems.splice(0)
  for (const item of data.items){
    if (item.name?.toLowerCase()?.includes(data.search) && (data.selectedFilter==='All'|| data.selectedFilter===item.status)){
      data.filterdItems.push(item);
    }
  }
}

const deleteItems=async()=>{
  const batch = writeBatch(db);
  for (const item of data.selectedItems){
    const docRef=doc(db, 'tasks', item);
    batch.delete(docRef);
  }
  await batch.commit();
}

const getAllData=async()=>{
  const tasksRef=collection(db, "tasks")
  onSnapshot(tasksRef, (querySnapshot)=>{
    data.items.splice(0)
    querySnapshot.forEach((task)=>{
      data.items.push(task.data());
    })
    
    getFilteredData();
  })
}

onMounted(async()=>{
  await getAllData();
})


</script>

<template>
  <div class="d-flex w-100 h-100 align-center justify-center bg-primary">
    <div class="w-75 h-75 d-flex flex-column">
      <v-card width="100%" class="pa-4 mb-4 d-flex align-center justify-space-around">
        <h5 class="text-h5 font-weight-medium">Tasks</h5>
        <div class="d-flex h-25 align-center justify-space-between w-75">
          <v-text-field v-model="data.search" class="mb-4 mr-4" hide-details="auto" label="Search by name" prepend-inner-icon="mdi-magnify"
            variant="outlined"></v-text-field>

          <v-autocomplete label="Filter" class="mr-4" v-model="data.selectedFilter" :items="data.filterStatus" item-title="name"
            item-value="id" variant="outlined"></v-autocomplete>

            <v-btn color="primary" class="rounded-xl mr-4" @click="deleteItems">Delete</v-btn>
          <v-btn color="primary" class="rounded-xl" @click="data.dialog=true;">Create</v-btn>

        </div>
      </v-card>

      <v-card>
        <v-data-table v-model="data.selectedItems" :headers="headers" :items="data.filterdItems" show-select></v-data-table>
      </v-card>
    </div>
  </div>

  <!-- Dialog for task creation -->

  <v-dialog v-model="data.dialog" persistent>
    <CreateTask v-if="data.dialog" @close-dialog-emit="closeAddTaskDialog"/>
  </v-dialog>
</template>
