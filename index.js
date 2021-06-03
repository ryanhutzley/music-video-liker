// get elements
const bestSongContainer = document.querySelector('#best-song-container')
const bestSong = document.querySelector('#best-song')
const songList = document.querySelector('#song-list')
const addSong = document.querySelector('#add-song')
const hiddenEditDiv = document.querySelector('#hidden-edit-div')
const editSong = document.querySelector('#edit-song')
const getBest = document.querySelector('#get-best')


// event listner
addSong.addEventListener('submit', postSong)
editSong.addEventListener('submit', changeSongInfo)
getBest.addEventListener('click', getBestSong)

// get songs
function getSongs() {
    fetch("http://localhost:3000/songs")
    .then(res => res.json())
    .then(songs => songs.forEach(displaySongs))
}

getSongs()

// display songs
function displaySongs(song) {

    // creating elements
    let li = document.createElement('li')
    let artist = document.createElement('h3')
    let title = document.createElement('h2')
    let img = document.createElement('img')
    let video = document.createElement('iframe')
    let likesBtn = document.createElement('button')
    let likeCount = document.createElement('span')
    let editBtn = document.createElement('button')
    let deleteBtn = document.createElement('button')
    let br = document.createElement('br')

    // setting values
    artist.textContent = song.artist
    title.textContent = song.title 
    img.src = song.image
    img.height = 250
    video.src = song.video
    video.width = 400
    video.height = 250
    likesBtn.textContent = "Likes:"
    likeCount.textContent = song.likes
    editBtn.textContent = "Edit"
    deleteBtn.textContent = "Delete"

    // setting attributes
    li.setAttribute('class', "list-item")
    likesBtn.setAttribute('class', 'button-class')
    editBtn.setAttribute('class', 'button-class')
    deleteBtn.setAttribute('class', 'button-class')
    img.setAttribute('class', 'visuals')
    video.setAttribute('class', 'visuals')
    likesBtn.dataset.id = song.id
    editBtn.dataset.id = song.id
    deleteBtn.dataset.id = song.id
    likeCount.dataset.id = song.id
    li.dataset.id = song.id
    artist.dataset.id = song.id
    title.dataset.id = song.id
    img.dataset.id = song.id
    video.dataset.id = song.id

    // add event listeners
    likesBtn.addEventListener('click', addLike)
    editBtn.addEventListener('click', showEditForm)
    deleteBtn.addEventListener('click', removeSong)
    // append to DOM
    likesBtn.append(likeCount)
    li.append(img, video, title, artist, likesBtn, editBtn, deleteBtn)
    // li.innerHTML = `<iframe width="950" height="534" src="${song.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    // li.append(img, title, artist, likesBtn, editBtn, deleteBtn)
    songList.append(li)
    songList.append(br)
}

// show edit form
function showEditForm(e) {
    hiddenEditDiv.hidden = false
    editSong.dataset.id = e.target.dataset.id
    populateEditForm(editSong)
}

// populate edit form
function populateEditForm(form) {
    document.documentElement.scrollTop = 0;
    let id = form.dataset.id
    let titleList = document.querySelectorAll('h2')
    let titleArray = Array.from(titleList)
    
    let artistList = document.querySelectorAll('h3')
    let imageList = document.querySelectorAll('img')
    let videoList = document.querySelectorAll('iframe')
    
    let titleIDs = titleArray.map(element => element.dataset.id)
    let index = titleIDs.indexOf(id)

    form.title.value = titleList[index].textContent
    form.artist.value = artistList[index].textContent
    form.image.value = imageList[index].src
    form.video.value = videoList[index].src
}

// edit song
function changeSongInfo(e) {
    e.preventDefault()
    songList.innerHTML = ""
    fetch(`http://localhost:3000/songs/${e.target.dataset.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": e.target.title.value,
            "artist": e.target.artist.value,
            "image": e.target.image.value,
            "video": e.target.video.value,
        })
    })
    .then(res => res.json())
    .then(() => {
        getSongs()
        e.target.reset()
        hiddenEditDiv.hidden = true
    })
}

// add likes
function addLike(e) {
    // console.log(e.target.firstElementChild.innerText)
    let likes = e.target.firstElementChild.textContent
    likes++
    fetch(`http://localhost:3000/songs/${e.target.dataset.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "likes": likes
        })
    })
    .then(() => e.target.firstElementChild.textContent = likes)
}

// post song
function postSong(e) {
    e.preventDefault()
    let urlArray = e.target.video.value.split("=")
    let resource = urlArray[1]
    fetch("http://localhost:3000/songs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": e.target.title.value,
            "artist": e.target.artist.value,
            "image": e.target.image.value,
            "video": `https://www.youtube.com/embed/${resource}`,
            "likes": 0,
        })
    })
    .then(res => res.json())
    .then(song => {
        displaySongs(song)
        e.target.reset()
    })
}

// remove song
function removeSong(e) {
    let id = e.target.dataset.id
    fetch(`http://localhost:3000/songs/${e.target.dataset.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(() => {
        let liList = document.querySelectorAll('li')
        let liArray = Array.from(liList)
        let liIDs = liArray.map(element => element.dataset.id)
        let index = liIDs.indexOf(id)
        liList[index].remove()
    })
}

// getting best song
function getBestSong() {
    bestSong.innerHTML = ""
    bestSongContainer.hidden = false
    let spanList = document.querySelectorAll('span')
    let spanArray = Array.from(spanList)
    let likesArray = spanArray.map(element => parseInt(element.textContent))
    let maxLikes = Math.max(...likesArray)
    let index = likesArray.indexOf(maxLikes)
    let id = spanList[index].dataset.id

    let titleList = document.querySelectorAll('h2')
    let artistList = document.querySelectorAll('h3')
    let imageList = document.querySelectorAll('img')
    let videoList = document.querySelectorAll('iframe')

    let arrayTitle = Array.from(titleList)
    let arrayIDs = arrayTitle.map(element => element.dataset.id)
    let newIndex = arrayIDs.indexOf(id)

    let li = document.createElement('li')
    li.setAttribute('id', 'most-liked-song')
    let title = document.createElement('h2')
    let artist = document.createElement('h3')
    let img = document.createElement('img')
    let video = document.createElement('iframe')

    title.textContent = titleList[newIndex].textContent
    artist.textContent = artistList[newIndex].textContent
    img.src = imageList[newIndex].src
    img.height = 250
    video.src = videoList[newIndex].src
    video.width = 400
    video.height = 250

    li.append(img, video, title, artist) 
    bestSong.append(li)   
}