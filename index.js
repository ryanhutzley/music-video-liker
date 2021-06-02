// get elements
const bestSong = document.querySelector('#best-song')
const songList = document.querySelector('#song-list')
const addSong = document.querySelector('#add-song')

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
    // add event listeners
    likesBtn.addEventListener('click', addLike)
    editBtn
    // append to DOM
    likesBtn.append(likeCount)
    li.append(img, video, title, artist, likesBtn, editBtn, deleteBtn)
    songList.append(li)
}
