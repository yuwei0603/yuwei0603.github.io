$(document).ready(function () {
    get_data("basic", null);
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
});
function alt_basic_data(formData, Abbreviation) { 
    showLoader();
    formData.append("action", "alt_basic");
    formData.append("Abbreviation", Abbreviation);

    $.ajax({
        type: "POST",
        url: "https://admissionsportal.000webhostapp.com/backend/app/user_data.php",
        data: formData,
        processData: false, // 必須為 false
        contentType: false, // 必須為 false
        dataType: "json",
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
    get_data("basic", null);
    $(".form-btn > input, #image_data_input").css("display", "none");
    $("#basic-data .value > *, #image_data_input").attr("disabled", true);
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