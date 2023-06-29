<script setup lang="ts">
import { onUpdated, ref } from "vue";

const props = defineProps({
  total: {
    type: Number,
    default: 1,
    validator(value) {
      return Number.isInteger(value);
    },
  },
});

const emit = defineEmits(["pageChange"]);

const current = ref(1);

onUpdated(() => {
  if (current.value > props.total && props.total > 0) {
    current.value = props.total;
    emit("pageChange", current.value);
  }
});

function inRange(page: number) {
  if (current.value <= 1) {
    return page < current.value + 3 && page <= props.total;
  } else if (current.value >= props.total) {
    return page > current.value - 3 && page >= 1;
  } else {
    return page <= current.value + 1 && page >= current.value - 1;
  }
}

function clickPage(pageNo: number) {
  current.value = pageNo;
  emit("pageChange", pageNo);
}

function toStart() {
  if (current.value <= 1) return;
  current.value = 1;
  emit("pageChange", 1);
}

function toEnd() {
  if (current.value >= props.total) return;
  current.value = props.total;
  emit("pageChange", props.total);
}

function pervious() {
  if (current.value <= 1) return;
  current.value--;
  emit("pageChange", current.value);
}

function next() {
  if (current.value >= props.total) return;
  current.value++;
  emit("pageChange", current.value);
}
</script>

<template>
  <div class="flex gap-2">
    <div
      :class="`grid items-center p-2 ${current > 1 ? 'cursor-pointer' : ''}`"
      @click="toStart"
    >
      <i
        :class="`fa-solid fa-angles-left ${
          current > 1 ? 'hover:text-blue-700' : 'text-gray-300'
        }`"
      ></i>
    </div>
    <div
      :class="`grid items-center p-2 ${current > 1 ? 'cursor-pointer' : ''}`"
      @click="pervious"
    >
      <i
        :class="`fa-solid fa-angle-left ${
          current > 1 ? 'hover:text-blue-700' : 'text-gray-300'
        }`"
      ></i>
    </div>
    <template v-for="n in total">
      <div
        :class="`grid items-center py-1 px-2 ${
          n !== current
            ? 'hover:text-blue-700 cursor-pointer'
            : 'rounded-lg bg-blue-500 text-white font-bold'
        }`"
        v-if="inRange(n)"
        @click="clickPage(n)"
      >
        <span>{{ n }}</span>
      </div>
    </template>

    <div
      :class="`grid items-center p-2 ${
        current < total ? 'cursor-pointer' : ''
      }`"
      @click="next"
    >
      <i
        :class="`fa-solid fa-angle-right ${
          current < total ? 'hover:text-blue-700' : 'text-gray-300'
        }`"
      ></i>
    </div>
    <div
      :class="`grid items-center p-2 ${
        current < total ? 'cursor-pointer' : ''
      }`"
      @click="toEnd"
    >
      <i
        :class="`fa-solid fa-angles-right ${
          current < total ? 'hover:text-blue-700' : 'text-gray-300'
        }`"
      ></i>
    </div>
  </div>
</template>
