import { defineStore } from "pinia";
import api from "../api/axios";
import { ref, onMounted } from "vue";

export const useSchoolStore = defineStore("school", () => {
  const waitingList = ref([]);
  const waitingCounts = ref(
    JSON.parse(localStorage.getItem("waitingCounts")) || {}
  );

  async function fetchWaitingList() {
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL;
      if (!serverUrl) {
        console.error(".env 파일 확인");
        return;
      }

      const requestUrl = `${serverUrl}/schools/waiting`;

      const response = await api.get(requestUrl, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response || !response.data) {
        console.error("서버에서 데이터를 받아오지 못했습니다.");
        return;
      }

      if (typeof response.data !== "object") {
        console.error("서버에서 JSON이 아닌 데이터를 반환했습니다:", response.data);
        return;
      }

      const filteredList = response.data.filter(
        (school) => school.waitingCount > 0
      );

      const maxWaitingCount = Math.max(...filteredList.map(s => s.waitingCount), 0);

      waitingList.value = filteredList.map(school => ({
        ...school,
        isTopSchool: school.waitingCount === maxWaitingCount
      }));

      console.log("대기열 데이터 로드 완료:", waitingList.value);
    } catch (error) {
      console.error("대기열 데이터 불러오기 실패:", error);
    }
  }

  function getSchoolIdByName(schoolName) {
    const school = waitingList.value.find((s) => s.name === schoolName);
    return school ? school.schoolId : 0;
  }

  async function sendWaitingRequests() {

    for (const [schoolName, count] of Object.entries(waitingCounts.value)) {
      const schoolId = getSchoolIdByName(schoolName);

      if (schoolId === 0 || count === 0) {
        console.warn(`⚠️ 요청 무시됨: schoolId=${schoolId}, waitCount=${count}, 학교명=${schoolName}`);
        continue;
      }

      try {
        await api.post(`${import.meta.env.VITE_SERVER_URL}/schools/waiting`, {
          schoolId,
          waitCount: count,
        });

        delete waitingCounts.value[schoolName];
        localStorage.setItem("waitingCounts", JSON.stringify(waitingCounts.value));
      } catch (error) {
        console.error(`서버 오류: ${error.message}`);
      }
    }
  }

  if (typeof window !== "undefined") {
    setInterval(sendWaitingRequests, 5000);
  }

  onMounted(fetchWaitingList);

  return {
    waitingList,
    waitingCounts,
    fetchWaitingList,
    sendWaitingRequests,
    getSchoolIdByName,
  };
});
