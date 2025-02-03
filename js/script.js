$(document).ready(function () {
    let schoolList = $("#school-list");
    let skeletonLoader = $("#skeleton-loader");
  
    const schoolData = [
        { name: "노영중학교", students: 13000 },
        { name: "대구소프트웨어마이스터고등학교", students: 200 },
    ];
  
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
        setTimeout(() => {
            skeletonLoader.fadeOut(200, function () { 
                $(this).remove();
            });
  
            schoolList.empty();
  
            const maxStudents = Math.max(...schoolData.map(school => school.students));
  
            schoolData.forEach((school, index) => {
                let schoolItem = $(`
                    <div class="flex justify-between items-center ${school.students === maxStudents ? 'bg-white border-2 border-pink-500' : ''} p-3 sm:p-4 rounded-lg transform transition-all duration-500 opacity-0 translate-y-10" ${school.students !== maxStudents ? 'style="background-color: #EEE;"' : ''}>
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
                    animateCount(countElement, 0, school.students, 1000);
                }, index * 200);
            });
  
            schoolList.removeClass("opacity-0").addClass("opacity-100");
        });
    }
  
    updateSchoolList();
});