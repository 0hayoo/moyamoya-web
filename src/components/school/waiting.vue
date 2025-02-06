<template>
    <div class="p-4">
        <h2 class="text-lg font-semibold text-gray-800">📌 현재 대기 중인 학교</h2>

        <p v-if="waitingList.length === 0" class="text-gray-500 mt-2">
            대기 중인 학교가 없습니다.
        </p>

        <ul class="mt-4 space-y-3">
            <li v-for="school in waitingList" :key="school.schoolId"
                class="p-3 bg-white shadow-md rounded-lg flex justify-between items-center border"
                :class="school.waitingCount === maxWaiting ? 'border-pink-500' : 'border-gray-300'">
                <span class="font-medium text-gray-900">{{ school.name }}</span>
                <span class="text-sm text-gray-500">대기자: {{ school.waitingCount }}명</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
    setup() {
        const store = useStore();
        const waitingList = computed(() => store.state.waitingList);
        const maxWaiting = computed(() => Math.max(...waitingList.value.map(s => s.waitingCount), 0));

        onMounted(() => {
            store.dispatch("fetchWaitingList");
        });

        return { waitingList, maxWaiting };
    }
};
</script>