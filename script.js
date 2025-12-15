// --- Timer Variables ---
let timerInterval = null;
let beepInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function increaseTimer() {
    if (!isTimerRunning) {
        timerSeconds += 10;
        updateTimerDisplay();
    }
}

function decreaseTimer() {
    if (!isTimerRunning && timerSeconds > 0) {
        timerSeconds -= 10;
        updateTimerDisplay();
    }
}

function resetTimerValue() {
    if (!isTimerRunning) {
        timerSeconds = 0;
        updateTimerDisplay();
    }
}

function toggleTimer() {
    const btn = document.getElementById('startTimerBtn');

    if (isTimerRunning) {
        // Stop timer or stop beeping
        clearInterval(timerInterval);
        clearInterval(beepInterval);
        isTimerRunning = false;
        btn.textContent = 'ابدأ';
        btn.classList.remove('running');
    } else {
        // Start timer
        if (timerSeconds === 0) return;

        isTimerRunning = true;
        btn.textContent = 'إيقاف';
        btn.classList.add('running');

        timerInterval = setInterval(() => {
            if (timerSeconds > 0) {
                timerSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isTimerRunning = true; // Keep running flag true for beeping
                // Start continuous beeping
                beepInterval = setInterval(() => {
                    playTimerAlert();
                }, 1000);
            }
        }, 1000);
    }
}

function playTimerAlert() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch(e) {
        console.log('Audio not available');
    }
}

function goTimer() {
    document.getElementById('sideMenu').classList.remove('active');
    document.getElementById('home-section').classList.add('hidden');
    document.getElementById('workout-section').classList.add('hidden');
    document.getElementById('timer-section').classList.remove('hidden');
    document.getElementById('champions-section').classList.add('hidden');
    timerSeconds = 0;
    updateTimerDisplay();
}

// --- Gym Data (Chest Only) ---
const gymData = {
    chest: {
        name: "الصدر",
        angles: [
            { 
                id: "upper_chest", 
                name: "الصدر العلوي", 
                exercises: [
                    { name: "Incline Barbell Press (بار عالي)", image: "https://www.endomondo.com/wp-content/uploads/2024/10/Incline-Barbell-Bench-Press-Guide.png" },
                    { name: "Incline Dumbbell Press (دامبل عالي)", image: "https://apilyfta.com/static/GymvisualPNG/03141101-Dumbbell-Incline-Bench-Press_Chest_small.png" },
                    { name: "Smith Machine Incline (سميث عالي)", image: "https://lyfta.app/images/exercises/00471101.png" }
                ] 
            },
            { 
                id: "mid_chest", 
                name: "الصدر المستوي",
                exercises: [
                    { name: "Flat Barbell Press (بار مستوي)", image: "https://www.endomondo.com/wp-content/uploads/2024/06/Barbell-Bench-Press_final.png" },
                    { name: "Flat Dumbbell Press (دامبل مستوي)", image: "https://apilyfta.com/static/GymvisualPNG/03521101-Dumbbell-Neutral-Grip-Bench-Press_Upper-Arms_small.png" },
                    { name: "Chest Press Machine (جهاز الصدر)", image: "https://lyfta.app/images/exercises/05761101.png" },
                    { name: "Push Ups (ضغط)", image: "https://www.inspireusafoundation.org/wp-content/uploads/2023/02/negative-push-up-starting-position-2048x1673.png" }
                ] 
            },
            { 
                id: "lower_chest", 
                name: "الصدر السفلي", 
                exercises: [
                    { name: "Dips (متوازي)", image: "https://www.inspireusafoundation.org/wp-content/uploads/2023/01/dip-shoulder-joint-1701x2048.png" },
                    { name: "High-to-Low Cable (كابل كروس)", image: "https://www.bosshunting.com.au/wp-content/uploads/2022/09/Cable-Crossover.png" },
                ] 
            },
            {
                id: "chest_fly",
                name: "عزل وتفتيح",
                exercises: [
                    { name: "Pec Deck Machine (فراشة)", image: "https://lyfta.app/images/exercises/05961101.png" },
                    { name: "Dumbbell Flys (تفتيح دامبل)", image: "https://lyfta.app/images/exercises/12861101.png" }
                ]
            }
        ]
    }
};

// --- Navigation Functions ---
function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('active');
}

// --- Exercise Management Logic ---
function loadAngles() {
    const select = document.getElementById('muscleSelect');
    const key = select.value;
    const area = document.getElementById('anglesArea');
    const btnsContainer = document.getElementById('anglesButtons');

    btnsContainer.innerHTML = '';

    if (key === 'chest') {
        area.classList.remove('hidden');
        gymData.chest.angles.forEach(angle => {
            const btn = document.createElement('button');
            btn.className = 'target-btn';
            btn.innerText = `+ ${angle.name}`;
            btn.onclick = () => addCard(angle);
            btnsContainer.appendChild(btn);
        });
    }
}

function addCard(angleObj) {
    const list = document.getElementById('routineList');
    document.getElementById('emptyMsg').style.display = 'none';

    const uniqueId = 'card_' + Math.random().toString(36).substr(2, 9);

    let exercisesHTML = '';
    angleObj.exercises.forEach(ex => {
        const exName = typeof ex === 'string' ? ex : ex.name;
        const exImage = typeof ex === 'string' ? '' : ex.image;
        exercisesHTML += `
            <label class="radio-label" data-exercise="${uniqueId}">
                <input type="radio" name="${uniqueId}" value="${exName}">
                ${exImage ? `<img src="${exImage}" alt="${exName}" style="width: 50px; height: 50px; border-radius: 4px; margin-left: 10px;">` : ''}
                <span>${exName}</span>
            </label>
        `;
    });

    const card = document.createElement('div');
    card.className = 'workout-card';
    card.innerHTML = `
        <div class="card-header">
            <div style="display:flex; align-items:center;">
                <span class="drag-handle">⋮⋮</span>
                <span class="angle-name">${angleObj.name}</span>
            </div>
            <button class="delete-btn" onclick="removeCard(this)">حذف</button>
        </div>
        <div class="exercise-options">
            ${exercisesHTML}
        </div>
    `;

    list.appendChild(card);
    
    const radioInputs = card.querySelectorAll(`input[name="${uniqueId}"]`);
    radioInputs.forEach(input => {
        input.addEventListener('change', function() {
            const labels = card.querySelectorAll(`[data-exercise="${uniqueId}"]`);
            labels.forEach(label => {
                if (label.querySelector('input') !== this) {
                    label.classList.add('hidden-exercise');
                } else {
                    label.classList.remove('hidden-exercise');
                }
            });
        });
    });
}

function removeCard(btn) {
    btn.closest('.workout-card').remove();
    if (document.getElementById('routineList').children.length <= 1) {
        document.getElementById('emptyMsg').style.display = 'block';
    }
}

// --- Drag and Drop Functionality ---
document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('routineList');
    new Sortable(list, {
        animation: 150,
        handle: '.card-header',
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        delay: 100,
        delayOnTouchOnly: true
    });
});
function goChampions() {
    document.getElementById('sideMenu').classList.remove('active');
    
    // إخفاء كل الأقسام
    document.getElementById('home-section').classList.add('hidden');
    document.getElementById('workout-section').classList.add('hidden');
    document.getElementById('timer-section').classList.add('hidden');
    
    // إظهار قسم الأبطال
    document.getElementById('champions-section').classList.remove('hidden');
}
// Helper to hide all sections
function hideAllSections() {
    const sections = [
        'home-section',
        'workout-section',
        'timer-section',
        'champions-section',
        'shorts-section',
        'supplements-section'
    ];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    document.getElementById('sideMenu').classList.remove('active');
}

function goHome() {
    hideAllSections();
    document.getElementById('home-section').classList.remove('hidden');
}

function goWorkout() {
    hideAllSections();
    document.getElementById('workout-section').classList.remove('hidden');
}

function goTimer() {
    hideAllSections();
    document.getElementById('timer-section').classList.remove('hidden');
    timerSeconds = 0;
    updateTimerDisplay();
}

function goChampions() {
    hideAllSections();
    document.getElementById('champions-section').classList.remove('hidden');
}

function goShorts() {
    hideAllSections();
    document.getElementById('shorts-section').classList.remove('hidden');
}

function goSupplements() {
    hideAllSections();
    document.getElementById('supplements-section').classList.remove('hidden');
}
