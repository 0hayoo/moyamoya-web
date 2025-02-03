$(document).ready(function () {
    let schoolList = $("#school-list");
    let skeletonLoader = $("#skeleton-loader");
    let API_BASE_URL;

    $.getJSON('./config/config.json', function(config) {
        API_BASE_URL = config.SERVER_URL;
        updateSchoolList();
    });

    function animateCount(element, start, end, duration) {
        let range = end - start;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            let progress = Math.min((timestamp - startTime) / duration, 1);
            let currentValue = Math.floor(start + progress * range);
            element.textContent = currentValue.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function updateSchoolList() {
        $.ajax({
            url: `${API_BASE_URL}/schools/waiting`,
            method: 'GET',
            dataType: 'json',
            success: function(schools) {
                setTimeout(() => {
                    skeletonLoader.fadeOut(200, function () {
                        $(this).remove();
                    });

                    schoolList.empty();

                    schools = schools.filter(school => school.waitingCount > 0);

                    const maxWaiting = Math.max(...schools.map(school => school.waitingCount));

                    schools.forEach((school, index) => {
                        let schoolItem = $(`
                            <div class="flex justify-between items-center ${school.waitingCount === maxWaiting ? 'bg-white border-2 border-pink-500' : ''} p-3 sm:p-4 rounded-lg transform transition-all duration-500 opacity-0 translate-y-10" ${school.waitingCount !== maxWaiting ? 'style="background-color: #EEE;"' : ''}>
                                <div class="flex items-center">
                                    <span class="text-2xl sm:text-3xl mr-2 sm:mr-3">🏫</span>
                                    <span class="text-gray-800 font-medium text-sm sm:text-md md:text-lg">${school.name}</span>
                                </div>
                                <span class="text-pink-500 font-bold text-md sm:text-lg md:text-xl school-count">0</span>
                            </div>
                        `);

                        schoolList.append(schoolItem);

                        let countElement = schoolItem.find(".school-count")[0];

                        setTimeout(() => {
                            schoolItem.removeClass("opacity-0 translate-y-10").addClass("opacity-100 translate-y-0");
                            animateCount(countElement, 0, school.waitingCount, 1000);
                        }, index * 200);
                    });

                    schoolList.removeClass("opacity-0").addClass("opacity-100");
                }, 500);
            },
            error: function(xhr, status, error) {
                console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
                skeletonLoader.html('<div class="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>');
            }
        });
    }
});