// GBP-PRO-AUDIT Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Variablen initialisieren
  let currentQuestion = 1;
  const totalQuestions = 10;
  const answers = [];
  
  // Konstanten für die verschiedenen Abschnitte
  const auditSection = document.getElementById('audit-section');
  const formSection = document.getElementById('form-section');
  const scorePreviewSection = document.getElementById('score-preview-section');
  
  // Verbesserte Button-Event-Listener-Implementierung
  document.querySelectorAll('.option-btn').forEach(button => {
    // Entfernen von bestehenden Event-Listenern, falls vorhanden
    button.removeEventListener('click', handleButtonClick);
    // Hinzufügen des Event-Listeners
    button.addEventListener('click', handleButtonClick);
  });
  
  // Funktion, die auf Klick-Events reagiert
  function handleButtonClick(event) {
    // Verhindere Standard-Button-Verhalten
    event.preventDefault();
    
    // Hole die Question-ID aus dem übergeordneten Element
    const questionElement = this.closest('.question');
    if (!questionElement) return;
    
    const questionId = questionElement.id;
    const questionIndex = parseInt(questionId.split('-')[1]) - 1;
    
    // Speichere die Antwort
    answers[questionIndex] = this.dataset.value;
    console.log(`Frage ${questionIndex + 1} beantwortet mit: ${this.dataset.value}`);
    
    // Zur nächsten Frage weitergehen oder zum Formular
    if (currentQuestion < totalQuestions) {
      // Aktuelle Frage ausblenden
      document.getElementById(`question-${currentQuestion}`).style.display = 'none';
      
      // Nächste Frage anzeigen
      currentQuestion++;
      const nextQuestion = document.getElementById(`question-${currentQuestion}`);
      if (nextQuestion) {
        nextQuestion.style.display = 'block';
        
        // Fortschrittsanzeige aktualisieren
        const currentQuestionElement = document.getElementById('current-question');
        const progressBar = document.getElementById('progress-bar');
        
        if (currentQuestionElement) {
          currentQuestionElement.textContent = currentQuestion;
        }
        
        if (progressBar) {
          progressBar.style.width = `${(currentQuestion / totalQuestions) * 100}%`;
        }
      }
    } else {
      // Alle Fragen beantwortet - zum Formular gehen
      completeAudit();
    }
  }
  
  // Funktion zum Abschließen des Audits und Anzeigen des Formulars
  function completeAudit() {
    // Score berechnen
    const yesAnswers = answers.filter(answer => answer === 'yes').length;
    const scorePercentage = Math.round((yesAnswers / totalQuestions) * 100);
    console.log(`Audit abgeschlossen. Score: ${scorePercentage}%`);
    
    // Audit-Bereich ausblenden
    if (auditSection) {
      auditSection.style.display = 'none';
    }
    
    // Score-Preview ausblenden bis Formular abgesendet wird
    if (scorePreviewSection) {
      scorePreviewSection.style.display = 'none';
    }
    
    // Formular anzeigen
    if (formSection) {
      formSection.style.display = 'block';
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Ergebnisse für das Formular speichern
    prepareFormData(scorePercentage);
  }
  
  // Funktion zum Vorbereiten der Formulardaten
  function prepareFormData(scorePercentage) {
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
    
    // Ergebnisse für jede Frage sammeln
    const results = [];
    for(let i = 0; i < totalQuestions; i++) {
      results.push({
        question: questions[i],
        passed: answers[i] === 'yes',
        explanation: answers[i] === 'yes' ? 
          "Super! Du machst das richtig." : 
          "Hier besteht Optimierungsbedarf."
      });
    }
    
    // Ergebnisse in die versteckten Formularfelder eintragen
    const auditScoreElement = document.getElementById('audit-score');
    const auditResultsElement = document.getElementById('audit-results');
    
    if (auditScoreElement) {
      auditScoreElement.value = scorePercentage;
    }
    
    if (auditResultsElement) {
      auditResultsElement.value = encodeURIComponent(JSON.stringify(results));
    }
    
    // Ergebnisse im lokalen Speicher für die spätere Verwendung speichern
    const auditData = {
      'audit-score': scorePercentage,
      'audit-results': encodeURIComponent(JSON.stringify(results))
    };
    localStorage.setItem('gbp-audit-data', JSON.stringify(auditData));
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
