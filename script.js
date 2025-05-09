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
  
  // Alle Optionsbuttons mit Event-Listener versehen
  document.querySelectorAll('.option-btn').forEach(button => {
    button.addEventListener('click', function() {
      // Antwort speichern
      const questionIndex = parseInt(this.closest('.question').id.split('-')[1]) - 1;
      answers[questionIndex] = this.dataset.value;
      
      // Zur nächsten Frage weitergehen oder zur Formular-Sektion
      if (currentQuestion < totalQuestions) {
        // Nächste Frage anzeigen
        document.getElementById(`question-${currentQuestion}`).style.display = 'none';
        currentQuestion++;
        document.getElementById(`question-${currentQuestion}`).style.display = 'block';
        
        // Fortschrittsanzeige aktualisieren
        document.getElementById('current-question').textContent = currentQuestion;
        document.getElementById('progress-bar').style.width = `${(currentQuestion / totalQuestions) * 100}%`;
      } else {
        // Alle Fragen beantwortet - zum Formular gehen
        completeAudit();
      }
    });
  });
  
  // Funktion zum Abschließen des Audits und Anzeigen des Formulars
  function completeAudit() {
    // Score berechnen
    const yesAnswers = answers.filter(answer => answer === 'yes').length;
    const scorePercentage = Math.round((yesAnswers / totalQuestions) * 100);
    
    // Audit-Bereich ausblenden
    auditSection.style.display = 'none';
    
    // ÄNDERUNG: Score-Preview ausblenden, bis Formular abgesendet wird
    scorePreviewSection.style.display = 'none';
    
    // Formular anzeigen
    formSection.style.display = 'block';
    
    // Zu Formular scrollen
    formSection.scrollIntoView({ behavior: 'smooth' });
    
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
    if (document.getElementById('audit-score')) {
      document.getElementById('audit-score').value = scorePercentage;
    }
    
    if (document.getElementById('audit-results')) {
      document.getElementById('audit-results').value = encodeURIComponent(JSON.stringify(results));
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
      
      // Hier könntest du zusätzliche Validierungen hinzufügen
      console.log('Formular wird abgesendet...');
      
      // Keine Verhinderung des Absenden hier - die Weiterleitung erfolgt regulär
    });
  }
});
