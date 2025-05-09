// results.js - Skript für die Ergebnisseite
document.addEventListener('DOMContentLoaded', function() {
  // URL-Parameter auslesen
  const params = new URLSearchParams(window.location.search);
  
  // Daten aus den URL-Parametern sammeln
  const formData = {};
  for(const [key, value] of params) {
    formData[key] = value;
  }
  
  // Funktion zum Auslesen von Formulardaten aus dem lokalen Speicher
  function getFormDataFromStorage() {
    const auditData = localStorage.getItem('gbp-audit-data');
    if (auditData) {
      return JSON.parse(auditData);
    }
    return null;
  }
  
  // Kombinierte Daten aus URL-Parametern und lokalem Speicher
  const auditData = getFormDataFromStorage() || {};
  const combinedData = { ...auditData, ...formData };
  
  // Audit-Score anzeigen
  displayScore(combinedData);
  
  // Audit-Ergebnisse anzeigen
  displayResults(combinedData);
  
  // Empfehlungen generieren und anzeigen
  generateRecommendations(combinedData);
  
  // PDF-Download-Button einrichten
  initializePDFDownload(combinedData);
});

// Funktion zum Anzeigen des Scores
function displayScore(data) {
  const scoreElement = document.getElementById('score-percentage');
  const scoreTextElement = document.getElementById('score-text');
  
  if (scoreElement && scoreTextElement && data['audit-score']) {
    // Stelle sicher, dass der Score als Zahl behandelt wird
    const score = parseFloat(data['audit-score']) || 0;
    
    // Score anzeigen
    scoreElement.textContent = `${score}%`;
    scoreTextElement.textContent = `${score}%`;
    
    // Kreis-Animation aktualisieren
    document.querySelector('.score-circle').style.setProperty('--percentage', `${score}%`);
    
    // Animation des Scores
    animateScore(0, score);
  }
}

// Funktion zur Animation des Score-Wertes
function animateScore(start, end) {
  const element = document.getElementById('score-percentage');
  const duration = 1500; // Dauer der Animation in ms
  const startTime = performance.now();
  
  function updateScore(currentTime) {
    const elapsedTime = currentTime - startTime;
    
    if (elapsedTime < duration) {
      const progress = elapsedTime / duration;
      const currentScore = Math.floor(start + (end - start) * progress);
      element.textContent = `${currentScore}%`;
      requestAnimationFrame(updateScore);
    } else {
      element.textContent = `${end}%`;
    }
  }
  
  requestAnimationFrame(updateScore);
}

// Funktion zum Anzeigen der Audit-Ergebnisse
function displayResults(data) {
  const resultsElement = document.getElementById('results-breakdown');
  if (!resultsElement || !data['audit-results']) return;
  
  try {
    // Versuche, die Ergebnisse als JSON zu parsen
    const auditResults = JSON.parse(decodeURIComponent(data['audit-results']));
    
    if (!Array.isArray(auditResults)) {
      resultsElement.innerHTML = '<p>Keine detaillierten Ergebnisse verfügbar.</p>';
      return;
    }
    
    // HTML für die Ergebnisse erstellen
    let resultsHTML = '';
    auditResults.forEach((item, index) => {
      resultsHTML += `
        <div class="result-item ${item.passed ? 'passed' : 'failed'}">
          <h4>${index + 1}. ${item.question || 'Unbekannte Frage'}</h4>
          <p><strong>${item.passed ? 'Ja ✓' : 'Nein ✗'}</strong>: ${item.explanation || ''}</p>
        </div>
      `;
    });
    
    // In das DOM einfügen
    resultsElement.innerHTML = resultsHTML;
  } catch (e) {
    console.error('Fehler beim Parsen der Audit-Ergebnisse:', e);
    resultsElement.innerHTML = '<p>Die Audit-Ergebnisse konnten nicht geladen werden.</p>';
  }
}

// Funktion zum Generieren personalisierter Empfehlungen
function generateRecommendations(data) {
  const container = document.getElementById('recommendations-list');
  if (!container) return;
  
  const auditScore = parseFloat(data['audit-score']) || 0;
  let recommendations = [];
  
  // Empfehlungen basierend auf dem Score generieren
  if (auditScore < 30) {
    recommendations = [
      'Dein Google Business Profil benötigt dringend Optimierung. Wir empfehlen unser Premium-Paket für eine vollständige Überarbeitung.',
      'Beginne mit dem Hochladen hochwertiger Fotos und der Vervollständigung aller Grundinformationen.',
      'Implementiere eine Strategie zur regelmäßigen Aktualisierung deines Profils.',
      'Starte mit dem Sammeln von Bewertungen deiner zufriedenen Kunden.',
      'Optimiere die NAP-Informationen (Name, Adresse, Telefonnummer) auf allen Plattformen.'
    ];
  } else if (auditScore < 70) {
    recommendations = [
      'Dein GBP hat Potential! Mit unserem Pro-Paket kannst du deine Sichtbarkeit deutlich erhöhen.',
      'Achte auf regelmäßige Posts und Updates in deinem Profil.',
      'Erweitere deine Bildersammlung mit professionellen Fotos.',
      'Reagiere noch schneller auf Bewertungen, um die Kundenbindung zu stärken.',
      'Nutze alle verfügbaren Attribute, um dein Profil vollständig zu optimieren.'
    ];
  } else {
    recommendations = [
      'Dein GBP ist bereits gut optimiert! Mit unserem Basic-Paket kannst du den Vorsprung weiter ausbauen.',
      'Fokussiere dich auf fortgeschrittene Strategien wie lokale Veranstaltungen und spezielle Angebote.',
      'Nutze die Analysen regelmäßig, um Trends zu erkennen und darauf zu reagieren.',
      'Erweitere deine Dienstleistungs- und Produktbeschreibungen.',
      'Nutze regelmäßige Performance-Berichte, um deine Strategie zu verfeinern.'
    ];
  }
  
  // HTML für die Empfehlungen erstellen
  let recommendationsHTML = '';
  recommendations.forEach((recommendation, index) => {
    recommendationsHTML += `
      <div class="recommendation-item">
        <p><strong>${index + 1}.</strong> ${recommendation}</p>
      </div>
    `;
  });
  
  // In das DOM einfügen
  container.innerHTML = recommendationsHTML;
}

// Funktion zum Initialisieren des PDF-Downloads
function initializePDFDownload(data) {
  const downloadButton = document.getElementById('download-pdf');
  if (downloadButton) {
    downloadButton.addEventListener('click', function() {
      generatePDF(data);
    });
  }
}

// Funktion zum Generieren eines PDF-Berichts
function generatePDF(data) {
  // jsPDF initialisieren
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Titel und Logo
  doc.setFont(undefined, 'bold');
  doc.setFontSize(24);
  doc.setTextColor(30, 41, 59); // --primary-color
  doc.text('GBP-PRO-AUDIT', 105, 20, { align: 'center' });
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(16);
  doc.setTextColor(100, 116, 139); // --text-secondary
  doc.text('Google Business Profil Analyse', 105, 30, { align: 'center' });
  
  // Linie
  doc.setDrawColor(167, 139, 250); // --accent-color
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Datum
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  const today = new Date();
  doc.text(`Erstellt am: ${today.toLocaleDateString('de-DE')}`, 20, 45);
  
  // Score
  doc.setFont(undefined, 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  const score = parseFloat(data['audit-score']) || 0;
  doc.text(`Ihr GBP-Score: ${score}%`, 105, 60, { align: 'center' });
  
  // Kundeninformationen
  doc.setFontSize(16);
  doc.text('Kundeninformationen', 20, 75);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(12);
  let yPos = 85;
  if (data.name) {
    doc.text(`Name: ${data.name}`, 20, yPos);
    yPos += 8;
  }
  if (data.company) {
    doc.text(`Firma: ${data.company}`, 20, yPos);
    yPos += 8;
  }
  if (data.email) {
    doc.text(`E-Mail: ${data.email}`, 20, yPos);
    yPos += 8;
  }
  if (data.phone) {
    doc.text(`Telefon: ${data.phone}`, 20, yPos);
    yPos += 8;
  }
  if (data.website) {
    doc.text(`Website: ${data.website}`, 20, yPos);
    yPos += 8;
  }
  if (data['gbp-url']) {
    doc.text(`GBP URL: ${data['gbp-url']}`, 20, yPos);
    yPos += 8;
  }
  
  // Linie
  doc.line(20, yPos + 5, 190, yPos + 5);
  yPos += 15;
  
  // Empfohlenes Paket
  doc.setFont(undefined, 'bold');
  doc.setFontSize(16);
  doc.text('Unsere Empfehlung', 20, yPos);
  yPos += 10;
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(12);
  let recommendedPackage = 'Basic';
  if (score < 30) {
    recommendedPackage = 'Premium';
  } else if (score < 70) {
    recommendedPackage = 'Pro';
  }
  
  doc.text(`Basierend auf Ihrem Score empfehlen wir unser ${recommendedPackage}-Paket.`, 20, yPos);
  yPos += 15;
  
  // Paketinfos
  switch (recommendedPackage) {
    case 'Basic':
      doc.text('Basic-Paket (198,99€ statt 499€):', 20, yPos);
      yPos += 8;
      doc.text('• Vollständiger GBP-PRO-AUDIT', 25, yPos);
      yPos += 6;
      doc.text('• PDF-Auswertung des aktuellen Profils', 25, yPos);
      yPos += 6;
      doc.text('• PDF-Optimierungsplan mit konkreten Maßnahmen', 25, yPos);
      yPos += 6;
      doc.text('• 30 Min. Telefon-Beratung', 25, yPos);
      yPos += 6;
      doc.text('• Checkliste zur Selbstoptimierung', 25, yPos);
      break;
    case 'Pro':
      doc.text('Pro-Paket (699€):', 20, yPos);
      yPos += 8;
      doc.text('• Alle Basic-Leistungen', 25, yPos);
      yPos += 6;
      doc.text('• Detaillierte Wettbewerbsanalyse (PDF)', 25, yPos);
      yPos += 6;
      doc.text('• Optimierung von 3 kritischen GBP-Faktoren', 25, yPos);
      yPos += 6;
      doc.text('• Erweiterte Handlungsempfehlungen', 25, yPos);
      yPos += 6;
      doc.text('• Priorisierungsplan für Maßnahmen', 25, yPos);
      yPos += 6;
      doc.text('• 60 Min. Strategie-Beratung', 25, yPos);
      break;
    case 'Premium':
      doc.text('Premium-Paket (999€):', 20, yPos);
      yPos += 8;
      doc.text('• Alle Pro-Leistungen', 25, yPos);
      yPos += 6;
      doc.text('• Professionell-gestützte GBP-Komplettanalyse', 25, yPos);
      yPos += 6;
      doc.text('• Monatlicher Performance-Bericht (2 Monate)', 25, yPos);
      yPos += 6;
      doc.text('• Optimierung von 5 kritischen GBP-Faktoren', 25, yPos);
      yPos += 6;
      doc.text('• Bewertungsmanagement-Strategie', 25, yPos);
      yPos += 6;
      doc.text('• GBP-Monitoring (2 Monate)', 25, yPos);
      yPos += 6;
      doc.text('• 90 Min. Online-Beratung (3 x 30 Min.)', 25, yPos);
      break;
  }
  
  // Fußzeile
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Für weitere Informationen kontaktieren Sie uns unter info@gbp-pro-audit.de', 105, 270, { align: 'center' });
  doc.text('© 2025 GBP-PRO-AUDIT. Alle Rechte vorbehalten.', 105, 275, { align: 'center' });
  
  // PDF speichern
  doc.save(`GBP-PRO-AUDIT_${data.name || 'Bericht'}.pdf`);
}
