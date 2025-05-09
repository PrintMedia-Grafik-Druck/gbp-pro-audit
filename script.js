// Globale Variablen
let currentQuestion = 1;
let answers = {};
let userData = {};

// Wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // UI-Elemente
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const progressText = document.getElementById('progress');
    const questionnaire = document.getElementById('questionnaire');
    const contactFormContainer = document.getElementById('contactFormContainer');
    const contactForm = document.getElementById('contactForm');
    const resultContainer = document.getElementById('resultContainer');
    const packagesContainer = document.getElementById('packagesContainer');
    const viewPackagesBtn = document.getElementById('viewPackagesBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const percentageDisplay = document.getElementById('percentage');
    const resultText = document.getElementById('resultText');
    const recommendationList = document.getElementById('recommendationList');
    const restartBtn = document.getElementById('restartBtn');
    const canvas = document.getElementById('progressCircle');
    const ctx = canvas.getContext('2d');

    // Canvas initialisieren
    canvas.width = 200;
    canvas.height = 200;

    // Option-Auswahl
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            // Alle Optionen dieser Frage deselektieren
            const parentContainer = this.closest('.question-container');
            parentContainer.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Diese Option auswählen
            this.classList.add('selected');
            
            // Antwort speichern
            const questionNumber = parentContainer.dataset.question;
            const value = parseInt(this.dataset.value);
            answers[questionNumber] = value;
        });
    });

    // Navigation: Weiter
    nextBtn.addEventListener('click', function() {
        const currentContainer = document.querySelector(`.question-container[data-question="${currentQuestion}"]`);
        
        // Prüfen, ob eine Option ausgewählt wurde
        const selectedOption = currentContainer.querySelector('.option.selected');
        if (!selectedOption) {
            alert('Bitte wählen Sie eine Antwort aus, bevor Sie fortfahren.');
            return;
        }
        
        // Zur nächsten Frage
        if (currentQuestion < 10) {
            currentContainer.classList.remove('active');
            currentQuestion++;
            document.querySelector(`.question-container[data-question="${currentQuestion}"]`).classList.add('active');
            progressText.textContent = `Frage ${currentQuestion} von 10`;
            prevBtn.disabled = false;
            
            // Wenn letzte Frage, Text des Buttons ändern
            if (currentQuestion === 10) {
                nextBtn.textContent = 'Auswertung vorbereiten';
            }
        } else {
            // Nach Fragebogen: Kontaktformular anzeigen
            questionnaire.style.display = 'none';
            contactFormContainer.style.display = 'block';
        }
    });

    // Navigation: Zurück
    prevBtn.addEventListener('click', function() {
        if (currentQuestion > 1) {
            document.querySelector(`.question-container[data-question="${currentQuestion}"]`).classList.remove('active');
            currentQuestion--;
            document.querySelector(`.question-container[data-question="${currentQuestion}"]`).classList.add('active');
            progressText.textContent = `Frage ${currentQuestion} von 10`;
            
            nextBtn.textContent = 'Weiter';
            
            if (currentQuestion === 1) {
                prevBtn.disabled = true;
            }
        }
    });

    // Kontaktformular absenden
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Benutzerdaten sammeln
        userData = {
            company: document.getElementById('company').value,
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            website: document.getElementById('website').value || 'Nicht angegeben',
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            newsletter: document.getElementById('newsletter').checked
        };
        
        // MailerLite API-Integration für Newsletter-Anmeldungen
        if (userData.newsletter) {
            sendToMailerLite(userData);
        }
        
        // Ergebnis anzeigen
        showResult();
    });
    
    // Pakete anzeigen
    viewPackagesBtn.addEventListener('click', function() {
        resultContainer.style.display = 'none';
        packagesContainer.style.display = 'block';
        
        // Empfohlenes Paket basierend auf dem Score wählen
        const percentage = calculatePercentage();
        let recommendedPackage;
        
        if (percentage < 40) {
            recommendedPackage = 'premium';
        } else if (percentage < 70) {
            recommendedPackage = 'pro';
        } else {
            recommendedPackage = 'basic';
        }
        
        // Badge entfernen und neu setzen
        document.querySelectorAll('.recommended-badge').forEach(badge => {
            badge.remove();
        });
        
        const packageElement = document.querySelector(`.package[data-package="${recommendedPackage}"]`);
        if (packageElement && !packageElement.querySelector('.recommended-badge')) {
            const badge = document.createElement('div');
            badge.className = 'recommended-badge';
            badge.textContent = 'EMPFOHLEN';
            packageElement.style.position = 'relative';
            packageElement.appendChild(badge);
        }
        
        // Zu den Paketen scrollen
        packagesContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // PDF-Download
    downloadPdfBtn.addEventListener('click', function() {
        generatePDF();
    });

    // Paket-Auswahl und Buchung
    document.querySelectorAll('.package').forEach(pkg => {
        const bookButton = pkg.querySelector('.package-button');
        bookButton.addEventListener('click', function() {
            const packageName = pkg.dataset.package;
            sendPackageRequest(packageName);
        });
    });

    // Neustart
    restartBtn.addEventListener('click', function() {
        location.reload();
    });

    // Ergebnis berechnen und anzeigen
    function showResult() {
        contactFormContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        packagesContainer.style.display = 'none';
        
        // Prozentsatz berechnen
        const percentage = calculatePercentage();
        
        // Ergebnis anzeigen
        percentageDisplay.textContent = `${percentage}%`;
        resultText.textContent = `Basierend auf Ihren Antworten ist Ihr Google Business Profil zu ${percentage}% optimiert.`;
        
        // Empfehlungen generieren
        generateRecommendations();
        
        // Prozentkreis zeichnen
        drawProgressCircle(percentage);
        
        // Zu den Ergebnissen scrollen
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Prozentsatz berechnen
    function calculatePercentage() {
        let totalPoints = 0;
        let countedAnswers = 0;
        
        for (let i = 1; i <= 10; i++) {
            if (answers[i] !== undefined) {
                totalPoints += answers[i];
                countedAnswers++;
            }
        }
        
        return Math.round((totalPoints / (countedAnswers * 10)) * 100);
    }

    // Prozentkreis zeichnen
    function drawProgressCircle(percentage) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;
        const startAngle = -0.5 * Math.PI;
        const endAngle = startAngle + (2 * Math.PI * percentage / 100);
        
        // Kreis löschen
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Hintergrund (grauer Kreis)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#f0f0f0';
        ctx.stroke();
        
        // Prozent-Kreis mit Farbverlauf basierend auf Prozentsatz
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineWidth = 15;
        
        // Farbe basierend auf Prozentsatz
        let color;
        if (percentage < 40) {
            color = '#FF4D4D'; // Rot
        } else if (percentage < 70) {
            color = '#FFA500'; // Orange
        } else {
            color = '#4CAF50'; // Grün
        }
        
        ctx.strokeStyle = color;
        ctx.stroke();
        
        // Textfarbe anpassen
        percentageDisplay.style.color = color;
    }

    // Empfehlungen generieren
    function generateRecommendations() {
        recommendationList.innerHTML = '';
        
        const recommendations = {
            1: "Verifizieren Sie Ihr Google Business Profil, um die Glaubwürdigkeit zu erhöhen.",
            2: "Stellen Sie sicher, dass Ihre Geschäftsdaten vollständig und aktuell sind.",
            3: "Tragen Sie Ihre regulären Öffnungszeiten und Sonderöffnungszeiten ein.",
            4: "Laden Sie hochwertige Fotos verschiedener Kategorien hoch.",
            5: "Veröffentlichen Sie regelmäßig Google Posts für bessere Sichtbarkeit.",
            6: "Bitten Sie zufriedene Kunden aktiv um Bewertungen für Ihr Profil.",
            7: "Antworten Sie auf alle Bewertungen, sowohl positive als auch negative.",
            8: "Wählen Sie neben der Hauptkategorie auch relevante Unterkategorien aus.",
            9: "Aktivieren Sie alle relevanten Attribute für Ihr Geschäft.",
            10: "Überprüfen Sie regelmäßig Ihre GBP-Statistiken für Optimierungen."
        };
        
        // Prüfen, welche Bereiche verbessert werden können
        const missedQuestions = [];
        for (let i = 1; i <= 10; i++) {
            if (answers[i] < 8) {
                missedQuestions.push(i);
            }
        }
        
        if (missedQuestions.length === 0) {
            const li = document.createElement('li');
            li.textContent = "Hervorragend! Ihr Google Business Profil ist bereits sehr gut optimiert.";
            recommendationList.appendChild(li);
        } else {
            missedQuestions.forEach(q => {
                const li = document.createElement('li');
                li.textContent = recommendations[q];
                recommendationList.appendChild(li);
            });
        }
    }
});

// Hilfsfunktion für E-Mails und PDFs
function calculatePercentage() {
    let totalPoints = 0;
    let countedAnswers = 0;
    
    for (let i = 1; i <= 10; i++) {
        if (answers[i] !== undefined) {
            totalPoints += answers[i];
            countedAnswers++;
        }
    }
    
    return Math.round((totalPoints / (countedAnswers * 10)) * 100);
}
