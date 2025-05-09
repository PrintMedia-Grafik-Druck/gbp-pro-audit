// success.js
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
  
  // Zur Ergebnisseite weiterleiten mit allen relevanten Daten
  setTimeout(() => {
    const resultPageUrl = new URL('results.html', window.location.origin);
    
    // Alle relevanten Daten als URL-Parameter anhängen
    for (const [key, value] of Object.entries(combinedData)) {
      // Bestimmte Felder ausschließen
      if (key !== 'form-name' && key !== 'newsletter' && key !== 'privacy' && key !== 'bot-field') {
        resultPageUrl.searchParams.append(key, value);
      }
    }
    
    // Weiterleiten zur Ergebnisseite
    window.location.href = resultPageUrl.toString();
  }, 3000); // 3 Sekunden Verzögerung für die Weiterleitung
});
