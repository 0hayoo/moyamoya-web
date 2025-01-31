$(document).ready(function () {
    let schoolList = $("#school-list");

    const schoolData = [
        { "name": "노영중학교", "students": 13000 },
        { "name": "대구소프트웨어마이스터고등학교", "students": 200 }
    ];

    function animateCount(element, start, end, duration) {
        let range = end - start;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            let progress = Math.min((timestamp - startTime) / duration, 1);
            element.textContent = Math.floor(start + progress * range);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function updateSchoolList() {
        schoolList.empty();

        schoolData.forEach(school => {
            let schoolItem = $(`
                <div class="flex justify-between items-center bg-white shadow-md p-4 rounded-lg transform transition duration-300 hover:scale-105 border-2 border-transparent hover:border-pink-500">
                    <div class="flex items-center">
                        <span class="text-3xl mr-3">🏫</span>
                        <span class="text-gray-800 font-semibold text-lg">${school.name}</span>
                    </div>
                    <span class="text-pink-500 font-bold text-lg school-count">0</span>
                </div>
            `);
            schoolList.append(schoolItem);

            let countElement = schoolItem.find(".school-count")[0];
            animateCount(countElement, 0, school.students, 1000);
        });

        schoolList.removeClass("opacity-0").addClass("opacity-100");
    }

    setTimeout(updateSchoolList, 1000);
});
