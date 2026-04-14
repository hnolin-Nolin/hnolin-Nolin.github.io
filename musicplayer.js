document.addEventListener('DOMContentLoaded', function() {
    // Music player functionality
    var audio = document.getElementById('audio');
    var playBtn = document.getElementById('play');
    var pauseBtn = document.getElementById('pause');
    var stopBtn = document.getElementById('stop');
    var progress = document.getElementById('progress-bar');
    var progressFill = document.getElementById('progress-fill');
    var currentTime = document.getElementById('currentTime');
    var totalTime = document.getElementById('totalTime');
    var songSelect = document.getElementById('songSelect');
    var volume = document.getElementById('volume');

    var songs = ['assets/audio/internet hub.mp3', 'assets/audio/dit 26-2-24.mp3'];
    var defaultSong = 'assets/audio/internet hub.mp3';

    // Populate song select
    songs.forEach(function(song) {
        var option = document.createElement('option');
        option.value = song;
        option.textContent = song.split('/').pop().replace('.mp3', '');
        songSelect.appendChild(option);
    });

    // Set default song
    songSelect.value = defaultSong;

    // Load default song
    audio.src = defaultSong;
    audio.load();
    audio.volume = 0.5;

    function formatTime(seconds) {
        var min = Math.floor(seconds / 60);
        var sec = Math.floor(seconds % 60);
        return min + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function updateTimeDisplay() {
        currentTime.textContent = formatTime(audio.currentTime);
        totalTime.textContent = formatTime(audio.duration || 0);
    }

    /*
    // Playback lifecycle
    audio.addEventListener('canplaythrough', function() {
        audio.play().catch(function(e) {
            console.log('Auto-play blocked:', e);
        });
    });

    audio.addEventListener('ended', function() {
        audio.play();
    });

    */

    // Transport controls
    playBtn.addEventListener('click', function() {
        audio.play();
    });

    pauseBtn.addEventListener('click', function() {
        audio.pause();
    });

    stopBtn.addEventListener('click', function() {
        audio.pause();
        audio.currentTime = 0;
        progressFill.style.width = '0%';
        updateTimeDisplay();
    });

    // Progress bar updates & seeking
    audio.addEventListener('timeupdate', function() {
        if (audio.duration) {
            progressFill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
            updateTimeDisplay();
        }
    });

    progress.addEventListener('click', function(e) {
        var rect = progress.getBoundingClientRect();
        var clickX = e.clientX - rect.left;
        var width = rect.width;
        var percent = clickX / width;
        audio.currentTime = percent * audio.duration;
        updateTimeDisplay();
    });

    // Song selection and volume
    songSelect.addEventListener('change', function() {
        if (songSelect.value) {
            audio.src = songSelect.value;
            audio.load();
            audio.play();
        }
    });

    volume.addEventListener('input', function() {
        audio.volume = volume.value / 100;
    });
});