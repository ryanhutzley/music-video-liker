// get elements
const bestSong = document.querySelector('#best-song')
const songList = document.querySelector('#song-list')
const addSong = document.querySelector('#add-song')
const alterSong = document.querySelector('#alter-song')
const editSong = document.querySelector('#edit-song')

// editSong.hidden = true

// event listner
addSong.addEventListener('submit', postSong)
alterSong.addEventListener('submit', changeSong)

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
    likeCount.innerText = song.likes
    editBtn.textContent = "Edit"
    deleteBtn.textContent = "Delete"
    // setting attributes
    likesBtn.dataset.id = song.id
    editBtn.dataset.id = song.id
    deleteBtn.dataset.id = song.id
    // editSong.dataset.id = song.id
    // li.dataset.id = song.id
    // artist.dataset.id = song.id
    // title.dataset.id = song.id
    // img.dataset.id = song.id
    // video.dataset.id = song.id

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
    console.log(e.target.dataset.id)
    alterSong.hidden = false
    editSong.dataset.id = e.target.dataset.id
    populateEditForm(editSong)
}

// populate edit form
function populateEditForm(form) {
    let id = form.dataset.id
    let titleList = document.querySelectorAll('h2')
    let artistList = document.querySelectorAll('h3')
    let imageList = document.querySelectorAll('img')
    let videoList = document.querySelectorAll('iframe')
    form.title.value = titleList[id - 1].textContent
    form.artist.value = artistList[id - 1].textContent
    form.image.value = imageList[id - 1].src
    form.video.value = videoList[id - 1].src
}

// edit song
function changeSong(e) {
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
    .then(getSongs())
}

// add likes
function addLike(e) {
    // console.log(e.target.firstElementChild.innerText)
    let likes = e.target.firstElementChild.innerText
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
    fetch("http://localhost:3000/songs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": e.target.title.value,
            "artist": e.target.artist.value,
            "image": e.target.image.value,
            "video": e.target.video.value,
            "likes": 0,
        })
    })
    .then(res => res.json())
    .then(displaySongs)
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
        liList[id - 1].remove()
    })
}