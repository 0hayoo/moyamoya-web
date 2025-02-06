<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold text-gray-800 flex items-center">
        🏫 학교 검색 & 대기열
      </h1>

      <!-- 검색창 -->
      <div class="relative mt-4">
        <img
          src="../assets/icon/search.svg"
          alt="검색"
          class="absolute left-3 top-3 w-5 h-5"
        />
        <input
          v-model="searchQuery"
          placeholder="학교명을 입력하세요"
          class="w-full px-10 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all shadow-sm"
        />
      </div>

      <p class="text-red-500 text-sm mt-2">
        2025년 기준 재학 중인 학교 이름을 입력해 주세요
      </p>

      <!-- 검색 결과 -->
      <h2 class="text-lg font-semibold text-gray-800 mt-6 flex items-center">
        📌 검색 결과
      </h2>
      <p v-if="filteredSchools.length === 0" class="text-gray-500 mt-2">
        검색 결과가 없습니다.
      </p>
      <ul v-else class="mt-4 space-y-2">
        <li
          v-for="school in filteredSchools"
          :key="school.schoolId"
          @click="selectSchool(school)"
          class="p-3 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-200 transition flex justify-between items-center"
        >
          <div class="flex flex-col">
            <span class="font-medium text-gray-900">{{ school.name }}</span>
            <span class="text-sm text-gray-500">{{ school.cityName }}</span>
          </div>
        </li>
      </ul>

      <!-- 대기 중인 학교 -->
      <h2 class="text-lg font-semibold text-gray-800 mt-6 flex items-center">
        📌 현재 대기 중인 학교
      </h2>
      <p v-if="waitingList.length === 0" class="text-gray-500 mt-2">
        대기 중인 학교가 없습니다.
      </p>
      <ul v-else class="mt-4 space-y-2">
        <li
          v-for="school in waitingList"
          :key="school.schoolId"
          class="p-3 bg-white shadow-md rounded-lg flex justify-between items-center"
          :class="school.waitingCount > 50 ? 'border-2 border-pink-500' : ''"
        >
          <span class="font-medium text-gray-900">{{ school.name }}</span>
          <span class="text-sm text-gray-500"
            >대기자: {{ school.waitingCount }}명</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import api from "../api/axios.js";

export default {
  setup() {
    const store = useStore();
    const searchQuery = ref("");

    const filteredSchools = computed(() =>
      store.state.schoolList.filter((school) =>
        school.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    onMounted(() => {
      store.dispatch("fetchSchools");
      store.dispatch("fetchWaitingList");
    });

    return {
      searchQuery,
      filteredSchools,
      waitingList: store.state.waitingList,
    };
  },
};
</script>
