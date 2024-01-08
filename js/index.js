$(document).ready(function() {
    searchSchools();
    $("#search-btn").on("click", function() {
        var keyword = $("#search-input").val();
        searchSchools(keyword);
    });
});
function searchSchools(keyword) {
    $.ajax({
        url: "https://admissionsportal.000webhostapp.com/backend/app/get_schools.php",
        method: "GET",
        data: { keyword: keyword ,action:  "get_schools"},
        dataType: "json",
        credentials: 'include',
        success: function(data) {
            if (data && data.length > 0) {
                displaySchoolData(data);
            } else {
                displayNoDataMessage();
            }
        },
        error: function(xhr) {
            alert("發生錯誤: " + xhr.status + " " + xhr.statusText);
        }
    });
}

function displaySchoolData(schoolData) {
    let schools_block = $("<ul>").attr("id", "schools").addClass("row");
    schoolData.forEach(school => {
        let SchoolName = school['SchoolName']
        let Abbreviation = school['Abbreviation']
        let school_block = `
            <li class="school col">
                <div class="school-bar">
                    <p class="school-name">${SchoolName}</p>
                    <div class="notice-box">
                        <div class="switch">
                            <input class="switch-checkbox" id="${Abbreviation}_notice" type="checkbox" name="switch-checkbox">
                            <label class="switch-label" for="${Abbreviation}_notice">
                                <span class="switch-txt" turnOn="開" turnOff="關"></span>
                                <span class="switch-Round-btn"></span>
                            </label>
                        </div>
                        <img class="bell" src="img/bell.png" alt="">
                    </div>
                </div>
                <img class="school-logo" src="img/school_logo/${Abbreviation}.png" alt="${Abbreviation}">
                <a class="school-btn download" href="">
                    <div>簡章下載</div>
                </a>
                <a class="school-btn apply" href="./schools/${Abbreviation}.html">
                    <div>立即報名</div>
                </a>
            </li>
        `
        schools_block.append(school_block);
    });
    $("#schools-group").html(schools_block);
}

function displayNoDataMessage() {
    $("#schools-group").html("未找到學校數據");
}