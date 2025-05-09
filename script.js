// Globale Variablen
let currentQuestion = 1;
const totalQuestions = 10;
const answers = [];

// Funktion wird aufgerufen, wenn der Benutzer auf eine Antwortoption klickt
function answerQuestion(answer) {
  // Speichere die Antwort für die aktuelle Frage
  answers[currentQuestion - 1] = answer;
  
  // Überprüfe, ob alle Fragen beantwortet wurden
  if (currentQuestion < totalQuestions) {
    // Verstecke aktuelle Frage
    document.getElementById('question-' + currentQuestion).style.display = 'none';
    
    // Erhöhe den Fragenzähler
    currentQuestion++;
    
    // Zeige nächste Frage
    document.getElementById('question-' + currentQuestion).style.display = 'block';
    
    // Aktualisiere den Fortschrittsbalken
    updateProgress();
  } else {
    // Alle Fragen wurden beantwortet - zeige das Formular
    showForm();
  }
}

// Aktualisiert den Fortschrittsbalken
function updateProgress() {
  // Aktualisiere den Fortschrittszähler
  document.getElementById('current-question').textContent = currentQuestion;
  
  // Berechne den Fortschritt in Prozent
  const progressPercent = (currentQuestion / totalQuestions) * 100;
  
  // Aktualisiere die Breite des Fortschrittsbalkens
  document.getElementById('progress-bar').style.width = progressPercent + '%';
}

// Zeigt das Formular an und bereitet die Daten vor
function showForm() {
  // Berechne den Score basierend auf "Ja"-Antworten
  const yesAnswers = answers.filter(answer => answer === 'yes').length;
  const scorePercentage = Math.round((yesAnswers / totalQuestions) * 100);
  
  // Verstecke den Fragebereich
  document.getElementById('audit-section').style.display = 'none';
  
  // Verstecke die Vorschau des Scores (wird erst nach dem Formular gezeigt)
  if (document.getElementById('score-preview-section')) {
    document.getElementById('score-preview-section').style.display = 'none';
  }
  
  // Zeige das Formular
  document.getElementById('form-section').style.display = 'block';
  
  // Scrolle zum Formular
  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
  
  // Speichere die Ergebnisse für das Formular
  saveResults(scorePercentage);
}

// Speichert die Ergebnisse für das Formular
function saveResults(scorePercentage) {
  // Liste der Fragen
  const questions = [
    "Ist dein Google Business Profil vollständig ausgefüllt?",
    "Hast du regelmäßig neue Rezensionen (mindestens 1 pro Monat)?",
    "Beantwortest du alle Bewertungen zeitnah (innerhalb von 24 Stunden)?",
    "Veröffentlichst du regelmäßig Google Posts (mind. 2 pro Monat)?",
    "Hast du mehr als 10 hochwertige Fotos in deinem Profil?",
    "Hast du alle relevanten Attribute für dein Business eingestellt?",
    "Ist dein Unternehmen in den richtigen Kategorien gelistet?",
    "Nutzt du die Produkt- oder Dienstleistungs-Features in deinem Profil?",
    "Hast du eine konsistente NAP (Name, Address, Phone) auf allen Plattformen?",
    "Überwachst du regelmäßig die Insights/Statistiken deines GBP?"
  ];
  
  // Erstelle die Ergebnisse für jede Frage
  const results = [];
  for (let i = 0; i < totalQuestions; i++) {
    results.push({
      question: questions[i],
      passed: answers[i] === 'yes',
      explanation: answers[i] === 'yes' ? 
        "Super! Du machst das richtig." : 
        "Hier besteht Optimierungsbedarf."
    });
  }
  
  // Speichere den Score im versteckten Formularfeld
  if (document.getElementById('audit-score')) {
    document.getElementById('audit-score').value = scorePercentage;
  }
  
  // Speichere die detaillierten Ergebnisse im versteckten Formularfeld
  if (document.getElementById('audit-results')) {
    document.getElementById('audit-results').value = encodeURIComponent(JSON.stringify(results));
  }
  
  // Speichere die Ergebnisse im lokalen Speicher für die spätere Verwendung
  const auditData = {
    'audit-score': scorePercentage,
    'audit-results': encodeURIComponent(JSON.stringify(results))
  };
  localStorage.setItem('gbp-audit-data', JSON.stringify(auditData));
}

// Initialisiere die Seite, wenn das Dokument geladen ist
document.addEventListener('DOMContentLoaded', function() {
  // Überprüfe, ob wir uns auf der Hauptseite befinden
  if (document.getElementById('audit-section')) {
    // Setze die erste Frage und den Fortschrittsbalken
    currentQuestion = 1;
    updateProgress();
  }
  
  // Formular-Event-Listener
  const form = document.querySelector('form[name="gbp-audit"]');
  if (form) {
    form.addEventListener('submit', function(event) {
      // Prüfen, ob der Datenschutz akzeptiert wurde
      const privacyCheckbox = document.getElementById('privacy');
      if (!privacyCheckbox || !privacyCheckbox.checked) {
        event.preventDefault();
        alert('Bitte akzeptiere die Datenschutzerklärung, um fortzufahren.');
        return;
      }
      
      console.log('Formular wird abgesendet...');
    });
  }
});
