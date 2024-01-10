function alt_added_data() { 
    let valuesString = "";
    $("#added-data .value input").each(function(index) {
        let inputValue = $(this).val(); 
        valuesString += (index > 0 ? "&" : "") + inputValue;
    });
    let schoolID = $("#inf").attr("data-school-id");
    showLoader();
    $.ajax({
        type: "POST",
        url: "https://admissionsportal.000webhostapp.com/backend/app/alt_personal_data.php",
        data: {action: "alt_added", data: valuesString, schoolID: schoolID},
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
    $(".form-btn > input ").css("display", "block");
    $("#added-data .value > *").attr("disabled", false);
    $("#added-data .value > *").addClass("input-edit");
}

function finish_edit() {
    get_data();
    $(".form-btn > input ").css("display", "none");
    $("#added-data .value > *").attr("disabled", true);
    $(".input-edit").removeClass("input-edit");    
}

function get_data() {  
    showLoader();
    let schoolID = $("#inf").attr("data-school-id");
    $.ajax({
        url: "https://admissionsportal.000webhostapp.com/backend/app/get_profile_info.php",
        type: "GET",
        data: {action:"get_added", schoolID: schoolID },
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            if (data.response) {
                displaylData(data.response);
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
function displaylData(response) {
    let values_list = response.split("&");
    $("#added-data input").each(function(index) {
        $(this).val(values_list[index]);
    })
    console.log(values_list);
    return;
}

function displayNoDataMessage() {
    return;
}