let currentURL = window.location.href;
let root_url = ""
if (currentURL.indexOf("/schools/") > -1) {
    root_url = "../"
}

$(document).ready(function() {
    loadPart();
    loadLoaderCSS();
    check_login();
});

function loadPart() {
    $(".header").load(root_url + "part/header.html");
    $(".footer").load(root_url + "part/footer.html");
}

function loadLoaderCSS() {
    let linkElement = $('<link>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: root_url + 'css/loader.css'
    });

    $('head').append(linkElement);
}

function showLoader() {
    var blockHTML =`
    <div id="loader-bg" class="loader-bg">
        <div class="loader">Loading...</div>
    </div>
    `
    $("body").append(blockHTML);
}
function hideLoader() {
    $("#loader-bg").remove();
}

function check_login() {
    $.ajax({
        type: "POST",
        url: "https://admissionsportal.000webhostapp.com/backend/app/user_login_status.php",
        data: {action : 'check'},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(response) {
            if (response.status) {
                if (currentURL.indexOf("login.html") > -1){
                    window.location.href = root_url + "index.html";
                } else {
                    $("#current_user,.current_user").text(response.username);
                }
                console.log(response.username);
            }else {
                if (currentURL.indexOf("login.html") === -1){
                    window.location.href = root_url + "login.html";
                }                
            }
            console.log(response);
        },
        error: function() {
            console.log("發生錯誤");
        }
    });
}

function log_out() {
    $.ajax({
        type: "POST",
        url: "https://admissionsportal.000webhostapp.com/backend/app/user_login_status.php",
        data: {action : 'log_out'},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(response) {
            if (response.status == "success") {
                window.location.href = root_url + "login.html";
            }
            console.log(response);
        },
        error: function() {
            console.log("發生錯誤");
        }
    });
}