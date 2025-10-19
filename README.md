# 🍅 Pomodoro Timer Web App

A beautiful and functional Pomodoro timer web application built with vanilla HTML, CSS, and JavaScript.

## Features

### ⏰ Timer Functionality
- **25-minute work sessions** with 5-minute short breaks and 15-minute long breaks
- **Visual progress indicator** with animated circular timer
- **Start, pause, and reset** controls
- **Automatic session switching** (work → break → work)
- **Keyboard shortcuts** (Spacebar to start/pause)

### 🎨 Beautiful UI/UX
- **Modern gradient design** with smooth animations
- **Responsive layout** that works on all devices
- **Interactive visual feedback** with pulsing animations during active sessions
- **Color-coded sessions** (red for work, blue for breaks)

### 📊 Progress Tracking
- **Session counter** - track completed Pomodoro sessions
- **Total focus time** - see your accumulated work time
- **Current streak** - monitor consecutive sessions
- **Persistent data** - stats saved in browser storage

### ⚙️ Customizable Settings
- **Adjustable durations** for work, short break, and long break
- **Sound notifications** toggle
- **Automatic session progression** with smart break selection

### 🔔 Notifications
- **Browser notifications** when sessions complete
- **Audio alerts** with synthesized notification sounds
- **Visual notifications** with slide-in messages

## How to Use

1. **Open** `index.html` in your web browser
2. **Click Start** to begin a 25-minute work session
3. **Focus on your task** until the timer completes
4. **Take a break** when prompted (short break after work sessions)
5. **Repeat** the cycle to maintain productivity

### Keyboard Shortcuts
- **Spacebar**: Start/Pause timer

## File Structure

```
pomodoroTimer/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and animations
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Technical Features

- **Vanilla JavaScript** - No external dependencies
- **Local Storage** - Persistent settings and statistics
- **Web Audio API** - Custom notification sounds
- **CSS Grid & Flexbox** - Responsive layout
- **CSS Custom Properties** - Easy theme customization
- **Progressive Enhancement** - Graceful fallbacks

## Browser Compatibility

Works in all modern browsers that support:
- ES6 Classes
- Local Storage
- Web Audio API (for sounds)
- CSS Grid & Flexbox

## Customization

You can easily customize the timer by modifying the settings in the UI or by editing the default values in `script.js`:

```javascript
this.settings = {
    work: 25,           // Work session duration (minutes)
    shortBreak: 5,      // Short break duration (minutes)
    longBreak: 15,      // Long break duration (minutes)
    soundEnabled: true  // Enable/disable sound notifications
};
```

## The Pomodoro Technique

The Pomodoro Technique is a time management method developed by Francesco Cirillo:

1. **Work** for 25 minutes on a single task
2. **Take a 5-minute break**
3. **Repeat** for 4 cycles
4. **Take a longer 15-30 minute break**

This technique helps improve focus, reduce mental fatigue, and boost productivity.

## License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ for better productivity