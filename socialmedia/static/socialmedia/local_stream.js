
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
    let lat = parseInt(10000 * position.coords.latitude).toString()
    let lon = parseInt(10000 * position.coords.longitude).toString()
    console.log("/socialnetwork/get-local/"+lon+"/"+lat+"/")
    request.open("GET", "/socialnetwork/get-local/"+lon+"/"+lat+"/", true)
    request.send()
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

function updateList(items) {
    let list = document.getElementsByClassName("feeds")[0]
    while (list.hasChildNodes()){
        list.removeChild(list.firstChild)
    }

    for (let i=0; i<items.length; i++){
        let item = items[i]['post']
        let element = document.createElement("li")
        console.log(item)
        console.log(items[i])
        ingo = "<div class=\"ingo\"> <h3>" + item.user_id + " <small>" + item.city + " " + item.time + "</small> </div>"
        image = ""
        user = "<div class=\"user\">" + ingo + image + "</div> <span class=\"edit\"> <i class=\"uil uil-ellipsis-h\"></i></span>"
        head = "<div class=\"head\">" + user + "</div>"

        text = "<div class=\"text\">" + item.text + "</div>"
        action_buttons = "<div class=\"action-buttons\"> \
                            <div class=\"interaction-buttons\"> \
                                <span><i class=\"uil uil-heart\"></i></span> \
                                <span><i class=\"uil uil-comment-dots\"></i></span> \
                                <span><i class=\"uil uil-share-alt\"></i></span> \
                            </div> \
                            <div class=\"bookmark\"> \
                                <span><i class=\"uil uil-bookmark-full\"></i></span> \
                            </div> \
                        </div> "
        
        comment = "<div class=\"comments text-muted\">View all 277 comments</div>"
        feed = "<div class=\"feeds\">" + head + text + action_buttons + comment + "</div>"
        element.innerHTML = feed
        list.appendChild(element)
    }
}