// Campus AI Copilot - Complete Working Version
class CampusAICopilot {
    constructor() {
        this.apiKey = 'AIzaSyCOY9_oie8Ej4w-eyKbawqWKiqwecrIKwo';
        this.conversationHistory = [];
        this.currentTool = 'chat';
        this.courses = [];
        this.timerInterval = null;
        this.timerTime = 25 * 60;
        this.isTimerRunning = false;
        this.messageCount = 0;
        this.studyTime = 135;
        this.gpaChart = null;
        this.progressChart = null;
        
        console.log('🎓 Campus AI Copilot initializing...');
        this.init();
    }

    init() {
        console.log('📋 Starting initialization...');
        this.showLoadingScreen();
        
        // Force initialization after short delay
        setTimeout(() => {
            this.setupApplication();
        }, 100);
    }

    setupApplication() {
        console.log('🔧 Setting up application...');
        this.setupEventListeners();
        this.createParticles();
        this.setupSchedule();
        this.setupLibraryRooms();
        this.startRealTimeUpdates();
        this.updateStats();
        
        // Initialize charts after DOM is ready
        setTimeout(() => {
            this.initializeCharts();
        }, 200);
        
        // Hide loading screen
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 1500);
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainApp = document.getElementById('main-app');
        
        if (loadingScreen) loadingScreen.style.display = 'flex';
        if (mainApp) mainApp.classList.add('hidden');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainApp = document.getElementById('main-app');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                if (mainApp) mainApp.classList.remove('hidden');
                this.showNotification('🎓 Welcome to Campus AI Copilot!', 'success');
            }, 500);
        }
    }

    setupEventListeners() {
        console.log('👂 Setting up event listeners...');
        
        // Wait for DOM to be fully ready
        setTimeout(() => {
            // Navigation
            const navItems = document.querySelectorAll('.nav-item[data-tool]');
            console.log(`Found ${navItems.length} navigation items`);
            
            navItems.forEach((item, index) => {
                const tool = item.getAttribute('data-tool');
                console.log(`Setting up nav item ${index}: ${tool}`);
                
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`🔄 Navigation clicked: ${tool}`);
                    this.switchTool(tool);
                });
            });

            // Chat functionality
            this.setupChatListeners();
            this.setupOtherListeners();
            
        }, 50);
    }

    setupChatListeners() {
        const sendBtn = document.getElementById('send-btn');
        const messageInput = document.getElementById('message-input');
        
        if (sendBtn && messageInput) {
            console.log('💬 Setting up chat listeners...');
            
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📤 Send button clicked');
                this.sendMessage();
            });
            
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    console.log('📤 Enter key pressed');
                    this.sendMessage();
                }
            });

            // Input validation
            messageInput.addEventListener('input', (e) => {
                if (e.target.value.trim()) {
                    sendBtn.disabled = false;
                    sendBtn.style.opacity = '1';
                } else {
                    sendBtn.disabled = true;
                    sendBtn.style.opacity = '0.5';
                }
            });
        } else {
            console.warn('⚠️ Chat elements not found');
        }
    }

    setupOtherListeners() {
        // GPA Calculator
        const addCourseBtn = document.getElementById('add-course');
        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', () => this.addCourse());
        }

        // Timer
        const startTimer = document.getElementById('start-timer');
        const pauseTimer = document.getElementById('pause-timer');
        const resetTimer = document.getElementById('reset-timer');
        
        if (startTimer) startTimer.addEventListener('click', () => this.startTimer());
        if (pauseTimer) pauseTimer.addEventListener('click', () => this.pauseTimer());
        if (resetTimer) resetTimer.addEventListener('click', () => this.resetTimer());

        // Timer presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseInt(e.target.dataset.time);
                this.setTimerPreset(minutes);
            });
        });

        // Other buttons
        const clearChat = document.getElementById('clear-chat');
        const themeToggle = document.getElementById('theme-toggle');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const voiceBtn = document.getElementById('voice-btn');
        const attachBtn = document.getElementById('attach-btn');

        if (clearChat) clearChat.addEventListener('click', () => this.clearChat());
        if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());
        if (sidebarToggle) sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        if (voiceBtn) voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
        if (attachBtn) attachBtn.addEventListener('click', () => this.showFileModal());

        // Modal handling
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });

        this.setupFileDropZone();
    }

    switchTool(toolName) {
        console.log(`🔄 Switching to tool: ${toolName}`);
        
        try {
            // Update navigation active state
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const activeNavItem = document.querySelector(`[data-tool="${toolName}"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('active');
                console.log(`✅ Set active nav: ${toolName}`);
            }

            // Switch tool panels
            document.querySelectorAll('.tool-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            const targetPanel = document.getElementById(`${toolName}-tool`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                console.log(`✅ Activated panel: ${toolName}-tool`);
                this.currentTool = toolName;
                
                // Tool-specific initialization
                setTimeout(() => {
                    if (toolName === 'progress') {
                        this.updateProgressChart();
                    } else if (toolName === 'gpa') {
                        this.calculateGPA();
                    } else if (toolName === 'timer') {
                        this.updateTimerDisplay();
                    }
                }, 100);

                this.showNotification(`🔧 Switched to ${toolName.charAt(0).toUpperCase() + toolName.slice(1)}`, 'success', 2000);
            } else {
                console.error(`❌ Panel not found: ${toolName}-tool`);
                this.showNotification(`⚠️ Tool ${toolName} not available`, 'error');
            }
            
        } catch (error) {
            console.error('Error switching tools:', error);
            this.showNotification('⚠️ Error switching tools', 'error');
        }
    }

    async sendMessage() {
        console.log('📤 Sending message...');
        
        const messageInput = document.getElementById('message-input');
        if (!messageInput) {
            console.error('❌ Message input not found');
            return;
        }
        
        const message = messageInput.value.trim();
        if (!message) {
            console.log('⚠️ Empty message');
            return;
        }

        console.log(`📝 Message: "${message}"`);

        // Add user message
        this.addMessageToChat('user', message);
        messageInput.value = '';
        this.messageCount++;
        this.updateStats();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response with typing effect
            this.addMessageToChat('ai', response, true);
            
            console.log('✅ Message sent and response received');
            
        } catch (error) {
            console.error('❌ Error in sendMessage:', error);
            this.hideTypingIndicator();
            this.addMessageToChat('ai', '🤖 Sorry, I encountered an error. Please try again!');
            this.showNotification('❌ Failed to get AI response', 'error');
        }
    }

   async getAIResponse(message) {
    console.log('🌐 Sending request to Gemini API...');
    
    const apiKey = this.apiKey;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [
            {
                parts: [{ text: message }]
            }
        ]
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data && data.candidates && data.candidates.length > 0) {
            const result = data.candidates[0].content.parts[0].text;
            this.conversationHistory.push({ role: 'user', text: message });
            this.conversationHistory.push({ role: 'ai', text: result });
            return result;
        } else {
            return "❌ Failed to get a valid response from Gemini API.";
        }
    } catch (error) {
        console.error("Gemini API error:", error);
        return "⚠️ Network or server error while getting response.";
    }
}

    addMessageToChat(sender, message, useTypingEffect = false) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

        const content = document.createElement('div');
        content.className = 'message-content';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        content.appendChild(textDiv);
        content.appendChild(timeDiv);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        chatMessages.appendChild(messageDiv);

        if (useTypingEffect && sender === 'ai') {
            this.typeMessage(textDiv, message);
        } else {
            textDiv.textContent = message;
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    typeMessage(element, message, speed = 30) {
        let i = 0;
        element.textContent = '';
        
        const typeInterval = setInterval(() => {
            if (i < message.length) {
                element.textContent += message.charAt(i);
                i++;
                
                // Auto-scroll as text appears
                const chatMessages = document.getElementById('chat-messages');
                if (chatMessages) {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.remove('hidden');
        }
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    // GPA Calculator Functions
    addCourse() {
        const courseName = document.getElementById('course-name');
        const courseCredits = document.getElementById('course-credits');
        const courseGrade = document.getElementById('course-grade');

        if (!courseName || !courseCredits || !courseGrade) {
            this.showNotification('⚠️ Form elements not found', 'error');
            return;
        }

        const name = courseName.value.trim();
        const credits = parseInt(courseCredits.value);
        const grade = parseFloat(courseGrade.value);

        if (!name || !credits || isNaN(grade)) {
            this.showNotification('⚠️ Please fill in all fields correctly', 'warning');
            return;
        }

        const course = { name, credits, grade };
        this.courses.push(course);

        // Clear inputs
        courseName.value = '';
        courseCredits.value = '';
        courseGrade.value = '';

        this.updateCoursesList();
        this.calculateGPA();
        this.showNotification(`✅ Added ${name} successfully!`, 'success');
    }

    updateCoursesList() {
        const coursesList = document.getElementById('courses-list');
        if (!coursesList) return;
        
        coursesList.innerHTML = '';

        this.courses.forEach((course, index) => {
            const courseDiv = document.createElement('div');
            courseDiv.className = 'course-item';
            courseDiv.innerHTML = `
                <div class="course-info">
                    <span class="course-name">${course.name}</span>
                    <span class="course-credits">${course.credits} credits</span>
                    <span class="course-grade">Grade: ${course.grade.toFixed(1)}</span>
                </div>
                <button class="remove-course" onclick="window.campusAI.removeCourse(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            coursesList.appendChild(courseDiv);
        });
    }

    removeCourse(index) {
        this.courses.splice(index, 1);
        this.updateCoursesList();
        this.calculateGPA();
        this.showNotification('🗑️ Course removed', 'info');
    }

    calculateGPA() {
        const currentGPAElement = document.getElementById('current-gpa');
        const totalCreditsElement = document.getElementById('total-credits');
        
        if (this.courses.length === 0) {
            if (currentGPAElement) currentGPAElement.textContent = '0.00';
            if (totalCreditsElement) totalCreditsElement.textContent = '0';
            return;
        }

        const totalPoints = this.courses.reduce((sum, course) => sum + (course.grade * course.credits), 0);
        const totalCredits = this.courses.reduce((sum, course) => sum + course.credits, 0);
        const gpa = totalPoints / totalCredits;

        if (currentGPAElement) currentGPAElement.textContent = gpa.toFixed(2);
        if (totalCreditsElement) totalCreditsElement.textContent = totalCredits.toString();

        this.updateGPAChart(gpa);
    }

    updateGPAChart(currentGPA) {
        const canvas = document.getElementById('gpa-chart');
        if (!canvas || !window.Chart) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.gpaChart) {
            this.gpaChart.destroy();
        }

        this.gpaChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Current GPA', 'Remaining'],
                datasets: [{
                    data: [currentGPA, Math.max(0, 4.0 - currentGPA)],
                    backgroundColor: ['#1FB8CD', '#ECEBD5'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Timer Functions
    startTimer() {
        if (!this.isTimerRunning) {
            this.isTimerRunning = true;
            this.timerInterval = setInterval(() => {
                this.timerTime--;
                this.updateTimerDisplay();
                
                if (this.timerTime <= 0) {
                    this.timerComplete();
                }
            }, 1000);
            
            const startBtn = document.getElementById('start-timer');
            if (startBtn) startBtn.textContent = 'Pause';
            this.showNotification('⏱️ Timer started!', 'success');
        } else {
            this.pauseTimer();
        }
    }

    pauseTimer() {
        if (this.isTimerRunning) {
            this.isTimerRunning = false;
            clearInterval(this.timerInterval);
            const startBtn = document.getElementById('start-timer');
            if (startBtn) startBtn.textContent = 'Resume';
            this.showNotification('⏸️ Timer paused', 'info');
        }
    }

    resetTimer() {
        this.isTimerRunning = false;
        clearInterval(this.timerInterval);
        this.timerTime = 25 * 60;
        this.updateTimerDisplay();
        const startBtn = document.getElementById('start-timer');
        if (startBtn) startBtn.textContent = 'Start';
        this.showNotification('🔄 Timer reset', 'info');
    }

    setTimerPreset(minutes) {
        this.resetTimer();
        this.timerTime = minutes * 60;
        this.updateTimerDisplay();
        this.showNotification(`⏱️ Timer set to ${minutes} minutes`, 'info');
    }

    updateTimerDisplay() {
        const displayElement = document.querySelector('#timer-display .time-remaining');
        if (displayElement) {
            const minutes = Math.floor(this.timerTime / 60);
            const seconds = this.timerTime % 60;
            const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            displayElement.textContent = display;
        }
    }

    timerComplete() {
        this.resetTimer();
        this.showNotification('🎉 Time\'s up! Great job studying!', 'success');
        this.studyTime += 25;
        this.updateStats();
    }

    // Chart and UI Functions
    initializeCharts() {
        if (window.Chart) {
            setTimeout(() => {
                this.updateProgressChart();
                if (this.courses.length > 0) {
                    this.calculateGPA();
                }
            }, 100);
        }
    }

    updateProgressChart() {
        const canvas = document.getElementById('progress-chart');
        if (!canvas || !window.Chart) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.progressChart) {
            this.progressChart.destroy();
        }

        this.progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Study Hours',
                    data: [2, 3, 1, 4, 2.5, 1.5, 3],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    setupSchedule() {
        const scheduleGrid = document.getElementById('schedule-grid');
        if (!scheduleGrid) return;
        
        const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
        const days = ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        scheduleGrid.innerHTML = '';
        
        // Add day headers
        days.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.className = day === 'Time' ? 'time-slot' : 'day-header';
            dayDiv.textContent = day;
            scheduleGrid.appendChild(dayDiv);
        });

        // Add schedule content
        timeSlots.forEach((time, timeIndex) => {
            const timeDiv = document.createElement('div');
            timeDiv.className = 'time-slot';
            timeDiv.textContent = time;
            scheduleGrid.appendChild(timeDiv);
            
            for (let day = 1; day < days.length; day++) {
                const classDiv = document.createElement('div');
                classDiv.className = 'class-slot';
                
                if ((timeIndex === 1 && day === 1) || (timeIndex === 3 && day === 3) || (timeIndex === 2 && day === 5)) {
                    classDiv.classList.add('has-class');
                    if (timeIndex === 1) classDiv.innerHTML = 'CS 101<br>Room A12';
                    else if (timeIndex === 3) classDiv.innerHTML = 'Math 201<br>Room B45';
                    else classDiv.innerHTML = 'Physics<br>Lab C3';
                }
                
                scheduleGrid.appendChild(classDiv);
            }
        });
    }

    setupLibraryRooms() {
        const roomsGrid = document.getElementById('study-rooms');
        if (!roomsGrid) return;
        
        const rooms = [
            { name: 'Study Room A', status: 'available' },
            { name: 'Study Room B', status: 'occupied' },
            { name: 'Study Room C', status: 'available' },
            { name: 'Group Room 1', status: 'available' },
            { name: 'Group Room 2', status: 'occupied' },
            { name: 'Quiet Zone', status: 'available' }
        ];

        roomsGrid.innerHTML = '';

        rooms.forEach(room => {
            const roomDiv = document.createElement('div');
            roomDiv.className = `room-card ${room.status}`;
            roomDiv.innerHTML = `
                <div class="room-name">${room.name}</div>
                <div class="room-status ${room.status}">${room.status}</div>
            `;
            roomsGrid.appendChild(roomDiv);
        });
    }

    startRealTimeUpdates() {
        // Update weather
        setInterval(() => {
            const weatherWidget = document.getElementById('weather-widget');
            if (weatherWidget) {
                const temps = ['68°F', '72°F', '75°F', '69°F', '73°F', '71°F'];
                const temp = temps[Math.floor(Math.random() * temps.length)];
                const span = weatherWidget.querySelector('span');
                if (span) span.textContent = temp;
            }
        }, 30000);

        // Update status indicator
        setInterval(() => {
            const statusDot = document.querySelector('.status-dot');
            const statusText = document.querySelector('.status-indicator span');
            
            if (statusDot && statusText) {
                const statuses = [
                    { class: 'online', text: 'Online' },
                    { class: 'processing', text: 'Processing' },
                    { class: 'online', text: 'Online' }
                ];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                
                statusDot.className = `status-dot ${status.class}`;
                statusText.textContent = status.text;
            }
        }, 8000);

        // Create particles periodically
        setInterval(() => {
            this.createParticle(document.getElementById('particles'));
        }, 3000);
    }

    updateStats() {
        const studyTimeElement = document.getElementById('study-time');
        const messageCountElement = document.getElementById('message-count');
        
        if (studyTimeElement) {
            const hours = Math.floor(this.studyTime / 60);
            const minutes = this.studyTime % 60;
            studyTimeElement.textContent = `${hours}h ${minutes}m`;
        }
        
        if (messageCountElement) {
            messageCountElement.textContent = this.messageCount.toString();
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notificationsContainer = document.getElementById('notifications');
        if (!notificationsContainer) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<div>${message}</div>`;

        notificationsContainer.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notificationsContainer.contains(notification)) {
                    notificationsContainer.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                this.createParticle(particlesContainer);
            }, i * 400);
        }
    }

    createParticle(container) {
        if (!container) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 8 + 12) + 's';
        particle.style.opacity = Math.random() * 0.4 + 0.2;
        
        container.appendChild(particle);

        setTimeout(() => {
            if (container.contains(particle)) {
                container.removeChild(particle);
            }
        }, 20000);
    }

    // Additional utility functions
    clearChat() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="message ai-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-text">
                            Hello! I'm your Campus AI Copilot. I can help you with academics, campus information, study planning, and much more. What would you like to know?
                        </div>
                        <div class="message-time">Just now</div>
                    </div>
                </div>
            `;
        }
        this.conversationHistory = [];
        this.messageCount = 0;
        this.updateStats();
        this.showNotification('🧹 Chat cleared', 'info');
    }

    toggleVoiceInput() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            this.showNotification('🎤 Listening...', 'info');

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const messageInput = document.getElementById('message-input');
                if (messageInput) {
                    messageInput.value = transcript;
                }
                this.showNotification('✅ Voice input captured', 'success');
            };

            recognition.onerror = () => {
                this.showNotification('❌ Voice input failed', 'error');
            };

            recognition.start();
        } else {
            this.showNotification('⚠️ Voice input not supported', 'warning');
        }
    }

    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        
        if (body.dataset.colorScheme === 'dark') {
            body.dataset.colorScheme = 'light';
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            this.showNotification('☀️ Light mode activated', 'info');
        } else {
            body.dataset.colorScheme = 'dark';
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            this.showNotification('🌙 Dark mode activated', 'info');
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    }

    showFileModal() {
        const modal = document.getElementById('file-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    setupFileDropZone() {
        const dropZone = document.getElementById('file-drop-zone');
        const fileInput = document.getElementById('file-input');

        if (dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());
            
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                this.handleFiles(e.dataTransfer.files);
            });

            fileInput.addEventListener('change', (e) => {
                this.handleFiles(e.target.files);
            });
        }
    }

    handleFiles(files) {
        Array.from(files).forEach(file => {
            this.showNotification(`📎 Uploaded: ${file.name}`, 'success');
        });
        const modal = document.getElementById('file-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
}

// Initialize application
function initializeApp() {
    console.log('🚀 Initializing Campus AI Copilot...');
    
    if (typeof window.campusAI === 'undefined') {
        window.campusAI = new CampusAICopilot();
        console.log('✅ Campus AI Copilot initialized successfully!');
    }
}

// Multiple initialization approaches for reliability
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Additional setup after page load
window.addEventListener('load', () => {
    if (!window.campusAI) {
        initializeApp();
    }
});

// Request notification permission
if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
}

console.log('🎓 Campus AI Copilot script loaded successfully!');