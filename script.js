// Ambil elemen-elemen DOM
const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const startButton = document.getElementById('startButton');
const gameStatus = document.getElementById('gameStatus');

// Variabel Game
let score = 0;
let lastHole;
let timeUp = false; // Status game berjalan
const WIN_SCORE = 20; // <--- DIUBAH MENJADI 20

// --- Fungsi Utilitas ---

// Fungsi untuk mendapatkan waktu acak untuk munculnya tikus
function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// Fungsi untuk memilih lubang acak
function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    // Pastikan tikus tidak muncul di lubang yang sama berturut-turut
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

// --- Logika Game ---

// Fungsi untuk memunculkan tikus
function peep() {
    const time = randomTime(500, 1500); // Tikus muncul antara 0.5s hingga 1.5s
    const hole = randomHole(holes);
    
    // Tampilkan tikus (tambahkan kelas 'up')
    hole.classList.add('up');

    // Buat tikus bersembunyi setelah waktu acak
    const timer = setTimeout(() => {
        hole.classList.remove('up');
        // Lanjutkan memunculkan tikus jika game masih berjalan
        if (!timeUp && score < WIN_SCORE) {
            peep();
        } else if (score >= WIN_SCORE) {
            // Jika skor sudah mencapai target, tidak perlu memunculkan lagi
            gameEnd(true);
        }
    }, time);
}

// Fungsi untuk memukul tikus
function whack(e) {
    // Pastikan hanya merespons klik pada tikus yang sedang 'up'
    if (!this.parentNode.classList.contains('up') || !e.isTrusted) return; 
    
    // 1. Tambah skor
    score++;
    scoreBoard.textContent = score;

    // 2. Sembunyikan tikus dengan cepat
    this.parentNode.classList.remove('up');
    
    // 3. Tambahkan feedback visual (kelas whacked)
    this.parentNode.classList.add('whacked');
    setTimeout(() => {
        this.parentNode.classList.remove('whacked');
    }, 200); // Hapus kelas whacked setelah 200ms

    // 4. Cek kondisi menang
    if (score >= WIN_SCORE) {
        // Hentikan semua tikus yang sedang muncul
        timeUp = true; 
        gameEnd(true);
    }
}

// Fungsi untuk memulai Game
function startGame() {
    // Reset status
    timeUp = false;
    score = 0;
    scoreBoard.textContent = 0;
    gameStatus.classList.add('hidden');
    startButton.disabled = true;

    // Mulai memunculkan tikus
    peep();
    
    // Tambahkan durasi game (misalnya, 30 detik), jika tidak mencapai 20, game over
    const GAME_DURATION_MS = 30000; 

    // Atur timeout untuk mengakhiri game
    setTimeout(() => {
        if (score < WIN_SCORE) {
            timeUp = true; // Hentikan peep() selanjutnya
            gameEnd(false); // Game Over (kalah waktu)
        }
    }, GAME_DURATION_MS);
}

// Fungsi mengakhiri game
function gameEnd(isWin) {
    startButton.disabled = false;
    gameStatus.classList.remove('hidden');
    
    if (isWin) {
        gameStatus.textContent = `SELAMAT! Anda menang dengan skor ${score}! 🎉`;
        gameStatus.className = 'win';
    } else {
        gameStatus.textContent = `Waktu Habis! Skor Anda: ${score}. Coba lagi! 😥`;
        gameStatus.className = '';
    }
}

// Tambahkan event listener ke setiap tikus
holes.forEach(hole => {
    // Target yang diklik adalah .mole (anak dari .hole)
    hole.querySelector('.mole').addEventListener('click', whack);
});

// Awalnya, sembunyikan semua tikus
holes.forEach(hole => hole.classList.remove('up'));