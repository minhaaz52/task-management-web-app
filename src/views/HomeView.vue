<script setup>
import { reactive, onMounted, watch } from "vue"
import { useStore } from "vuex"
import { collection, onSnapshot, doc, deleteDoc, writeBatch } from "firebase/firestore";
import { db, auth } from "@/firebase"
import { onAuthStateChanged } from "firebase/auth"

import CreateTask from "@/components/CreateTask.vue"
import EditTask from "@/components/EditTask.vue"

const data = reactive({
  items: [],
  filterdItems: [],

  filterStatus: [
    { name: "All", id: "All" },
    { name: "To Do", id: "To Do" },
    { name: "In Progress", id: "In Progress" },
    { name: "Done", id: "Done" }
  ],

  selectedFilter: "All",
  search: "",
  dialog: false,
  selectedItems: [],
  editDialog: false,
  selectedItem: "",
  deleteLoading: false,
  userDetails: {},
  tableLoading: true,
})

const store = useStore();

watch(
  () => data.search,
  () => {
    getFilteredData();
  }
)

watch(
  () => data.selectedFilter,
  () => {
    getFilteredData();
  }
)

const headers = [
  { title: 'Name', align: 'start', sortable: true, key: 'name' },
  { title: 'Description', align: 'center', sortable: true, key: 'description', class: "description-column" },
  { title: 'Status', align: 'center', sortable: true, key: 'status' },
  { title: 'Created On', align: 'center', sortable: true, key: 'createdOn' },
  { title: 'Updated On', align: 'center', sortable: true, key: 'updatedOn' },
  { title: 'Actions', align: 'center', key: 'actions', sortable: false },
]

onMounted(async () => {
  await getUserDetails();
})


const closeAddTaskDialog = () => {
  data.dialog = false;
}

const closeEditTaskDialog = () => {
  data.editDialog = false;
}

const getUserDetails = async () => {
  try{
    data.tableLoading=true;
    onAuthStateChanged(auth, async(user) => {
      if (user) {
        store.commit("setUserDetails", user);
        data.userDetails=store.state.userDetails;
        await getAllData();
        data.tableLoading=false;
      }
    })
  } catch(err){
    data.tableLoading=false;
    alert(err);
  }

}

const getFilteredData = () => {
  try {
    data.tableLoading=true;
    data.filterdItems.splice(0)
    for (const item of data.items) {
      if (item.name?.toLowerCase()?.includes(data.search) && (data.selectedFilter === 'All' || data.selectedFilter === item.status)) {
        data.filterdItems.push(item);
      }
    }
    data.tableLoading=false;
  } catch (err) {
    data.tableLoading=false;
    alert("Something went wrong")
  }
}

const getAllData = async () => {
  try {
    data.tableLoading=true;
    const tasksRef = collection(db, "users", data.userDetails.uid, "tasks")
    onSnapshot(tasksRef, (querySnapshot) => {
      data.items.splice(0)
      data.tableLoading=true;
      querySnapshot.forEach((task) => {
        data.items.push(task.data());
      })
      getFilteredData();
      data.tableLoading=false;
    })
  } catch (err) {
    data.tableLoading=false;
    alert("Something went wrong")
  }
}

const deleteItems = async () => {
  try {
    data.deleteLoading = true;
    const batch = writeBatch(db);
    for (const item of data.selectedItems) {
      const docRef = doc(db, "users", data.userDetails.uid, 'tasks', item);
      batch.delete(docRef);
    }
    await batch.commit();
    data.deleteLoading = false;
  } catch (err) {
    data.deleteLoading = false;
    alert("Something went wrong");
  }
}

const deleteSingleItem = async (id) => {
  try {
    const docRef = doc(db, "users", data.userDetails.uid, "tasks", id)
    await deleteDoc(docRef);

  } catch (err) {
    alert("Something went wrong");
  }
}

const editItem = (item) => {
  data.selectedItem = item.id
  data.editDialog = true;
}



const getItemColor = (item) => {
  if (item.status === "Done")
    return "green"
  else if (item.status === "In Progress")
    return "orange"
  return "red"
}

const formatTime = (time) => {
  if (!time)
    return ""

  const date = new Date(time);
  if (!date)
    return "";

  const d = date.getDate().toString().padStart(2, "0")
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const y = date.getFullYear().toString().padStart(2, "0")
  const h = date.getHours().toString().padStart(2, "0")
  const mn = date.getMinutes().toString().padStart(2, "0")
  const s = date.getSeconds().toString().padStart(2, "0")

  const temp = `${d}-${m}-${y} ${h}:${mn}:${s}`
  return temp;
}

</script>

<template>
  <div class="d-flex w-100 h-100 align-center justify-center bg-primary">
    <div class="w-75 h-75 d-flex flex-column">
      <v-card width="100%" class="pa-4 mb-4 d-flex align-center justify-space-around">
        <h5 class="text-h5 font-weight-medium">Tasks</h5>
        <div class="d-flex h-25 align-center justify-space-between w-75">
          <v-text-field v-model="data.search" class="mb-4 mr-4" hide-details="auto" label="Search by name"
            prepend-inner-icon="mdi-magnify" variant="outlined"></v-text-field>

          <v-autocomplete label="Filter" class="mr-4" v-model="data.selectedFilter" :items="data.filterStatus"
            item-title="name" item-value="id" variant="outlined"></v-autocomplete>

          <v-btn :loading="data.deleteLoading" class="rounded-xl mr-4" color="primaryOnColor" variant="outlined"
            @click="deleteItems">Delete</v-btn>
          <v-btn color="primary" class="rounded-xl elevation-0" @click="data.dialog = true;">Create</v-btn>

        </div>
      </v-card>

      <v-card>
        <v-data-table :loading="data.tableLoading" v-model="data.selectedItems" :headers="headers" :items="data.filterdItems" show-select>

          <template v-slot:item.actions="{ item }">
            <v-icon size="large" class="me-2" @click="editItem(item)">
              mdi-square-edit-outline
            </v-icon>

            <v-icon size="large" class="me-2" color="red" @click="deleteSingleItem(item.id)">
              mdi-trash-can-outline
            </v-icon>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip :color="getItemColor(item)">{{ item.status }}</v-chip>
          </template>

          <template v-slot:item.createdOn="{ item }">
            <v-chip> {{ formatTime(item.createdOn) }} </v-chip>
          </template>

          <template v-slot:item.updatedOn="{ item }">
            <v-chip> {{ formatTime(item.updatedOn) }} </v-chip>
          </template>


        </v-data-table>
      </v-card>
    </div>
  </div>

  <!-- Dialog for task creation -->

  <v-dialog v-model="data.dialog" persistent>
    <CreateTask v-if="data.dialog" @close-dialog-emit="closeAddTaskDialog" />
  </v-dialog>

  <!-- Dialog for task edit -->
  <v-dialog v-model="data.editDialog" persistent>
    <EditTask v-if="data.editDialog" :itemId="data.selectedItem" @close-dialog-emit="closeEditTaskDialog" />
  </v-dialog>
</template>
