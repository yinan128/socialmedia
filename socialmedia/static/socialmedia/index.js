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
            visibility: 'Public',
            csrfmiddlewaretoken: getCSRFToken()
        },
        success: updatePosts,
        error: updateError
    })
}

function updatePosts(response) {
    // todo: clean deleted posts.
    // new post found.
    $(response).each(function() {
        if (this.type == "comment") {
            return
        }
        let post_id = "id_post_div_"+this.id
        if (document.getElementById(post_id) == null) {
            $("#allFeeds").prepend(postFormatter(this))
        }
    })

    // update edit button with onclick function
    var edit_btns = document.getElementsByClassName("uil-ellipsis-h")
    for( var i=0; i<edit_btns.length; i++ ) {
        edit_btns[i].addEventListener('click', show_edit_dropdown)
    }

    var edit_vis = document.getElementsByClassName("set-visib")
    for( var i=0; i<edit_vis.length; i++ ) {
        edit_vis[i].addEventListener('click', show_edit_visibility)
    }
}

function show_edit_dropdown() {
    var parent_div = this.parentElement
    parent_div.querySelector(".edit-dropdown-content").classList.toggle("show")
}

function show_edit_visibility() {
    var feed_div = $(this).parentsUntil(".feeds", ".feed")[0]
    var text_div = feed_div.getElementsByClassName("text")[0]
    var post_id = text_div.id.split("_").at(-1)
    post_id = parseInt(post_id)
    $.ajax({
        url: '/socialmedia/get-visibility',
        method: 'POST',
        data: {
            'post_id': post_id,
            csrfmiddlewaretoken: getCSRFToken(),
        },
        success: function(response) {
            overlay_on(post_id, response);
        },
        error: updateError,
    })
}

function update_groups_options(groups) {
    $.ajax({
        url: "/socialmedia/get-groups",
        datatype: "json",
        success: function(response) {
            update_vis_form(response, groups);
        },
        error: updateError
    })
}

function edit_post_vis() {
    post_id = parseInt(document.getElementById("post_vis_id").value)
    console.log("post id is "+post_id)
    $.ajax({
        url: "/socialmedia/set-visibility/",
        datatype: "json",
        success: function() {
            overlay_off();
            updatePosts();
        },
        error: function() {
            overlay_off();
            updateError();
        },
    })
}

function remove_groups_options() {
    document.getElementById("select-groups").innerHTML = ""
}

function update_vis_form(response, groups) {
    var check_div = document.getElementById("select-groups")
    var innerHtml = ""
    hide_group_ids = []
    if(groups != null) {
        for(var j=1; j<groups.length; j++) {
            hide_group_ids.push(groups[j]['group_id'])
        }
    }
    console.log(hide_group_ids)
    for(var i=0; i<response.length; i++) {
        gid = response[i]['group_id']
        gname = response[i]['group_name']
        if(hide_group_ids.includes(gid)) {
            innerHtml += '<input type="checkbox" id="select_group_'+ gid 
                      + '" name="group_' + i + '" value="' + gid + '" checked>'
                      + '<label for="select_group_' + gid + '"> '+ gname 
                      + '</label><br>'
        }
        else {
            innerHtml += '<input type="checkbox" id="select_group_'+ gid 
                      + '" name="group_' + i + '" value="' + gid + '">'
                      + '<label for="select_group_' + gid + '"> '+ gname 
                      + '</label><br>'
        }
    }
    check_div.innerHTML = innerHtml
}


function overlay_on(post_id, response) {
    document.getElementById("visibility-overlay").style.display = "block"
    document.getElementById("post_vis_id").value=post_id
    console.log(response)
    if(response[0]['visibility'] == "Private") {
        document.getElementById("public_vis").checked=false;
        document.getElementById("group_vis").checked=false;
        document.getElementById("private_vis").checked=true;
    }
    if(response[0]['visibility'] == "Group") {
        document.getElementById("public_vis").checked=false;
        document.getElementById("private_vis").checked=false;
        document.getElementById("group_vis").checked=true;

        update_groups_options(response);
        // for(var i=1; i<response.length; i++) {
        //     group_id = "select_group_"+response[i]['group_id']
        //     console.log(document.getElementById(group_id))
        //     document.getElementById(group_id).checked=true
        // }
    }
}

function overlay_off() {
    document.getElementById("visibility-overlay").style.display = "none"
}



// ======================== Text Formatter =========================
function postFormatter(response) {
    console.log(response['mine'])
    result = '<div class="feed"><div class="head"><div class="user"><div class="profile-photo">'
        + '<img src="./images/profile-' + response.user + '.jpg"></div><div class="ingo">'
        + '<h3>' + response.firstname + ' ' + response.lastname + '</h3>'
        + '<small>' + response.city + ', 15 MINUTES AGO</small>'
        + '</div></div><div class="edit">'

    // Only show ellipsis button if it's mine post
    if(response['mine'] == true) {
        result += '<button class="uil uil-ellipsis-h"></button>'
    }

    result += '<div class="edit-dropdown-content"> <a class="edit-post">Edit</a> '
        + '<a class="set-visib">Visibility</a></div> </div></div>'
        + '<div class="text" id="id_post_div_' + response.id + '">' + response.text + '</div>'
        + '<div class="action-buttons"><div class="interaction-buttons"><span><i class="uil uil-heart"></i></span><span><i class="uil uil-comment-dots"></i></span><span><i class="uil uil-share-alt"></i></span></div><div class="bookmark"><span><i class="uil uil-bookmark-full"></i></span></div></div>'
        + '<div class="liked-by"><span><img src="./images/profile-10.jpg"></span><span><img src="./images/profile-4.jpg"></span><span><img src="./images/profile-15.jpg"></span><p>Liked by <b>UserC</b> and <b>4 others</b></p></div>'
        + '<div class="comments text-muted">View all 277 comments</div></div>'
    

    return result
}

// ======================== HELPERS =========================
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