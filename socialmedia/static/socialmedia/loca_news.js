function loadPosts() {
    let request = new XMLHttpRequest()
    request.onreadystatechange = function() {
        if (request.readyState != 4) return
        updatePage(request)
    }
    console.log("before get global!")
    request.open("GET", "https://newsapi.org/v2/top-headlines", true)
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("X-CSRF-Token", getCSRFToken());

    request.send("page=global&post_id=" + id + "&comment_text=" + itemTextValue + "&csrfmiddlewaretoken="+getCSRFToken())
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(loadPosts)
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function updatePage(xhr) {
    if (xhr.status == 200) {
        let response = JSON.parse(xhr.responseText)
        updateList(response)
        return
    }

    if (xhr.status == 0) {
        displayError('Cannot connect to server')
        return
    }

    if (!xhr.getResponseHeader('content-type') == 'application/json') {
        displayError("Received status=" + xhr.status)
        return
    }

    console.log("responseText")
    console.log(xhr.responseText)

    let response = JSON.parse(xhr.responseText)
    if (response.hasOwnProperty('error')) {
        displayError(response.error)
        return
    }

    displayError(response)
}

function displayError(message) {
    let errorElement = document.getElementById("error")
    errorElement.innerHTML = message
}

var profileURL = function(id) {
    return "{% url 'other_profile' 0 %}".replace("0", id)
}

function updateList(items) {
    let list = document.getElementById("my-posts-go-here")
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild)
    }

    for (let i=0; i<items.length; i++){
        let item = items[i]['post']

        let post = document.createElement("li")
        content = '<div id="id_post_div_' + item.id + '" style="font-size:18px;">'
        content += '<a href="' + profileURL(item.user_id) + '" id="id_post_profile_' + item.id + '">Post by ' + item.fname + ' ' + item.lname + '</a>'
        content += '<span id="id_post_text_' + item.id + '">' + item.text + '</span>'
        content += '<span id="id_post_date_time_' + item.id + '" style="color:red;">' + item.time + '</span>'

        let comments = items[i]['comments']

        for (let j=0; j<comments.length; j++){
            let comment = comments[j]
            content += '<div id="id_comment_div_' + comment.id + ' style="margin:50px 50px 50px 50px;padding:50px 50px 50px 50px;">'
            content += '<a href="/other_profile" id="id_comment_profile_' + comment.id + '">' + comment.fname + ' ' + comment.lname + '</a>'
            content += '<span id="id_comment_text_' + comment.id + '">' + comment.text + '</span>'
            content += '<span id="id_comment_date_time_' + comment.id + '" style="color:red;">' + comment.time + '</span>'
            content += '</div>'
        }
    

        content += '<input type="text" name="new_comment" id="id_comment_input_text_' + item.id + '">'
        content += '<button onclick="addComment(' + item.id + ')">Add Comment</button>'
        content += '</div>'
        
        post.innerHTML = content
        list.appendChild(post)
    }
}

function addComment(id) {
    let itemTextElement = document.getElementById("id_comment_input_text_" + id)
    let itemTextValue = itemTextElement.value 

    itemTextElement.value = ''
    
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return
        updatePage(xhr)
    }

    xhr.open("POST", "/socialnetwork/add-comment", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-CSRF-Token", getCSRFToken());
    
    xhr.send("page=global&post_id=" + id + "&comment_text=" + itemTextValue + "&csrfmiddlewaretoken="+getCSRFToken())
}