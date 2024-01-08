$(document).ready(function() {

    $(".login-form").submit(function(event) {
        event.preventDefault(); 
        showLoader();
        var formData = $(this).serialize();

        $.ajax({
            type: "POST",
            url: "https://admissionsportal.000webhostapp.com/backend/app/user_login_status.php",
            data: formData,
            success: function(response) {
                switch (response.status) {
                    case 'success':
                        window.location.href = "./index.html";
                        break;
                    case 'passwordError':
                        alert('密碼錯誤請重試！');
                        break;
                    case 'notExist':
                        alert('未發現此帳號，請註冊！');
                        break
                    default:
                        break;
                }
                hideLoader();
                console.log(response);
            },
            error: function() {
                console.log("提交表單時發生錯誤");
                hideLoader();
            }
        });
    });

    $("#r-btn").click(function() {
        $("#register-block").css("display", "flex");
    });
    $("#register-bg").click(function() {
        $("#register-block").css("display", "none");
    });


    $(".register-form").submit(function(event) {
        event.preventDefault(); 
        showLoader();
        var formData = $(this).serialize();

        $.ajax({
            type: "POST",
            url: "https://admissionsportal.000webhostapp.com/backend/app/user_login_status.php",
            data: formData,
            success: function(response) {
                switch (response.status) {
                    case 'repeated':
                        alert('您已經註冊過囉！');
                        break;
                    case 'success':
                        alert('您已經註冊成功，請再次登入！');
                        window.location.href = "./login.html";
                        break;
                    case 'failure':
                        alert('發生錯誤，請您稍後再試！');
                        break
                    default:
                        break;
                }
                hideLoader();
                console.log(response);
            },
            error: function() {
                console.log("提交表單時發生錯誤");
                hideLoader();
            }
        });
    });
});