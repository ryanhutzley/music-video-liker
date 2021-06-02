// get elements
const bestSong = document.querySelector('#best-song')
const songList = document.querySelector('#song-list')

// get songs
function getSongs() {
    fetch("https://localhost3000/songs")
    .then(res => res.json())
    .then(displaySongs)
}

// display songs
function displaySongs() {}
