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

// current location of the user.
var currLocation;
var currPage;


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


// ======================== Eve events =========================
function onloadEvents() {
    currPage = "globalChannel";
    getPosts();
    acquireCurrLocation();

    document.onclick = function(event) {
        var a = event.target;
        vis_div = document.getElementById("visibility-form")
        grp_div = document.getElementById("add-group-form")
        if( !(a == vis_div || vis_div.contains(a) || a == grp_div || grp_div.contains(a))) {
            overlay_off();
        }
    }

    document.getElementById("group-tab").onclick = function(event) {
        document.querySelector("#group-tab").classList.toggle("active")
        document.querySelector("#following-tab").classList.toggle("active")
        // document.querySelectorAll(".message").classList.toggle("message")
        var msgList = document.querySelectorAll(".message")
        for(var i=0; i<msgList.length; i++) {
            msgList.item(i).classList.toggle("hide")
        }
        document.querySelector("#add-group").classList.toggle("hide")
    }

    document.getElementById("following-tab").onclick = function(event) {
        document.querySelector("#group-tab").classList.toggle("active")
        document.querySelector("#following-tab").classList.toggle("active")
        var msgList = document.querySelectorAll(".message")
        for(var i=0; i<msgList.length; i++) {
            msgList.item(i).classList.toggle("hide")
        }
        document.querySelector("#add-group").classList.toggle("hide")
    }
}


// ======================== acquire current location =========================
function acquireCurrLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(location){
            currLocation = location;
        })
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}


// ======================== SWITCH CHANNELS =========================
function switchToLocalNews() {
    // change menu item ui color
    highlightMenuItem("localNews")
    if (currPage == "localNews") return
    currPage = "localNews"
    // delete all middle part.
    document.getElementById("middlePart").innerHTML = '<div class="feeds" id="allNews"></div>'

    //suppose the geolocation is cached.
    let lat = parseInt(10000 * currLocation.coords.latitude).toString();
    let lon = parseInt(10000 * currLocation.coords.longitude).toString();

    $.ajax({
        url: "/socialmedia/get-local-news/"+lon+"/"+lat+"/",
        type: "GET",
        success: updateNews,
        error: updateError
    })
}

function updateNews(response) {
    $(response).each(function() {
        $("#allNews").append(newsFormatter(this))
    })
}


function switchToGlobalChannel() {
    // change menu item ui color
    highlightMenuItem("globalChannel")
    if (currPage == "globalChannel") return
    currPage = "globalChannel"
    // delete all middle part.
    document.getElementById("middlePart").innerHTML =
        '<div class="create-post" id="create-post">' +
        '<div id="editor"><script>let editor</script></div>' +
        '<input type="submit" value="Post" class="btn btn-primary btn-floatright" onclick="postAction()">' +
        '</div>' +
        '<div class="feeds" id="allFeeds"></div>'


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
        success: updateLocalPosts,
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




function switchToLocalStream() {
    // change menu item ui color
    highlightMenuItem("localStream")
    if (currPage == "localStream") return
    currPage = "localStream"
    // delete all middle part.
    document.getElementById("middlePart").innerHTML =
        '<div class="create-post" id="create-post">' +
        '<div id="editor"><script>let editor</script></div>' +
        '<input type="submit" value="Post" class="btn btn-primary btn-floatright" onclick="postAction()">' +
        '</div>' +
        '<div class="feeds" id="allFeeds"></div>'


    ClassicEditor
        .create( document.querySelector( '#editor' ))
        .then( newEditor => {
            editor = newEditor;
        } )
        .catch( error => {
            console.error( error );
        } );

    //suppose the geolocation is cached.
    let lat = parseInt(10000 * currLocation.coords.latitude).toString();
    let lon = parseInt(10000 * currLocation.coords.longitude).toString();

    $.ajax({
        url: "/socialmedia/get-local/"+lon+"/"+lat+"/",
        type: "GET",
        success: updateLocalPosts,
        error: updateError
    })
}


function updateLocalPosts(response) {
    $(response).each(function() {
        let post_id = "id_post_div_"+this.post.id
        if (document.getElementById(post_id) == null) {
            // new post found.
            $("#allFeeds").prepend(postWithCommentsFormatter(this))
        } else {
            let comments = this.comments
            let father = document.getElementById("comments_post_div_" + this.post.id)
            // prepend new comment on top.
            for (let i=0; i<comments.length; i++){
                if (document.getElementById("id_comment_div_"+comments[i].id) == null){
                    $("#comments_post_div_"+this.post.id).prepend(commentFormatter(comments[i]))
                }
            }
            if (document.getElementById("comment_display_" + this.post.id).innerHTML != "Fold comments.") {
                let commentCount = document.getElementById("comments_post_div_" + this.post.id).childElementCount
                document.getElementById("comment_display_" + this.post.id).innerHTML = "View all " + commentCount + " comments.";
            }
        }
    })

    // update edit button with onclick function
    let edit_btns = document.getElementsByClassName("uil-ellipsis-h")
    for( let i=0; i<edit_btns.length; i++ ) {
        edit_btns[i].addEventListener('click', show_edit_dropdown)
    }

    let edit_vis = document.getElementsByClassName("set-visib")
    for( let i=0; i<edit_vis.length; i++ ) {
        edit_vis[i].addEventListener('click', show_edit_visibility)
    }
}

function switchToStat() {
    highlightMenuItem("statistics")
    if (currPage == "statistics") return
    currPage = "statistics"

    document.getElementById("middlePart").innerHTML =
        '<div class="stat">'
        + '<h3>SocialMedia GitHub Registerred vs. Google Registerred</h3>'
        + '<div id="container" style="width: 600px; height: 400px"></div>'
        + '<h3>8 Places where most of the posts come from</h3>'
        + '<div id="container2" style="width: 600px; height: 400px"></div>'
        + '<h3>Number of new posts published every day</h3>'
        + '<div id="container3" style="width: 600px; height: 400px"></div>'
        + '</div>'
      
    $.ajax({
        url: "/socialmedia/stat",
        type: "GET",
        success: updateData,
        error: updateError
    })
}

function updateData(response) {
    updatefig1(response);
    updatefig2(response);
    updatefig3(response);
}

function updatefig1(response) {
    var dom = document.getElementById("container");
    var myChart = echarts.init(dom);
    var app = {};

    var option;

    console.log(response)

    var github_cnt = response.users_dis.github;
    var google_cnt = response.users_dis.google;

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: github_cnt, name: 'GitHub' },
            { value: google_cnt, name: 'Google' },
          ]
        }
      ]
    };

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }
}

function updatefig2(response) {
    var dom = document.getElementById("container2");
    var myChart = echarts.init(dom);
    var app = {};

    var option;

    var data = response.posts_dis;
    data = JSON.parse(data.replace(/&quot;/g,'"'));
    console.log(data)

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }
}

function updatefig3(response) {
    var chartDom = document.getElementById('container3');
    var myChart = echarts.init(chartDom);
    var app={}
    var option;

    var date = response.date;
    var num = response.num;
    option = {
      xAxis: {
        type: 'category',
        data: date
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: num,
          type: 'line'
        }
      ]
    };

    option && myChart.setOption(option);
}

function switchToMapit() {
    // change menu item ui color
    highlightMenuItem("mapitChannel")
    if (currPage == "mapitChannel") return
    currPage = "mapitChannel"
    // delete all middle part.
    document.getElementById("middlePart").innerHTML =
        '<div class="feeds" id="mapitPlaceholder" style="width:600px;height:450px;"></div>'

    //suppose the geolocation is cached.
    let lat = parseInt(10000 * currLocation.coords.latitude).toString();
    let lon = parseInt(10000 * currLocation.coords.longitude).toString();
    $.ajax({
        url: "/socialmedia/get-postsNearby/"+lon+"/"+lat+"/",
        type: "GET",
        success: updateMap,
        error: updateError
    })
}

function updateMap(response) {
    mapPlaceholder = document.getElementById('mapitPlaceholder');
    var data = []

    $(response).each(function() {
        let start = luxon.DateTime.fromISO(this.created_time)
        let end = luxon.DateTime.fromJSDate(new Date())
        let diff = end.diff(start, ['days', 'hours', 'minutes']).toObject()

        data.push({
            type:'scattermapbox',
            customdata: [[this.firstname + ' ' + this.lastname, dateDiffFormatter(diff)]],
            hovertemplate: "<b>%{customdata[0]}</b><br><i>%{customdata[1]}</i><br>%{text}<extra></extra>",
            lat:[this.latitude],
            lon:[this.longitude],
            mode:'markers',
            marker: {
            size:14
            },
            text:[this.text]
        })
    })

    var layout = {
      autosize: true,
      hovermode:'closest',
      showlegend:false,
      mapbox: {
          bearing:0,
          center: {
          lat:currLocation.coords.latitude,
          lon:currLocation.coords.longitude
        },
        pitch:0,
        zoom:13
      },
    }

    Plotly.setPlotConfig({
      mapboxAccessToken: "pk.eyJ1IjoieWluYW4xMjgiLCJhIjoiY2t2eTI4b2s3NzM4cTJ1czFmN2Z2NXVlbSJ9.1MRpWhMX4OdTDWNqNoGaaw"
    })

    Plotly.newPlot(mapPlaceholder, data, layout)

}

// ======================== POST =========================

function postAction() {
    let post_body = editor.getData()
    editor.setData('')
    console.log(currPage)

    $.ajax({
        url: "/socialmedia/post",
        type: "POST",
        data: {
            text: post_body,
            lat: currLocation.coords.latitude,
            long: currLocation.coords.longitude,
            visibility: 'Public',
            csrfmiddlewaretoken: getCSRFToken(),
            page: currPage
        },
        success: updateLocalPosts,
        error: updateError
    })
}

// ======================== Comment =========================
function addComment(id) {

    let itemTextElement = document.getElementById("id_comment_input_text_" + id)
    let itemTextValue = itemTextElement.value
    itemTextElement.value = ''
    $.ajax({
        url: "/socialmedia/add-comment",
        type: "POST",
        data: {
            comment_text: itemTextValue,
            lat: currLocation.coords.latitude * 10000,
            lon: currLocation.coords.longitude * 10000,
            page: currPage,
            post_id: id,
            csrfmiddlewaretoken: getCSRFToken()
        },
        success: updateLocalPosts,
        error: updateError
    })
}


// ======================== Edit Dropdown Menu =========================

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
        url: "/socialmedia/set-visibility",
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
    }
}


function overlay_off() {
    document.getElementById("visibility-overlay").style.display = "none"
    document.getElementById("add-group-overlay").style.display = "none"
}


// ======================== Group Tab =========================
function get_users_list() {

    $.ajax({
        url: '/socialmedia/users-list',
        datatype: 'json',
        success: function(response){
            add_users_list(response);
        },
        error: updateError,
    })
}

function add_users_list(response) {
    document.getElementById("add-group-overlay").style.display = "block"
    console.log(response)
    form = document.getElementById("form-details")
    form.innerHTML = ""
    for (var i=0; i<response.length; i++) {
        var user = response[i]
        console.log(user)
        var user_check = document.createElement("input")
        user_check.setAttribute("type", "checkbox")
        user_check.setAttribute("id", "user_check_"+user['user_id'])
        user_check.setAttribute("name", "user_"+user['user_id'])
        user_check.setAttribute("value", user['user_id'])
        var user_label = document.createElement("label")
        user_label.setAttribute("for", "user_check_"+user['user_id'])
        user_label.innerHTML = user['first_name'] + " " + user['last_name']
        user_label.setAttribute("class", "user_checkbox")
        var br_elem = document.createElement("br")
        form.append(user_check)
        form.append(user_label)
        form.append(br_elem)
    }
    var confirm_btn = document.createElement("input")
    confirm_btn.setAttribute("type", "submit")
    confirm_btn.setAttribute("value", "Confirm")
    confirm_btn.setAttribute("onsubmit", "add_group()")
    confirm_btn.setAttribute("style", "width: 100%;padding: 5px;")
    form.append(confirm_btn)

}


function add_group() {
    $.ajax({
        url: "/socialmedia/add-group",
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


function show_add_group_overlay() {
    document.getElementById("add-group-overlay").style.display = "block"
}





// ======================== Text Formatter =========================
function postFormatter(response) {
    let start = luxon.DateTime.fromJSDate(new Date(response.created_time))
    let end = luxon.DateTime.fromJSDate(new Date())
    let diff = end.diff(start, ['days', 'hours', 'minutes']).toObject()

    // let result = '<div class="feed"><div class="head"><div class="user"><div class="profile-photo">'
    //     + '<img src="./images/profile-' + response.user + '.jpg"></div><div class="ingo">'
    //     + '<h3>' + response.firstname + ' ' + response.lastname + '</h3>'
    //     + '<small>' + response.city + ', ' + dateDiffFormatter(diff) + '</small>'
    //     + '</div></div><span class="edit"><i class="uil uil-ellipsis-h"></i></span></div>'

    let result = '<div class="feed"><div class="head"><div class="user"><div class="profile-photo">'
        + '<img src="./images/profile-' + response.user + '.jpg"></div><div class="ingo">'
        + '<h3>' + response.firstname + ' ' + response.lastname + '</h3>'
        + '<small>' + response.city + ', ' + dateDiffFormatter(diff) + '</small>'
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


function postWithCommentsFormatter(response) {
    let post = response.post
    let comments = response.comments
    let start = luxon.DateTime.fromJSDate(new Date(post.created_time))
    let end = luxon.DateTime.fromJSDate(new Date())
    let diff = end.diff(start, ['days', 'hours', 'minutes']).toObject()

    let result = '<div class="feed"><div class="head"><div class="user"><div class="profile-photo">'
        + '<img src="./images/profile-' + post.user + '.jpg"></div><div class="ingo">'
        + '<h3>' + post.firstname + ' ' + post.lastname + '</h3>'
        + '<small>' + post.city + ', ' + dateDiffFormatter(diff) + '</small>'
        + '</div></div><div class="edit">'

    // Only show ellipsis button if it's mine post
    if(post['mine']) {
        result += '<button class="uil uil-ellipsis-h"></button>'
    }

    result += '<div class="edit-dropdown-content"> <a class="edit-post">Edit</a> '
        + '<a class="set-visib">Visibility</a></div> </div></div>'
        + '<div class="text" id="id_post_div_' + post.id + '">' + post.text + '</div>'

        + '<div class="action-buttons"><div class="interaction-buttons"><span><i class="uil uil-heart"></i></span><span><i class="uil uil-comment-dots"></i></span><span><i class="uil uil-share-alt"></i></span></div><div class="bookmark"><span><i class="uil uil-bookmark-full"></i></span></div></div>'
        + '<div class="liked-by"><span><img src="./images/profile-10.jpg"></span><span><img src="./images/profile-4.jpg"></span><span><img src="./images/profile-15.jpg"></span><p>Liked by <b>UserC</b> and <b>4 others</b></p></div>'

        + '<div id="comment_display_' + post.id + '" class="comments text-muted" onclick="displayComments(' + post.id + ')">View all ' + comments.length + ' comments</div>'
        + '<div id="comments_post_div_' + post.id + '" style="display:none">'

    for (let i = 0; i<comments.length; i += 1){
        let comment = comments[i]
        console.log(comment.text)
        let comment_result = '<div class="text" id="id_comment_div_' + comment.id + '">' + comment.text +
        '<h3>' + comment.firstname + ' ' + comment.lastname + '</h3></div>'
        result += comment_result
    }

    result += '</div><input type="text" name="new_comment" id="id_comment_input_text_' + post.id + '">' +
    '<button id="id_comment_button_' + post.id + '" onclick="addComment(' + post.id + ')">Add Comment</button></div>'

    return result
}


function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    return newDate;
}

function newsFormatter(news) {
    let start = luxon.DateTime.fromJSDate(new Date(news.publish))
    let end = luxon.DateTime.fromJSDate(new Date())
    let diff = end.diff(start, ['days', 'hours', 'minutes']).toObject()

    let result = '<div class="feed">' +
        '<div class="head">' +
        '<div class="ingo">' +
        '<a href="' + news.url + '"><h3>' +news.title + '</h3></a>' +
        '<small>'+ news.author + ', ' + dateDiffFormatter(diff) +'</small>' +
        '</div>' +
        '</div>' +
        '<div><img src="' + news.imageUrl + '"></div>'
    return result
}

function dateDiffFormatter(diff) {
    let result = ""
    if (diff.days != 0) {
        result += diff.days + " days "
    }
    if (diff.hours != 0) {
        result += diff.hours + " hours "
    }
    if (Math.round(diff.minutes) == 1) {
        result += Math.round(diff.minutes) + " minute ago"
    } else {
        result += Math.round(diff.minutes) + " minutes ago"
    }
    return result
}

function commentFormatter(comment){
    console.log(comment)
    let result = '<div class="text" id="id_comment_div_' + comment.id + '">' + comment.text +
    '<h3>' + comment.firstname + ' ' + comment.lastname + '</h3></div>'
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

function highlightMenuItem(id) {
    // change the color of the channel.
    let currentActive = document.getElementsByClassName("menu-item active")
    currentActive[0].className = currentActive[0].className.replace(" active", "")
    document.getElementById(id).className += " active"

}

function displayComments(post_id) {
    document.getElementById("comments_post_div_" + post_id).style.display = 'block';
    // document.getElementById("comment_display_" + post_id).style.display = 'none';
    document.getElementById("comment_display_" + post_id).innerHTML = "Fold comments.";
    document.getElementById("comment_display_" + post_id).setAttribute('onclick', "foldComments(" + post_id + ")");
}

function foldComments(post_id) {
    let commentCount = document.getElementById("comments_post_div_" + post_id).childElementCount
    document.getElementById("comments_post_div_" + post_id).style.display = 'none';
    document.getElementById("comment_display_" + post_id).innerHTML = "View all " + commentCount + " comments.";
    document.getElementById("comment_display_" + post_id).setAttribute('onclick', "displayComments(" + post_id + ")");
}


// get posts
function getPosts() {
    $.ajax({
        url: "/socialmedia/get-posts",
        type: "GET",
        success: updateLocalPosts,
        error: updateError
    })
}

// END