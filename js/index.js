$(document).ready(function() {
    searchSchools();
    $("#search-btn").on("click", function() {
        searchSchools();
    });
    $("#reset").on("click", function() {
        $('.filter-option').removeClass('filter-select');
        $(this).addClass('filter-select');
        searchSchools();
    });
});

var activeFilters = {
    s: null,
    t: null
};

function applyFilter(type, value) {
    if (activeFilters[type] === value) {
        activeFilters[type] = null;
    } else {
        activeFilters[type] = value;
    }
    $('.filter-option').removeClass('filter-select');

    if (activeFilters.s) {
        $(`.filter-option.s[data-value="${activeFilters.s}"]`).addClass('filter-select');
    }
    if (activeFilters.t) {
        $(`.filter-option.t[data-value="${activeFilters.t}"]`).addClass('filter-select');
    }

    searchSchools(activeFilters.s, activeFilters.t);
}
function searchSchools(s_type=null, t_type=null) {
    var keyword = $("#search-input").val();
    $.ajax({
        url: "https://admissionsportal.000webhostapp.com/backend/app/get_schools_list.php",
        method: "GET",
        data: { keyword: keyword ,action:  "get_schools",s_type:s_type,t_type:t_type},
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
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
        let Notify = Number(school['Notify'])
        let school_block = `
            <li class="school col">
                <div class="school-logo">
                    <img src="img/school_logo/${Abbreviation}.png" alt="${Abbreviation}">
                </div>
                <div class="school-rbox">
                    <div class="school-bar">
                        <p class="school-name">${SchoolName}</p>
                        <div class="notice-box">
                            <div class="switch">
                                <input class="switch-checkbox" id="${Abbreviation}_notice" type="checkbox" name="switch-checkbox" ${Notify ? 'checked' : ''}>
                                <label class="switch-label" for="${Abbreviation}_notice">
                                    <span class="switch-txt" turnOn="開" turnOff="關"></span>
                                    <span class="switch-Round-btn"></span>
                                </label>
                            </div>
                            <img class="bell" src="img/bell.png" alt="">
                        </div>
                    </div>
                    <div class="school-btn-bar">
                        <a class="school-btn download" href="">
                            <div>簡章下載</div>
                        </a>
                        <div class="v-bar"></div>
                        <a class="school-btn apply" href="./schools.html?school=${Abbreviation}">
                            <div>立即報名</div>
                        </a>
                    </div>
                </div>

            </li>
        `
        schools_block.append(school_block);
    });
    $("#schools-group").html(schools_block);
}

function displayNoDataMessage() {
    $("#schools-group").html("未找到學校數據");
}