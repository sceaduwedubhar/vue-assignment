import { defineStore } from "pinia";

export interface RecordInfo {
  timezone: string;
  timestamp: string;
  lat: number;
  lng: number;
  location: string;
}

export const useRecordStore = defineStore("record", {
  state: () => ({
    records: [] as RecordInfo[],
  }),
  getters: {},
  actions: {
    addRecord(newRecord: RecordInfo) {
      this.records = [...this.records, newRecord];
    },
    removeRecord(list: number[]) {
      const temp = [...this.records];
      for (let i = 0; i < list.length; i++) {
        temp.splice(list[i], 1);
      }
      this.records = [...temp];
    },
  },
});
