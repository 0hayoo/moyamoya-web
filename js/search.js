$(document).ready(() => {
  loadConfig(() => { 
      const dummyData = [
          { name: "서울과학고등학교", location: "서울특별시", students: 150 },
          { name: "한성과학고등학교", location: "서울특별시", students: 130 },
          { name: "대구과학고등학교", location: "대구광역시", students: 120 },
          { name: "경남과학고등학교", location: "경상남도 창원", students: 100 },
          { name: "대전과학고등학교", location: "대전광역시", students: 110 },
          { name: "광주과학고등학교", location: "광주광역시", students: 90 },
          { name: "세종과학예술영재학교", location: "세종특별자치시", students: 85 },
          { name: "부산과학고등학교", location: "부산광역시", students: 95 },
          { name: "전북과학고등학교", location: "전라북도 전주", students: 80 },
          { name: "강원과학고등학교", location: "강원도 춘천", students: 75 }
      ];

      let debounceTimer; // 타이머

      function fetchSearchResults(query) {
          $("#search-title").text(query ? `‘${query}’ 검색 결과` : "검색 결과");

          if (query.length === 0) {
              $("#search-results").empty();
              return;
          }

          if (SERVER_URL) {
              $.ajax({
                  url: `${SERVER_URL}/schools`, 
                  type: "GET",
                  data: { q: query },
                  dataType: "json",
                  success: function (response) {
                      renderSearchResults(response);
                  },
                  error: function () {
                      $("#search-results").html(`<p class="text-gray-500">검색 결과를 불러오지 못했습니다.</p>`);
                  }
              });
          } else {
              const filteredResults = dummyData.filter(school =>
                  school.name.includes(query)
              );
              renderSearchResults(filteredResults);
          }
      }

      function renderSearchResults(results) {
          const searchResults = $("#search-results");
          searchResults.empty();

          if (results.length === 0) {
              searchResults.append(`<p class="text-gray-500">검색 결과가 없습니다.</p>`);
              return;
          }

          results.forEach(school => {
              searchResults.append(`
                  <div class="p-4 bg-gray-100 rounded-lg flex flex-col cursor-pointer hover:bg-gray-200 transition select-school" data-school="${school.name}">
                      <div class="flex justify-between items-center">
                          <div>
                              <p class="font-medium text-gray-900">${school.name}</p>
                              <p class="text-sm text-gray-600">${school.location}</p>
                          </div>
                          <p class="text-sm text-gray-500">${school.students}명 사용 중</p>
                      </div>
                  </div>
              `);
          });

          $(".select-school").click(function () {
              const selectedSchool = $(this).data("school");
              localStorage.setItem("selectedSchool", selectedSchool);
              window.location.href = "index.html";
          });
      }

      // 사용자가 입력을 멈춘 후 .3초 뒤에 실행
      $("#search-input").on("input", function () {
          clearTimeout(debounceTimer);
          const query = $(this).val();
          debounceTimer = setTimeout(() => {
              fetchSearchResults(query);
          }, 300);
      });

      $("#back-to-home").click(function () {
          window.location.href = "index.html";
      });
  });
});
