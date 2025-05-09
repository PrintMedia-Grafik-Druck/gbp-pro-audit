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
  
  // Funktion zum Abschließen des Audits und Anzeigen des Formulars und Scores
  function completeAudit() {
    // Score berechnen
    const yesAnswers = answers.filter(answer => answer === 'yes').length;
    const scorePercentage = Math.round((y
