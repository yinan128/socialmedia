// SIDEBAR
const menuItems = document.querySelectorAll('.menu-item');

// MESSAGES
const messagesNotification = document.querySelector('#messages-notification');
const messages = document.querySelector('.messages');
const message = messages.querySelectorAll('.message');
const messageSearch = document.querySelector('#message-search');

// THEME
const theme = document.querySelector('#theme');
const themeModal = document.querySelector('.customize-theme');
const fontSizes = document.querySelectorAll('.choose-size span');
var root = document.querySelector(':root');
const colorPalette = document.querySelectorAll('.choose-color span');
const Bg1 = document.querySelector('.bg-1');
const Bg2 = document.querySelector('.bg-2');
const Bg3 = document.querySelector('.bg-3');



// ================ SIDEBAR ===============

// remove active class from all menu items
const changeActiveItem = () => {
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
}

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        changeActiveItem();
        item.classList.add('active');
        if(item.id != 'notifications'){
            document.querySelector('.notifications-popup').style.display = 'none';
        } else{
            document.querySelector('.notifications-popup').style.display = 'block';
            document.querySelector('#notifications .notification-count').style.display = 'none';
        }
    })
})


// ================ MESSAGES ===============
// searches chats
const searchMessage = () => {
    const val = messageSearch.value.toLowerCase();
    message.forEach(user => {
        let name = user.querySelector('h5').textContent.toLowerCase();
        if(name.indexOf(val) != -1){
            user.style.display = 'flex';
        } else{
            user.style.display = 'none';
        }
    })
}


// search chat
messageSearch.addEventListener('keyup', searchMessage);

// hightlight messages card when messages menu item is clicked
messagesNotification.addEventListener('click', () => {
    messages.style.boxShadow = '0 0 1rem var(--color-primary)';
    messagesNotification.querySelector('.notification-count').style.display = 'none';
    setTimeout(() => {
        messages.style.boxShadow = 'none';
    }, 2000);
})



// THEME/DISPLAY CUSTOMIZATION

// opens modal
const openThemeModal = () => {
    themeModal.style.display = 'grid';
}

// closes modal
const closeThemeModal = (e) => {
    if(e.target.classList.contains('customize-theme')){
        themeModal.style.display = 'none';
    }
}

// close modal
themeModal.addEventListener('click', closeThemeModal);

theme.addEventListener('click', openThemeModal);




// ======================== FONTS =========================

// remove active class from spans or font size selectors
const removeSizeSelector = () => {
    fontSizes.forEach(size => {
        size.classList.remove('active');
    })
}

fontSizes.forEach(size => {
    size.addEventListener('click', () => {
        removeSizeSelector();
        let fontSize;
        size.classList.toggle('active');

        if(size.classList.contains('font-size-1')){
            fontSize = '10px';
            root.style.setProperty('----sticky-top-left', '5.4rem');
            root.style.setProperty('----sticky-top-right', '5.4rem');
        } else if(size.classList.contains('font-size-2')){
            fontSize = '13px';
            root.style.setProperty('----sticky-top-left', '5.4rem');
            root.style.setProperty('----sticky-top-right', '-7rem');
        } else if(size.classList.contains('font-size-3')){
            fontSize = '16px';
            root.style.setProperty('----sticky-top-left', '-2rem');
            root.style.setProperty('----sticky-top-right', '-17rem');
        } else if(size.classList.contains('font-size-4')){
            fontSize = '19px';
            root.style.setProperty('----sticky-top-left', '-5rem');
            root.style.setProperty('----sticky-top-right', '-25rem');
        } else if(size.classList.contains('font-size-5')){
            fontSize = '22px';
            root.style.setProperty('----sticky-top-left', '-12rem');
            root.style.setProperty('----sticky-top-right', '-35rem');
        }

        // change font size of the root html element
    document.querySelector('html').style.fontSize = fontSize;
    })
    
})



// remove active class from colors
const changeActiveColorClass = () => {
    colorPalette.forEach(colorPicker => {
        colorPicker.classList.remove('active');
    })
}

// change primary colors
colorPalette.forEach(color => {
    color.addEventListener('click', () => {
        let primary;
        // remove active class from colors
        changeActiveColorClass();

        if(color.classList.contains('color-1')){
            primaryHue = 252;
        } else if(color.classList.contains('color-2')){
            primaryHue = 52;
        } else if(color.classList.contains('color-3')){
            primaryHue = 352;
        } else if(color.classList.contains('color-4')){
            primaryHue = 152;
        } else if(color.classList.contains('color-5')){
            primaryHue = 202;
        }
        color.classList.add('active');

        root.style.setProperty('--primary-color-hue', primaryHue);
    })
})

// theme BACKGROUND values
let lightColorLightness;
let whiteColorLightness;
let darkColorLightness;

// changes background color
const changeBG = () => {
    root.style.setProperty('--light-color-lightness', lightColorLightness);
    root.style.setProperty('--white-color-lightness', whiteColorLightness);
    root.style.setProperty('--dark-color-lightness', darkColorLightness);
}


// change background colors
Bg1.addEventListener('click', () => {
    // add active class
    Bg1.classList.add('active');
    // remove active class from the others
    Bg2.classList.remove('active');
    Bg3.classList.remove('active');
    // remove customized changes from local storage
    window.location.reload();
});

Bg2.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '20%';
    lightColorLightness = '15%';
    
    // add active class
    Bg2.classList.add('active');
    // remove active class from the others
    Bg1.classList.remove('active');
    Bg3.classList.remove('active');
    changeBG();
});

Bg3.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '10%';
    lightColorLightness = '0%';

    // add active class
    Bg3.classList.add('active');
    // remove active class from others
    Bg1.classList.remove('active');
    Bg2.classList.remove('active');
    changeBG();
})

// ======================== SWITCH CHANNELS =========================
function switchToLocalChannel() {
    // delete all middle part.
    page="localnews";
    document.getElementById("middlePart").innerHTML = '<div class="feeds" id="allNews"></div>'
    document.getElementById("globalChannel").innerHTML = '<a class="menu-item" onclick="switchToGlobalChannel()" id="globalChannel">' + 
    '<span><i class="uil uil-compass"></i></span><h3>Global Channel</h3></a>'
    document.getElementById('globalChannel').className="menu-item"
    document.getElementById("localStream").innerHTML = '<a class="menu-item" onclick="switchToLocalStream()" id="localStream">' + 
    '<span><i class="uil uil-compass"></i></span><h3>Local Channel</h3></a>'
    document.getElementById("localChannel").innerHTML = '<a class="menu-item active" onclick="switchToLocalChannel()" id="localChannel">' + 
    '<span><i class="uil uil-compass"></i></span><h3>local News</h3></a>'

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(acquireLocalNewsViaGeoLocation)
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function acquireLocalNewsViaGeoLocation(position) {
    $.ajax({
        url: "/socialmedia/get-local-news",
        type: "POST",
        data: {
            lat: position.coords.latitude,
            long: position.coords.longitude,
            csrfmiddlewaretoken: getCSRFToken()
        },
        success: updateNews,
        error: updateError
    })
}


var page="global";

function switchToGlobalChannel() {
    // delete all middle part.
    page="global";
    if (document.getElementById("allFeeds") != null) return
    document.getElementById("middlePart").innerHTML = '<div class="middle" id="middlePart"><div class="create-post" id="create-post"><div id="editor"><script>let editor</script></div><input type="submit" value="Post" class="btn btn-primary btn-floatright" onclick="postAction()"></div>' +
        '<div class="feeds" id="allFeeds"></div>'
    
    document.getElementsByClassName("feeds")[0].id = "allFeeds"
        document.getElementById("globalChannel").innerHTML = '<a class="menu-item active" onclick="switchToGlobalChannel()" id="globalChannel">' + 
        '<span><i class="uil uil-compass"></i></span><h3>Global Channel</h3></a>'
        document.getElementById("localStream").innerHTML = '<a class="menu-item" onclick="switchToLocalStream()" id="localStream">' + 
        '<span><i class="uil uil-compass"></i></span><h3>Local Channel</h3></a>'
        document.getElementById("localChannel").innerHTML = '<a class="menu-item" onclick="switchToLocalChannel()" id="localChannel">' + 
        '<span><i class="uil uil-compass"></i></span><h3>local News</h3></a>'
    


    ClassicEditor
        .create( document.querySelector( '#editor' ))
        .then( newEditor => {
            editor = newEditor;
        } )
        .catch( error => {
            console.error( error );
        } );


    $.ajax({
        url: "/socialmedia/get-posts",
        type: "GET",
        success: updatePosts,
        error: updateError
    })

}

function switchToLocalStream() {
    // delete all middle part.
    page="localstream";
    if (document.getElementById("localFeeds") != null) return
    document.getElementById("middlePart").innerHTML = '<div class="middle" id="middlePart"><div class="create-post" id="create-post"><div id="editor"><script>let editor</script></div><input type="submit" value="Post" class="btn btn-primary btn-floatright" onclick="postAction()"></div>' +
        '<div class="feeds" id="localFeeds"></div>'
    console.log("trying to switch to local stream!")
    document.getElementsByClassName("feeds")[0].id = "localFeeds"
    document.getElementById("globalChannel").innerHTML = '<a class="menu-item" onclick="switchToGlobalChannel()" id="globalChannel">' + 
    '<span><i class="uil uil-compass"></i></span><h3>Global Channel</h3></a>'
    document.getElementById('globalChannel').className="menu-item"
    document.getElementById("localStream").innerHTML = '<a class="menu-item active" onclick="switchToLocalStream()" id="localStream">' + 
    '<span><i class="uil uil-compass"></i></span><h3>Local Channel</h3></a>'
    document.getElementById("localChannel").innerHTML = '<a class="menu-item" onclick="switchToLocalChannel()" id="localChannel">' + 
    '<span><i class="uil uil-compass"></i></span><h3>local News</h3></a>'


    ClassicEditor
        .create( document.querySelector( '#editor' ))
        .then( newEditor => {
            editor = newEditor;
        } )
        .catch( error => {
            console.error( error );
        } );


    getLocationforLocal()
    window.onload = getLocationforLocal;
    window.setInterval(loadPosts, 5000);

}





// ======================== POST =========================

function postAction() {
    getLocationThenPost()
}

function getLocationThenPost() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(postAfterGeoAquired)
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}


function postAfterGeoAquired(position) {
    // let post_bar = document.getElementById("create-post")
    // let post_text = post_bar.value
    // post_bar.value = ""
    post_body = editor.getData()
    editor.setData('')

    $.ajax({
        url: "/socialmedia/post",
        type: "POST",
        data: {
            text: post_body,
            lat: position.coords.latitude,
            long: position.coords.longitude,
            csrfmiddlewaretoken: getCSRFToken()
        },
        success: updatePosts,
        error: updateError
    })
}

function updateLocalPosts(response) {
    // todo: clean deleted posts.
    // new post found.
    $(response).each(function() {
        if (this.type == "comment") {
            return
        }
        let post_id = "id_post_div_"+this.post.id
        if (document.getElementById(post_id) == null && document.getElementById("localFeeds") != null) {
            //console.log("new id " + post_id)
            //console.log("new text " + this.text)
            $("#localFeeds").prepend(postFormatter(this))
        }else{
            console.log("old id:" + post_id)
            comments = this.comments
            father = document.getElementById("comments_post_div_" + this.post.id)
            for (let i=0; i<comments.length; i+= 1){
                if (document.getElementById("id_comment_div_"+comments[i].id) == null && document.getElementById("localFeeds") != null){
                    console.log("new comment:" + "id_comment_div_"+comments[i].id)
                    console.log("to append:" + "comments_post_div_"+comments[i].id)
                    $("#comments_post_div_"+this.post.id).prepend(commentFormatter(comments[i]))
                }
            }
        }
    })
}

function updatePosts(response) {
    // todo: clean deleted posts.
    // new post found.
    $(response).each(function() {
        if (this.type == "comment" || this == undefined) {
            return
        }
        let post_id = "id_post_div_"+this.post.id
        if (document.getElementById(post_id) == null && document.getElementById("allFeeds") != null) {
            //console.log("new id " + post_id)
            //console.log("new text " + this.text)
            $("#allFeeds").prepend(postFormatter(this))
        }else{
            console.log("old id:" + post_id)
            comments = this.comments
            father = document.getElementById("comments_post_div_" + this.post.id)
            for (let i=0; i<comments.length; i+= 1){
                if (document.getElementById("id_comment_div_"+comments[i].id) == null && document.getElementById("allFeeds") != null){
                    console.log("new comment:" + "id_comment_div_"+comments[i].id)
                    console.log("to append:" + "comments_post_div_"+comments[i].id)
                    $("#comments_post_div_"+this.post.id).prepend(commentFormatter(comments[i]))
                }
            }
        }
    })
}

function updateNews(response) {
    $(response).each(function() {
        $("#allNews").append(newsFormatter(this))
    })
}

function newsFormatter(news) {
    result = '<div class="feed"><div class="text">' + news.title +'</div></div>'
    return result
}


// ======================== Text Formatter =========================
function displayComments(post_id) {
    document.getElementById("comments_post_div_" + post_id).style.display = 'block';
    document.getElementById("comment_display_" + post_id).style.display = 'none';
}

function postFormatter(response) {
    post = response.post
    comments = response.comments
    result = '<div class="feed"><div class="head"><div class="user"><div class="profile-photo">'
        + '<img src="./images/profile-' + post.user + '.jpg"></div><div class="ingo">'
        + '<h3>' + post.firstname + ' ' + post.lastname + '</h3>'
        + '<small>' + post.city + ', 15 MINUTES AGO</small>'
        + '</div></div><span class="edit"><i class="uil uil-ellipsis-h"></i></span></div>'
        + '<div class="text" id="id_post_div_' + post.id + '">' + post.text + '</div>'
        + '<img alt="no image uploaded" src="socialnetwork/photo/' + post.id + '" id="id_picture_' + post.id + '"></img>'
        + '<div class="action-buttons"><div class="interaction-buttons"><span><i class="uil uil-heart"></i></span><span><i class="uil uil-comment-dots"></i></span><span><i class="uil uil-share-alt"></i></span></div><div class="bookmark"><span><i class="uil uil-bookmark-full"></i></span></div></div>'
        + '<div class="liked-by"><span><img src="./images/profile-10.jpg"></span><span><img src="./images/profile-4.jpg"></span><span><img src="./images/profile-15.jpg"></span><p>Liked by <b>UserC</b> and <b>4 others</b></p></div>'
        + '<div id="comment_display_' + post.id + '"class="comments text-muted"><button onClick="displayComments(' + post.id + ')">View all ' + comments.length + ' comments</button></div>'
        + '<div id="comments_post_div_' + post.id + '" style="display:none">'
    
    for (let i = 0; i<comments.length; i += 1){
        comment = comments[i]
        console.log(comment.text)
        comment_result = '<div class="text" id="id_comment_div_' + comment.id + '">' + comment.text + 
        '<h3>' + comment.firstname + ' ' + comment.lastname + '</h3></div>'
        result += comment_result
    }
    result += '</div><input type="text" name="new_comment" id="id_comment_input_text_' + post.id + '">' + 
    '<button id="id_comment_button_' + post.id + '" onclick="addComment(' + post.id + ')">Add Comment</button></div>'
    
    return result
}

function commentFormatter(comment){
    result = '<div class="text" id="id_comment_div_' + comment.id + '">' + comment.text + 
    '<h3>' + comment.firstname + ' ' + comment.lastname + '</h3></div>'
    return result
}

// ======================== Local Stream =========================
var lat;
var lon;
function getLocationforLocal() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(loadPosts)
        
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function loadPosts(position) {
    console.log("start load!")
    let request = new XMLHttpRequest()
    request.onreadystatechange = function() {
            if (request.readyState != 4) return
            updatePage(request)
    }
    if (position != undefined) {
        lat = parseInt(10000 * position.coords.latitude).toString();
        lon = parseInt(10000 * position.coords.longitude).toString();
    }
    console.log("/socialnetwork/get-local/"+lon+"/"+lat+"/")
    request.open("GET", "/socialnetwork/get-local/"+lon+"/"+lat+"/", true)
    request.send()
}

function updatePage(xhr) {
    if (xhr.status == 200) {
        let response = JSON.parse(xhr.responseText)
        updateLocalPosts(response)
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

    let response = JSON.parse(xhr.responseText)
    if (response.hasOwnProperty('error')) {
        displayError(response.error)
        return
    }

    displayError(response)
}

// ======================== HELPERS =========================
function addComment(id) {
    
    let itemTextElement = document.getElementById("id_comment_input_text_" + id)
    let itemTextValue = itemTextElement.value 

    itemTextElement.value = ''
    
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return
        document.getElementById("comments_post_div_" + id).style.display = 'block';
        document.getElementById("comment_display_" + id).style.display = 'none';
        updatePage(xhr)
    }

    xhr.open("POST", "/socialnetwork/add-comment", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-CSRF-Token", getCSRFToken());
    var page = "global"

    if (document.getElementById("allFeeds") != null){
        page = "global"
    }
    if (document.getElementById("localFeeds") != null){
        page = "localstream"
    }
    console.log("page:" + page);
    
    xhr.send("lat=" + lat + "&lon=" + lon + "&page=" + page +"&post_id=" + id + "&comment_text=" + itemTextValue + "&csrfmiddlewaretoken="+getCSRFToken())
}

function getCSRFToken() {
    let cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim()
        if (c.startsWith("csrftoken=")) {
            return c.substring("csrftoken=".length, c.length)
        }
    }
    return "unknown";
}

// error handling
function updateError(xhr) {
    if (xhr.status == 0) {
        displayError("Cannot connect to server")
        return
    }

    if (!xhr.getResponseHeader('content-type') == 'application/json') {
        displayError("Received status=" + xhr.status)
        return
    }

    let response = JSON.parse(xhr.responseText)
    if (response.hasOwnProperty('error')) {
        displayError(response.error)
        return
    }

    displayError(response)
}

function displayError(message) {
    $("#error").html(message);
}

// get posts
function getPosts() {
    $.ajax({
        url: "/socialmedia/get-posts",
        datatype: "json",
        success: updatePosts,
        error: updateError
    })
}

// END