class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentSession = 'work';
        this.timeRemaining = 25 * 60; // 25 minutes in seconds
        this.interval = null;
        
        // Settings
        this.settings = {
            work: 25,
            shortBreak: 5,
            longBreak: 15,
            soundEnabled: true
        };

        // Stats
        this.stats = {
            completedSessions: 0,
            totalFocusTime: 0,
            currentStreak: 0
        };

        // Load saved data
        this.loadData();

        // Initialize DOM elements
        this.initializeElements();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update display
        this.updateDisplay();
        this.updateStats();
    }

    initializeElements() {
        this.timeText = document.getElementById('timeText');
        this.sessionType = document.getElementById('sessionType');
        this.timeCircle = document.getElementById('timeCircle');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.sessionButtons = document.querySelectorAll('.session-btn');
        
        // Settings elements
        this.workDurationInput = document.getElementById('workDuration');
        this.shortBreakDurationInput = document.getElementById('shortBreakDuration');
        this.longBreakDurationInput = document.getElementById('longBreakDuration');
        this.soundEnabledInput = document.getElementById('soundEnabled');
        
        // Stats elements
        this.completedSessionsElement = document.getElementById('completedSessions');
        this.totalTimeElement = document.getElementById('totalTime');
        this.currentStreakElement = document.getElementById('currentStreak');
        
        // Audio element
        this.notificationSound = document.getElementById('notificationSound');
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.sessionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sessionType = e.target.dataset.type;
                this.switchSession(sessionType);
            });
        });

        // Settings listeners
        this.workDurationInput.addEventListener('change', () => {
            this.settings.work = parseInt(this.workDurationInput.value);
            if (this.currentSession === 'work' && !this.isRunning) {
                this.timeRemaining = this.settings.work * 60;
                this.updateDisplay();
            }
            this.saveData();
        });

        this.shortBreakDurationInput.addEventListener('change', () => {
            this.settings.shortBreak = parseInt(this.shortBreakDurationInput.value);
            if (this.currentSession === 'short-break' && !this.isRunning) {
                this.timeRemaining = this.settings.shortBreak * 60;
                this.updateDisplay();
            }
            this.saveData();
        });

        this.longBreakDurationInput.addEventListener('change', () => {
            this.settings.longBreak = parseInt(this.longBreakDurationInput.value);
            if (this.currentSession === 'long-break' && !this.isRunning) {
                this.timeRemaining = this.settings.longBreak * 60;
                this.updateDisplay();
            }
            this.saveData();
        });

        this.soundEnabledInput.addEventListener('change', () => {
            this.settings.soundEnabled = this.soundEnabledInput.checked;
            this.saveData();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input')) {
                e.preventDefault();
                if (this.isRunning) {
                    this.pause();
                } else {
                    this.start();
                }
            }
        });
    }

    start() {
        if (this.isPaused) {
            this.isPaused = false;
        }
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        this.timeCircle.classList.add('running');
        
        this.interval = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();
            
            if (this.timeRemaining <= 0) {
                this.completeSession();
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        this.isPaused = true;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        this.timeCircle.classList.remove('running');
        
        clearInterval(this.interval);
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        this.timeCircle.classList.remove('running');
        
        clearInterval(this.interval);
        
        // Reset time based on current session
        this.setTimeForSession(this.currentSession);
        this.updateDisplay();
    }

    completeSession() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        this.timeCircle.classList.remove('running');
        
        clearInterval(this.interval);
        
        // Update stats
        if (this.currentSession === 'work') {
            this.stats.completedSessions++;
            this.stats.totalFocusTime += this.settings.work;
            this.stats.currentStreak++;
        }
        
        // Play notification sound
        if (this.settings.soundEnabled) {
            this.playNotificationSound();
        }
        
        // Show notification
        this.showNotification();
        
        // Auto-switch to next session
        this.autoSwitchSession();
        
        this.updateStats();
        this.saveData();
    }

    switchSession(sessionType) {
        if (this.isRunning) return;
        
        // Update active button
        this.sessionButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-type="${sessionType}"]`).classList.add('active');
        
        this.currentSession = sessionType;
        this.setTimeForSession(sessionType);
        this.updateDisplay();
        this.updateCircleColor();
    }

    setTimeForSession(sessionType) {
        switch (sessionType) {
            case 'work':
                this.timeRemaining = this.settings.work * 60;
                break;
            case 'short-break':
                this.timeRemaining = this.settings.shortBreak * 60;
                break;
            case 'long-break':
                this.timeRemaining = this.settings.longBreak * 60;
                break;
        }
    }

    autoSwitchSession() {
        // Simple logic: work -> short break, break -> work
        // Every 4th session, use long break instead of short break
        if (this.currentSession === 'work') {
            const nextSession = (this.stats.completedSessions % 4 === 0) ? 'long-break' : 'short-break';
            this.switchSession(nextSession);
        } else {
            this.switchSession('work');
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        
        this.timeText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update session type display
        const sessionNames = {
            work: 'Work',
            'short-break': 'Short Break',
            'long-break': 'Long Break'
        };
        this.sessionType.textContent = sessionNames[this.currentSession];
        
        // Update progress circle
        this.updateProgressCircle();
        
        // Update page title
        document.title = `${this.timeText.textContent} - ${sessionNames[this.currentSession]} | Pomodoro Timer`;
    }

    updateProgressCircle() {
        const totalTime = this.getTotalTimeForSession(this.currentSession);
        const elapsed = totalTime - this.timeRemaining;
        const percentage = (elapsed / totalTime) * 360;
        
        const color = this.currentSession === 'work' ? 'var(--primary-color)' : 'var(--secondary-color)';
        this.timeCircle.style.background = `conic-gradient(${color} ${percentage}deg, #f0f0f0 ${percentage}deg)`;
    }

    updateCircleColor() {
        if (this.currentSession === 'work') {
            this.timeCircle.classList.remove('break');
        } else {
            this.timeCircle.classList.add('break');
        }
    }

    getTotalTimeForSession(sessionType) {
        switch (sessionType) {
            case 'work':
                return this.settings.work * 60;
            case 'short-break':
                return this.settings.shortBreak * 60;
            case 'long-break':
                return this.settings.longBreak * 60;
            default:
                return 25 * 60;
        }
    }

    updateStats() {
        this.completedSessionsElement.textContent = this.stats.completedSessions;
        
        const hours = Math.floor(this.stats.totalFocusTime / 60);
        const minutes = this.stats.totalFocusTime % 60;
        this.totalTimeElement.textContent = `${hours}h ${minutes}m`;
        
        this.currentStreakElement.textContent = this.stats.currentStreak;
    }

    playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (error) {
            console.log('Could not play notification sound:', error);
        }
    }

    showNotification() {
        // Check if browser supports notifications
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                const sessionNames = {
                    work: 'Work session',
                    'short-break': 'Short break',
                    'long-break': 'Long break'
                };
                
                new Notification('Pomodoro Timer', {
                    body: `${sessionNames[this.currentSession]} completed!`,
                    icon: '🍅'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        this.showNotification();
                    }
                });
            }
        }
        
        // Show in-app notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = `${this.currentSession === 'work' ? 'Work session' : 'Break'} completed!`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    saveData() {
        const data = {
            settings: this.settings,
            stats: this.stats
        };
        localStorage.setItem('pomodoroData', JSON.stringify(data));
    }

    loadData() {
        const savedData = localStorage.getItem('pomodoroData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.settings = { ...this.settings, ...data.settings };
            this.stats = { ...this.stats, ...data.stats };
        }
        
        // Update input values
        setTimeout(() => {
            if (this.workDurationInput) this.workDurationInput.value = this.settings.work;
            if (this.shortBreakDurationInput) this.shortBreakDurationInput.value = this.settings.shortBreak;
            if (this.longBreakDurationInput) this.longBreakDurationInput.value = this.settings.longBreak;
            if (this.soundEnabledInput) this.soundEnabledInput.checked = this.settings.soundEnabled;
        }, 0);
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
    
    // Request notification permission on first load
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});