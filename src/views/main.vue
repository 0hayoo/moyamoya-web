<template>
  <div class="min-h-screen bg-white md:bg-gray-100 flex justify-center items-center text-center p-4 font-pretendard">
    <div class="w-full max-w-md bg-white rounded-lg p-6 relative overflow-hidden min-w-[320px] max-w-[425px]">
      <img 
        src="../assets/icons/Logo.svg" 
        alt="모야모야 아이콘"
        class="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-4 animate-float"
      >
      
      <div class="w-4/5 md:w-3/5 mx-auto relative font-bold text-sm md:text-lg p-4 rounded-xl mt-4 bg-[#fdd7e4] text-[#ff427f]">
        모야모야를 <br> 더 빨리 써보고 싶다면~
        <div 
          class="absolute w-0 h-0 top-[-12px] right-4 border-l-0 border-r-[20px] border-r-transparent border-b-[22.5px]"
          style="border-bottom-color: #fdd7e4; border-radius: 5px;"
        ></div>
      </div>
      
      <div class="mt-6 flex justify-center">
        <img 
          src="../assets/images/fastWait.svg" 
          alt="빨리 기다리기" 
          class="w-[90%] h-auto rounded-lg"
        >
      </div>

      <button
        @click="goToSearch"
        class="w-full mt-6 bg-[#ff427f] text-white py-3 px-6 rounded-full font-bold transition-transform hover:bg-[#e6396a] mx-auto"
      >
        빨리 기다리기!
      </button>

      <h2 class="mt-8 text-base md:text-lg lg:text-xl font-bold text-[#ff427f]">
        제일 빨리 기다리고 있는 학교는?
      </h2>

      <div class="relative w-full mt-4 min-h-[250px]">
        <transition name="fade-out" mode="out-in">
          <SkeletonLoader v-if="isLoading" class="absolute w-full" key="skeleton" />
          <div v-else key="school-list" class="flex flex-col gap-4">
            <div 
              v-for="(school, index) in visibleSchools" 
              :key="school.schoolId"
              class="p-4 bg-white shadow-md rounded-lg flex justify-between items-center transform transition-all duration-300 opacity-0 translate-y-3"
              :class="{
                'border-2 border-[#ff427f]': school.isTopSchool,
                'opacity-100 translate-y-0': showItems[index]
              }"
            >
              <div class="flex items-center">
                <span class="text-2xl sm:text-3xl mr-2 sm:mr-3">🏫</span>
                <div class="text-left">
                  <span class="font-medium text-gray-900 block">{{ school.name }}</span>
                  <span class="text-sm text-gray-500">{{ formattedCount(school.count) }}명</span>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useSchoolStore } from '../store/schoolStore';
import SkeletonLoader from '../components/Skeleton.vue';

const router = useRouter();
const schoolStore = useSchoolStore();
const isLoading = computed(() => schoolStore.waitingList.length === 0);
const visibleSchools = ref([]);
const showItems = ref([]);

const goToSearch = () => router.push('/search');

const animateCount = (index, start, end, duration) => {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    let progress = Math.min((timestamp - startTime) / duration, 1);
    visibleSchools.value[index].count = Math.floor(start + progress * (end - start));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const formattedCount = (num) => num.toLocaleString();

onMounted(async () => {
  await schoolStore.fetchWaitingList();
  let index = 0;
  const interval = setInterval(async () => {
    if (index < schoolStore.waitingList.length) {
      visibleSchools.value.push({ ...schoolStore.waitingList[index], count: 0 });
      await nextTick();
      showItems.value[index] = true;
      animateCount(index, 0, schoolStore.waitingList[index].waitingCount, 800);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 100);
});
</script>

<style scoped>
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-float { animation: float 6s ease-in-out infinite; }

.fade-out-enter-active, .fade-out-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-out-enter-from, .fade-out-leave-to {
  opacity: 0;
}
</style>
