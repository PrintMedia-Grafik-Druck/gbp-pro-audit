// success.js
document.addEventListener('DOMContentLoaded', function() {
  console.log('Success page loaded');
  
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
      try {
        return JSON.parse(auditData);
      } catch(e) {
        console.error('Fehler beim Parsen der gespeicherten Daten:', e);
        return null;
      }
    }
    return null;
  }
  
  // Kombinierte Daten aus URL-Parametern und lokalem Speicher
  const auditData = getFormDataFromStorage() || {};
  const combinedData = { ...auditData, ...formData };
  console.log('Kombinierte Daten:', combinedData);
  
  // Newsletter-Anmeldung verarbeiten, falls angehakt
  if(formData.newsletter === 'on' && formData.email) {
    console.log('Newsletter-Anmeldung gestartet für:', formData.email);
    
    fetch('/.netlify/functions/newsletter-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name || '',
        company: formData.company || ''
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Newsletter-Anmeldung Antwort:', data);
    })
    .catch(error => {
      console.error('Fehler bei der Newsletter-Anmeldung:', error);
    });
  }
  
  // Timer anzeigen
  let secondsLeft = 3;
  const timerElement = document.getElementById('redirect-timer');
  if (timerElement) {
    timerElement.textContent = secondsLeft;
    
    const timerInterval = setInterval(() => {
      secondsLeft--;
      if (timerElement) {
        timerElement.textContent = secondsLeft;
      }
      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
  }
  
  // Zur Ergebnisseite weiterleiten mit allen relevanten Daten
  setTimeout(() => {
    // Erstelle die URL für die Ergebnisseite
    const resultPageUrl = new URL('results.html', window.location.origin);
    
    // Alle relevanten Daten als URL-Parameter anhängen
    for (const [key, value] of Object.entries(combinedData)) {
      // Bestimmte Felder ausschließen
      if (key !== 'form-name' && key !== 'newsletter' && key !== 'privacy' && key !== 'bot-field') {
        resultPageUrl.searchParams.append(key, value);
      }
    }
    
    console.log('Weiterleitung zu:', resultPageUrl.toString());
    // Weiterleiten zur Ergebnisseite
    window.location.href = resultPageUrl.toString();
  }, 3000); // 3 Sekunden Verzögerung für die Weiterleitung
});
