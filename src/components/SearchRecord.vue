<script setup lang="ts">
import { computed, ref } from "vue";
import Pagination from "./Pagination.vue";

const props = defineProps({
  displayRow: {
    type: Number,
    default: 10,
    validator(value) {
      return Number.isInteger(value);
    },
  },
  data: {
    type: Array<Object>,
    default: [],
  },
  fields: {
    type: Array<String>,
    default: [],
  },
});

const emit = defineEmits(["removeList"]);

const page = ref(1);
const removeList = ref<number[]>([]);

const data = computed(() => props.data);

function editRemoveList(id: number) {
  const index = removeList.value.indexOf(id);
  if (index < 0) {
    removeList.value.push(id);
  } else {
    removeList.value.splice(index, 1);
  }
}

function removeItems() {
  const sortedList = removeList.value.sort((a, b) => b - a);
  emit(
    "removeList",
    sortedList.map((v) => v + (page.value - 1) * props.displayRow)
  );
  removeList.value.splice(0);
}
</script>

<template>
  <div class="flex flex-col gap-2 items-center">
    <div class="flex flex-col w-full gap-1 border border-solid">
      <div
        class="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-1 p-1 font-bold bg-red-300"
      >
        <div class="grid justify-center">
          <button class="" @click="removeItems">Delete</button>
        </div>
        <div class="grid justify-center" v-for="value in props.fields">
          {{ value.toUpperCase() }}
        </div>
      </div>
      <div
        class="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-1"
        v-for="(value, index) in data.slice(
          (page - 1) * displayRow,
          page * displayRow
        )"
        :key="index"
      >
        <div class="grid justify-center">
          <input
            type="checkbox"
            :checked="removeList.includes(index)"
            @change="editRemoveList(index)"
          />
        </div>
        <div
          class="grid justify-center items-center"
          v-for="key in props.fields"
        >
          {{ value[key as keyof typeof value] }}
        </div>
      </div>
    </div>

    <Pagination
      :total="Math.ceil(data.length / displayRow)"
      @page-change="(e) => (page = e)"
    />
  </div>
</template>
