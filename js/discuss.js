$(document).ready(function () {
    let schools_list = get_schools_info();
    add_options(schools_list);
    filter_posts();

    $("#write").click(function () {
        $(this).hide();
        $("#w-block").css("display", "flex");
    });
    
    $(".dark-bg").click(function() {
        $("#write").show();
        $(".front-block").css("display", "none");
    });

    $("#w-form").submit(function(event) {
        event.preventDefault(); 
        showLoader();
        var formData = $(this).serialize();

        $.ajax({
            type: "POST",
            url: "https://admissionsportal.000webhostapp.com/backend/app/discuss_room.php",
            data: formData,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(response) {
                hideLoader();
                $(".front-block").css("display", "none");
                filter_posts();
                console.log(response);
            },
            error: function() {
                console.log("提交表單時發生錯誤");
                hideLoader();
            }
        });

    });


    $("#comment-btn").click(function() {
        let content = $("#comment").val();
        $("#comment").val("");
        let postID = $("#inf").attr("data-post-id");
        $.ajax({
            type: "POST",
            url: "https://admissionsportal.000webhostapp.com/backend/app/discuss_room.php",
            data: {action:"add_comment", postID: postID, content: content},
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(response) {
                hideLoader();
                getPost(postID);
                console.log(response);
            },
            error: function() {
                console.log("提交表單時發生錯誤");
                hideLoader();
            }
        });
    });

    $('#filter-post select').on('change', function() {
        filter_posts();
      });
});

function get_schools_info() {//同步請求
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://admissionsportal.000webhostapp.com/backend/app/get_schools_list.php?action=get_schools_s', false);
    xhr.withCredentials = true;
    xhr.send();

    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        throw new Error('Request failed with status: ' + xhr.status);
    }
}

function add_options(schools_list) {
    var options = ``;
    schools_list.forEach(school => {
        options += `<option value="${school.SchoolID}">${school.SchoolName}</option>`;
    });
    $('#f-school,#w-school').append(options);
}

function filter_posts() {
    var schoolID = $('#f-school').val();
    var cat = $('#f-cat').val();
    var order = $('#f-order').val();
    $.ajax({
        type: "POST",
        url: "https://admissionsportal.000webhostapp.com/backend/app/discuss_room.php",
        data: {action: 'filter_posts', schoolID:schoolID, cat: cat, order:order},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(response) {
            listPosts(response);
            hideLoader();
        },
        error: function() {
            console.log("提交表單時發生錯誤");
            hideLoader();
        }
    });
}

function listPosts(response) {
    var posts_html = ``;

    response.forEach(post => {
        posts_html += `
            <li class="post" data-post-id="${post.PostID}">
                <div>
                    <p class="cat">[${post.Cat}]</p>
                    <p class="article">${post.Title}</p>
                </div>
            </li>
            <hr>
        `;
       
    });

    posts_html +=`
        <script>
            $("li.post").click(function () {
                var postID = $(this).attr('data-post-id');
                getPost(postID);
            });
        </script>
    `;
    $("#posts").html(posts_html);
}

function getPost(postID) {
    $.ajax({
        type: "POST",
        url: "https://admissionsportal.000webhostapp.com/backend/app/discuss_room.php",
        data: {action: 'get_post', postID:postID},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(response) {
            displayPost(response);
            hideLoader();
        },
        error: function() {
            console.log("提交表單時發生錯誤");
            hideLoader();
        }
    });
}

function displayPost(response) {
    $("#write").hide();
    $("#p-block").css("display", "flex");

    let post = response.post[0];
    $("#inf").attr("data-post-id", post.PostID);
    $("#p-cat").text(post.Cat);
    $("#p-title").text(post.Title);
    $("#p-school").text(post.SchoolName);
    $("#p-name").text(post.username);
    $("#p-time").text(post.DateTime);
    $("#p-article").text(post.Content);


    let comments_html = ``;
    response.comments.forEach(comment => {
        comments_html += `
            <li class="p-comment">
                <div>
                    <p><span class="p-c-name">${comment.username}</span> ‧ <span class="p-c-time">${comment.DateTime}</span></p>
                    <p>${comment.Content}</p>
                </div>
            </li>
            <hr>
        `;
    });

    $("#p-comments").html(comments_html);
    $("#p-block").css("display", "flex");
}