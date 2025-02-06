<template>
  <div class="p-4">
    <div class="relative">
      <img src="../assets/icon/search.svg" alt="검색" class="absolute left-3 w-5 h-5 top-1/2 transform -translate-y-1/2">
      <input v-model="searchQuery" placeholder="학교명을 입력하세요"
        class="w-full px-10 py-3 rounded-lg bg-white shadow-md border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none" />
    </div>

    <p class="text-red-500 text-sm mt-2">2025년 기준 재학 중인 학교 이름을 입력해 주세요</p>

    <h2 class="mt-6 text-lg font-semibold text-gray-800">📌 검색 결과</h2>
    <p v-if="filteredSchools.length === 0" class="text-gray-500 mt-2">검색 결과가 없습니다.</p>

    <ul class="mt-4 space-y-3">
      <li v-for="school in filteredSchools" :key="school.schoolId" @click="selectSchool(school)"
        class="p-3 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-200 transition flex justify-between">
        <span class="font-medium text-gray-900">{{ school.name }}</span>
        <span class="text-sm text-gray-500">{{ school.cityName }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  setup(_, { emit }) {
    const store = useStore();
    const searchQuery = ref("");

    const filteredSchools = computed(() =>
      store.state.schoolList.filter(school =>
        school.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    function selectSchool(school) {
      emit("schoolSelected", school);
    }

    onMounted(() => {
      store.dispatch("fetchSchools");
    });

    return { searchQuery, filteredSchools, selectSchool };
  }
};
</script>
