<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { loader } from "../services/google-map.service";
import { useRecordStore } from "../services/store.service";
import SearchRecord from "./SearchRecord.vue";

const store = useRecordStore();

const location = ref("");

const data = computed(() => store.records);

let map: google.maps.Map;
let service: google.maps.places.PlacesService;
let markers: google.maps.Marker[] = [];

onMounted(() => {
  loader
    .load()
    .then((google) => {
      map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: {
          lat: 43.6532,
          lng: -79.3832,
        },
        zoom: 10,
      });

      service = new google.maps.places.PlacesService(map);
    })
    .catch((e) => {
      console.log(e);
    });
});

function search() {
  if (location.value.length === 0) return;
  service.findPlaceFromQuery(
    {
      query: location.value,
      fields: ["name", "geometry"],
    },
    (results, status) => {
      console.log(results);
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          if (!results[i]?.geometry || !results[i]?.geometry?.location) return;

          const marker = new google.maps.Marker({
            map,
            position: results[i].geometry?.location,
          });

          store.addRecord({
            timestamp: new Date().toLocaleString(),
            timezone: new Date().toTimeString().split(" ")[1],
            lat: results[i].geometry?.location?.lat()!,
            lng: results[i].geometry?.location?.lng()!,
            location: results[i].name!,
          });

          markers.push(marker);
        }

        map.setCenter(results[0].geometry?.location!);
      } else {
        confirm("Address not found");
      }
    }
  );
}

function currentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      if (
        !position.coords ||
        !position.coords.latitude ||
        !position.coords.longitude
      )
        return;
      const marker = new google.maps.Marker({
        map,
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      });
      store.addRecord({
        timestamp: new Date().toLocaleString(),
        timezone: new Date().toTimeString().split(" ")[1],
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        location: "Current Location",
      });
      map.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      markers.push(marker);
    });
  } else {
    console.log("not support");
  }
}

function removeMarker(list: number[]) {
  store.removeRecord(list);
  for (let i = 0; i < list.length; i++) {
    markers[list[i]].setMap(null);
    markers.splice(list[i], 1);
  }
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex gap-1 border border-black">
      <input
        id="input"
        class="flex-1"
        type="search"
        v-model="location"
        @keyup.enter="search"
      />
      <button @click="search">Search</button>
      <button @click="currentLocation">Current Location</button>
    </div>
    <div id="map" class="h-120"></div>
    <SearchRecord
      class="w-full"
      :display-row="10"
      :data="data"
      :fields="['timezone', 'timestamp', 'location']"
      @remove-list="(e) => removeMarker(e)"
    />
  </div>
</template>
