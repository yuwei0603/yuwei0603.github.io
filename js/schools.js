$(document).ready(function() {
    let currentURL = window.location.href;
    let Abbreviation = currentURL.substring(currentURL.lastIndexOf('/') + 1).split('.')[0];
    let schoolname = get_school_CNname(Abbreviation);

    $("#schoolname").text(schoolname);
    get_data("basic", Abbreviation);
    get_data("added", Abbreviation);

    
    $(".value > *").attr("disabled", true);

    $("#edit-form").click(function (e) { 
        e.preventDefault();
        start_edit();
    });

    $("#submit").click(function (e) { 
        e.preventDefault();
        let formDataArray = $("#added-data").serializeArray();
        alt_added_data(formDataArray, Abbreviation);
    });

    $("#cancel").click(function (e) { 
        e.preventDefault();
        finish_edit(Abbreviation);
    });
});


function alt_added_data(formDataArray, Abbreviation) { 
    showLoader();
    $.ajax({
        type: "POST",
        url: "https://admissionsportal.000webhostapp.com/backend/app/user_data.php",
        data: {action: "alt_added", data: formDataArray, Abbreviation: Abbreviation},
        dataType: "json",
        success: function (response) {
            console.log(response);
            finish_edit(Abbreviation);
            hideLoader();
        },
        error: function(xhr) {
            alert("發生錯誤: " + xhr.status + " " + xhr.statusText);
            hideLoader();
        }
    });
}


function start_edit() {
    $(".form-btn > input ").css("display", "block");
    $("#added-data .value > *").attr("disabled", false);
    $("#added-data .value > *").addClass("input-edit");
}

function finish_edit(Abbreviation) {
    get_data("added", Abbreviation);
    $(".form-btn > input ").css("display", "none");
    $("#added-data .value > *").attr("disabled", true);
    $(".input-edit").removeClass("input-edit");    
}

function get_data(datatype, Abbreviation) {  
    showLoader();
    $.ajax({
        url: "https://admissionsportal.000webhostapp.com/backend/app/user_data.php",
        type: "POST",
        data: {action:"get_" + datatype, Abbreviation:Abbreviation},
        dataType: "json",
        credentials: 'include',
        success: function(data) {
            console.log(!data.response);
            if (!data.response) {
                displaylData(data);
                console.log(data);
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
        $(obj_id).val(value);
    });
    return;
}

function displayNoDataMessage() {
    return;
}

function get_school_CNname(Abbreviation) {    
    let SchoolName = null;    
    $.ajax({
        url: "https://admissionsportal.000webhostapp.com/backend/app/get_schools.php",
        type: "GET",
        data: {action:"get_school_CNname", Abbreviation:Abbreviation},
        dataType: "json",
        credentials: 'include',
        async : false,
        success: function(data) {
            if (!data.response) {
                SchoolName = data.SchoolName;
            } else {
                console.log(data);
            }
        },
        error: function(xhr) {
            alert("發生錯誤: " + xhr.status + " " + xhr.statusText);
        }
    });
    return SchoolName;
}