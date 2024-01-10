$(document).ready(function () {
    get_data("basic");
    get_enroll();
    $(".value > *, #image_data_input").attr("disabled", true);

    $("#edit-form1, #edit-form2").click(function (e) { 
        e.preventDefault();
        start_edit();
    });

    $("#submit").click(function (e) { 
        e.preventDefault();
        let formData = new FormData($("#basic-data")[0]);
        alt_basic_data(formData, null);
    });

    $("#cancel").click(function (e) { 
        e.preventDefault();
        finish_edit();
    });


    $('#image_data_input').change(function () {
        var file = this.files[0];
        var reader = new FileReader();
    
        reader.onload = function (e) {
            $('#image_data').attr('src', e.target.result);
        };
    
        reader.readAsDataURL(file);
    });

    $(".filter-option").click(function () {
        var targetClass = $(this).data("target");
        $(".filter-select").removeClass('filter-select');
        $(this).addClass("filter-select");
        $(".area1,.area2").hide();
        $(targetClass).show();
    });
});
function alt_basic_data(formData, Abbreviation) { 
    showLoader();
    formData.append("action", "alt_basic");
    formData.append("Abbreviation", Abbreviation);

    $.ajax({
        type: "POST",
        url: "https://admissionsportal.000webhostapp.com/backend/app/alt_personal_data.php",
        data: formData,
        processData: false, // 必須為 false
        contentType: false, // 必須為 false
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (response) {
            console.log(response);
            finish_edit();
            hideLoader();
        },
        error: function(xhr) {
            alert("發生錯誤: " + xhr.status + " " + xhr.statusText);
            hideLoader();
        }
    });
}

function start_edit() {
    $(".form-btn > input, #image_data_input").css("display", "block");
    $("#basic-data .value > *, #image_data_input").attr("disabled", false);
    $("#basic-data .value > *").addClass("input-edit");
}

function finish_edit() {
    $("#image_data_input").val("");
    get_data("basic");
    $(".form-btn > input, #image_data_input").css("display", "none");
    $("#basic-data .value > *, #image_data_input").attr("disabled", true);
    $(".input-edit").removeClass("input-edit");    
}

function get_data(datatype) {  
    showLoader();
    $.ajax({
        url: "https://admissionsportal.000webhostapp.com/backend/app/get_profile_info.php",
        type: "GET",
        data: {action:"get_" + datatype},
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            console.log(!data.response);
            if (!data.response) {
                displaylData(data);
                hideLoader();
            } else {
                displayNoDataMessage();
                hideLoader();
            }
        },
        error: function(xhr) {
            alert("發生錯誤: " + xhr.status + " " + xhr.statusText);
            hideLoader();
        }
    });
}
function displaylData(data) {
    $.each(data, function (key, value) { 
        obj_id = "#" + key;
        if (key == "image_data") {
            $(obj_id).attr("src", 'data:image/jpeg;base64,' + value);
        }else {
            $(obj_id).val(value);
        }

    });
    return;
}

function displayNoDataMessage() {
    return;
}

function get_enroll() {  
    showLoader();
    $.ajax({
        url: "https://admissionsportal.000webhostapp.com/backend/app/get_profile_info.php",
        type: "GET",
        data: {action:"get_enroll"},
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            console.log(!data.response);
            if (!data.response) {
                displaylEnroll(data);
                hideLoader();
            } else {
                displayNoEnrollMessage();
                hideLoader();
            }
        },
        error: function(xhr) {
            alert("發生錯誤: " + xhr.status + " " + xhr.statusText);
            hideLoader();
        }
    });
}

function displaylEnroll(data) {
    let schools_block = $("<ul>").attr("id", "regi-status").addClass("regi-status");
    data.forEach(school => {
        let { SchoolName, ApplicationStatus } = school;
        let school_block = `
            <li class="regi-list">
                <p class="school">${SchoolName}</p>
                <p class="status">${ApplicationStatus}</p>
            </li>
        `
        schools_block.append(school_block);
    });
    $("#enroll").html(schools_block);
    return;
}

function displayNoEnrollMessage() {
    return;
}