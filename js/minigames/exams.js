window.examData = {
            totalScore: 0,
            isFinal: false,
            questionCount: 0
        };

        window.startExam = function(isFinal) {
            // Check Energy
            if (state.energy < 40) {
                 window.queueModal("Too Tired", "Exams take 40 Energy. You need to sleep or eat.", "Okay", "💤");
                 return;
            }

            state.energy -= 40;
            state.dayStats.energy -= 40;
            state.hasAttendedSchoolToday = true;

            // Init Exam
            window.examData = {
                totalScore: 0, // Max possible ~10 (5 from quiz, 5 from typing)
                isFinal: isFinal,
                questionCount: 0
            };

            // Start Quiz Loop
            window.triggerExamQuiz();
        };

        window.triggerExamQuiz = function() {
            if (window.examData.questionCount >= 5) {
                // Quizzes done, start Typing Game
                window.queueModal(
                    "PART 2: THE ESSAY", 
                    "You survived the multiple choice. Now you have to write the essay. <br><br><strong>Type the falling words before they hit the bottom!</strong>", 
                    "Start Typing", 
                    "⌨️", 
                    () => window.startTypingGame()
                );
                return;
            }

            const quiz = window.SCHOOL_QUIZ_BANK[Math.floor(Math.random() * window.SCHOOL_QUIZ_BANK.length)];
            const choices = quiz.choices.map((c, i) => ({
                label: c,
                action: () => {
                    if (i === quiz.correct) window.examData.totalScore += 1;
                    window.examData.questionCount++;
                    setTimeout(window.triggerExamQuiz, 200);
                }
            }));

            window.queueChoiceModal(
                `QUESTION ${window.examData.questionCount + 1}/5`, 
                quiz.q, 
                "📝", 
                choices, 
                window.examData.isFinal ? "FINAL EXAM" : "MIDTERM"
            );
        };

        // Temp storage for quiz chain
        window.schoolQuizState = { score: 0, step: 0, max: 1 };

        window.triggerSchoolQuiz = function() {
            const hasAcademy = !!state.academy;
            const apCount = state.apClasses ? state.apClasses.length : 0;
            
            // Total Steps: 1 (Gen) + 1 (Academy) + N (APs)
            const totalSteps = 1 + (hasAcademy ? 1 : 0) + apCount;

            window.schoolQuizState = { 
                score: 0, 
                step: 0, 
                max: totalSteps 
            };
            
            window.nextSchoolQuestion();
        };

        window.nextSchoolQuestion = function() {
            const currentStep = window.schoolQuizState.step;
            const hasAcademy = !!state.academy;
            
            let pool = window.SCHOOL_QUIZ_BANK;
            let title = "POP QUIZ";
            
            // Step 0: General
            // Step 1: Academy (if exists)
            // Step 2+: APs

            if (hasAcademy && currentStep === 1) {
                pool = window.ACADEMY_QUESTIONS[state.academy];
                title = `${window.ACADEMIES[state.academy].name.toUpperCase()}`;
            } else if (currentStep >= (hasAcademy ? 2 : 1)) {
                // Determine which AP class this is
                // If academy exists, AP index starts at step 2 (0, 1, [2, 3])
                // If no academy, AP index starts at step 1 (0, [1, 2])
                const apIndex = currentStep - (hasAcademy ? 2 : 1);
                const apId = state.apClasses[apIndex];
                
                if (apId) {
                    pool = window.AP_QUESTIONS[apId];
                    // Fallback to generic if pool empty (dev safety)
                    if(!pool) pool = window.SCHOOL_QUIZ_BANK;
                    title = window.AP_CLASSES[apId].name.toUpperCase();
                }
            }
            
            if (!pool || pool.length === 0) pool = window.SCHOOL_QUIZ_BANK;
            const quiz = pool[Math.floor(Math.random() * pool.length)];
            const hasStudyHero = state.subscriptions.includes('studyhero');
            
            // Logic to identify a wrong answer to remove
            let removedIndex = -1;
            if (hasStudyHero) {
                // Find all indices that are NOT the correct one
                const wrongIndices = [0, 1, 2].filter(i => i !== quiz.correct);
                // Pick one randomly
                removedIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
            }

            const choices = quiz.choices.map((c, i) => {
                // Modified mapping for StudyHero
                if (i === removedIndex) {
                    return {
                        label: `<span class="line-through opacity-50">${c}</span> <span class="text-xs text-acs-gold ml-2">❌ Removed</span>`,
                        action: () => {} // Do nothing if clicked (or handle as blocked)
                    };
                }
                
                return {
                    label: c,
                    action: () => {
                        if (i === quiz.correct) window.schoolQuizState.score++;
                        window.schoolQuizState.step++;
                        
                        if (window.schoolQuizState.step < window.schoolQuizState.max) {
                            setTimeout(window.nextSchoolQuestion, 300);
                        } else {
                            window.finishSchool();
                        }
                    }
                };
            });

            window.queueChoiceModal(title, quiz.q, "🏫", choices, "ACADEMICS");
        };

        window.finishSchool = function() {
            const score = window.schoolQuizState.score;
            const max = window.schoolQuizState.max;
            const pct = score / max;
            
            let totalGradeChange = 0;
            let status = "";
            let statusIcon = "";
            let statusColor = "";

            if (pct >= 0.99) { // 100%
                totalGradeChange = 5 + (max * 1); // Bonus for harder schedule
                status = "ACED"; statusIcon = "🌟"; statusColor = "text-green-400";
            } else if (pct >= 0.5) { // Pass
                totalGradeChange = 2 + Math.floor(max / 2);
                status = "PASSED"; statusIcon = "✅"; statusColor = "text-yellow-400";
            } else { // Fail
                totalGradeChange = -10;
                status = "FAILED"; statusIcon = "❌"; statusColor = "text-red-400";
            }

            // NEW: TEXTBOOK BUFF
            if (state.purchasedItems.includes('textbooks') && totalGradeChange > 0) {
                totalGradeChange += 1;
            }

            // Stat Penalties
            if (state.energy < 50) totalGradeChange -= 15;
            if (state.hungerLevel === 0) totalGradeChange -= 15;
            if (state.hungerLevel === 2) totalGradeChange += 2; 
            if (state.stress > 50) totalGradeChange -= 15;

            state.grades = Math.max(0, Math.min(100, state.grades + totalGradeChange));
            state.stress = state.stress +=25
            state.dayStats.grades += totalGradeChange;
            state.hasAttendedSchoolToday = true;
            
            // Higher energy cost for heavier schedule?
            // Base 25 + 5 per extra class beyond 1
            const energyCost = 35 + ((max - 1) * 5);
            state.energy = Math.max(0, state.energy - energyCost);
            state.dayStats.energy -= energyCost;
            
            if (!state.roundmealActive) {
                const minHunger = state.subscriptions.includes('hungrybox') ? 1 : 0;
                state.hungerLevel = Math.max(minHunger, state.hungerLevel - 1);
            }

            let logHtml = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
                <div class="${statusColor} flex justify-between"><span>Result</span><span>${status} (${score}/${max})</span></div>
                <div class="${totalGradeChange>=0 ? 'text-green-400' : 'text-red-400'} flex justify-between"><span>GPA Impact</span><span>${totalGradeChange > 0 ? '+' : ''}${totalGradeChange}%</span></div>
                <div class="text-red-400 flex justify-between"><span>Energy</span><span>-${energyCost}%</span></div>
                <div class="text-red-400 flex justify-between"><span>Stress</span><span>+25%</span></div>

            </div>`;

            window.queueModal("CLASS DISMISSED", "You finished your classes for the day." + logHtml, "Dashboard", statusIcon, () => { state.step = 'sim_dashboard'; window.updateUI(); });
        };

        window.typingData = {
            active: false,
            words: [], // { text: "Word", x: 50, y: 0, speed: 1 }
            currentInput: "",
            score: 0,
            frame: 0,
            interval: null
        };

        window.startTypingGame = function() {
            document.getElementById('modal-overlay').classList.add('hidden');
            
            window.typingData = {
                active: true,
                words: [],
                currentInput: "",
                score: 0,
                frame: 0,
                interval: null
            };

            const gameHtml = `
                <div class="max-w-md mx-auto py-2 select-none">
                    <h1 class="text-3xl font-black text-acs-gold mb-2 uppercase tracking-widest leading-none">THE ESSAY</h1>
                    <div class="flex justify-between items-end mb-2 px-2">
                         <div class="text-xs font-bold text-slate-400">WORDS TYPED: <span id="type-score" class="text-white">0</span></div>
                         <div id="type-input-display" class="text-xl font-mono font-black text-green-400 bg-slate-800 px-3 py-1 rounded min-w-[100px] h-8 text-center border border-slate-600"></div>
                    </div>

                    <div id="typing-area" class="relative bg-slate-900 rounded-xl h-64 overflow-hidden border-4 border-slate-700 shadow-inner">
                        <!-- Paper lines background -->
                        <div class="absolute inset-0 opacity-10" style="background-image: repeating-linear-gradient(transparent, transparent 29px, #ccc 30px);"></div>
                    </div>
                    
                    <p class="text-[10px] text-slate-500 mt-2 text-center uppercase font-bold">Type the words. Don't let them fall.</p>
                </div>
            `;

            state.pendingModals.push({
                rawHtml: gameHtml,
                onOpen: () => {
                    // Keyboard Listener
                    const handleType = (e) => {
                        if (!window.typingData.active) return;
                        
                        // Handle Letters
                        if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
                            window.typingData.currentInput += e.key;
                        } 
                        // Handle Backspace
                        else if (e.key === 'Backspace') {
                            window.typingData.currentInput = window.typingData.currentInput.slice(0, -1);
                        }

                        // Update Display
                        const disp = document.getElementById('type-input-display');
                        if(disp) disp.innerText = window.typingData.currentInput;
                        
                        // Check Matching
                        window.checkTypingMatch();
                    };
                    document.addEventListener('keydown', handleType);

                    // Game Loop
                    window.typingData.interval = setInterval(() => {
                        if (!window.typingData.active) {
                            document.removeEventListener('keydown', handleType);
                            return;
                        }
                        window.updateTypingGame();
                    }, 30);
                }
            });
            window.processModalQueue();
        };

        window.checkTypingMatch = function() {
            const d = window.typingData;
            const matchIndex = d.words.findIndex(w => w.text.toLowerCase() === d.currentInput.toLowerCase());
            
            if (matchIndex !== -1) {
                // Word Matched!
                const wordEl = document.getElementById(`word-${d.words[matchIndex].id}`);
                if (wordEl) {
                    wordEl.classList.add('scale-150', 'text-green-400', 'opacity-0');
                    setTimeout(() => wordEl.remove(), 200);
                }
                
                d.words.splice(matchIndex, 1);
                d.currentInput = "";
                d.score++;
                document.getElementById('type-input-display').innerText = "";
                document.getElementById('type-score').innerText = d.score;
            }
        };

        window.updateTypingGame = function() {
            const d = window.typingData;
            d.frame++;
            const area = document.getElementById('typing-area');

            // 1. Spawn Words
            if (d.frame % 40 === 0 && d.frame < 900) { // Stop spawning after ~30s
                const text = window.ACADEMIC_WORDS[Math.floor(Math.random() * window.ACADEMIC_WORDS.length)];
                const id = d.frame;
                const el = document.createElement('div');
                el.innerText = text;
                el.id = `word-${id}`;
                el.className = "absolute text-white font-mono font-bold text-sm bg-slate-800/80 px-2 rounded transition-transform";
                el.style.left = (Math.random() * 80 + 5) + "%";
                el.style.top = "-30px";
                area.appendChild(el);
                
                d.words.push({ text, id, el, y: -30, speed: 0.5 + (d.score * 0.05) });
            }

            // 2. Move Words
            for (let i = 0; i < d.words.length; i++) {
                let w = d.words[i];
                w.y += w.speed;
                w.el.style.top = w.y + "px";

                // Hit Bottom (Fail)
                if (w.y > 240) {
                    w.el.style.color = "#ef4444"; // Red
                    // Penalty? Maybe just doesn't count for score.
                    w.el.remove();
                    d.words.splice(i, 1);
                    i--;
                }
            }

            // 3. End Condition (Time based or word count)
            if (d.frame > 1000 && d.words.length === 0) {
                window.finishExam();
            }
        };
        window.finishExam = function() {
            window.typingData.active = false;
            clearInterval(window.typingData.interval);
            document.getElementById('modal-overlay').classList.add('hidden');

            // --- NEW: Check if this was a College Essay ---
            if (window.typingData.isCollegeApp) {
                window.finishCollegeApp();
                return;
            }
            // Calculate Results
            // Quiz: 5 pts max. Typing: Scale 0-5 pts (cap at 15 words)
            const typingPoints = Math.min(5, Math.floor(window.typingData.score / 3));
            const finalScore = window.examData.totalScore + typingPoints; // Max 10
            
            // GPA Swing: 
            // Score 0-4: Negative
            // Score 5-7: Small Positive
            // Score 8-10: Huge Positive
            
            let gpaChange = 0;
            let title = "";
            let icon = "";
            let stressChange = 0;

            if (finalScore >= 8) {
                gpaChange = window.examData.isFinal ? 15 : 10;
                stressChange = -20;
                title = "ACED IT!";
                icon = "🅰️";
            } else if (finalScore >= 5) {
                gpaChange = window.examData.isFinal ? 5 : 3;
                title = "PASSED";
                icon = "🆗";
            } else {
                gpaChange = window.examData.isFinal ? -15 : -10;
                stressChange = 20;
                title = "FAILED";
                icon = "📉";
            }
            
            // Apply
            state.grades = Math.max(0, Math.min(100, state.grades + gpaChange));
            state.dayStats.grades += gpaChange;
            state.stress = Math.min(100, Math.max(0, state.stress + stressChange));
            state.dayStats.stress += stressChange;

            let html = `<div class="mt-4 border-t border-slate-600 pt-4 font-bold text-sm">
                <div class="${gpaChange > 0 ? 'text-green-400' : 'text-red-400'} flex justify-between"><span>GPA Impact</span><span>${gpaChange > 0 ? '+' : ''}${gpaChange}%</span></div>
                <div class="${stressChange <= 0 ? 'text-green-400' : 'text-red-400'} flex justify-between"><span>Stress</span><span>${stressChange > 0 ? '+' : ''}${stressChange}%</span></div>
            </div>`;

            setTimeout(() => {
                window.queueModal(title, `You scored ${finalScore}/10 combined points.` + html, "Done", icon, () => window.updateUI());
            }, 100);
        };
        // Separate function for clarity
        window.finishCollegeApp = function() {
            const collegeId = window.targetCollegeId;
            const college = window.COLLEGE_DB.find(c => c.id === collegeId);
            
            // Calculate Performance
            // Score 0-10 words. 
            // 0-3 words: Bad Essay (-20% chance)
            // 4-7 words: Okay Essay (No change)
            // 8+ words: Great Essay (+15% chance)
            const wordsTyped = window.typingData.score;
            let essayBonus = 0;
            let essayRating = "Average";
            
            if (wordsTyped >= 8) { essayBonus = 15; essayRating = "Stellar"; }
            else if (wordsTyped <= 3) { essayBonus = -20; essayRating = "Typos Everywhere"; }

            // Calculate Final Chance
            const baseStats = window.calculateCollegeChance(college);
            const finalChance = Math.max(0, Math.min(99, baseStats.chance + essayBonus));
            
            // Determine result NOW (stored for later reveal)
            const accepted = Math.random() * 100 < finalChance;
            
            // Save to State
            state.submittedApps.push({
                id: collegeId,
                name: college.name,
                status: accepted ? 'accepted' : 'rejected', // Hidden until reveal
                revealed: false,
                date: state.dayTotal,
                snapshot: {
                    cash: state.balance,
                    employed: !!state.job
                }
            });

            // Feedback
            setTimeout(() => {
                window.queueModal(
                    "APPLICATION SENT", 
                    `You submitted your application to <strong>${college.name}</strong>.<br><br>Essay Quality: <span class="text-acs-gold">${essayRating}</span><br><br><span class="text-xs text-slate-400">You will hear back in the Spring.</span>`, 
                    "Fingers Crossed", 
                    "📬", 
                    () => {
                        window.renderPhoneMenu(); // Go back to app
                    }
                );
            }, 100);
        };