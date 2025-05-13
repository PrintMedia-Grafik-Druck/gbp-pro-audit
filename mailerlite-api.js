// Versucht, Formularübermittlungen zu MailerLite zu senden
document.addEventListener('DOMContentLoaded', function() {
    console.log("MailerLite API Integration geladen");
    
    // Finden Sie alle Formulare auf der Seite
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        console.log("Formular gefunden:", form);
        
        // Fügen Sie einen Event-Listener für die Formularübermittlung hinzu
        form.addEventListener('submit', function(event) {
            // Formular erst absenden lassen, dann weitermachen
            setTimeout(function() {
                try {
                    console.log("Versuche Formulardaten zu extrahieren");
                    
                    // Extrahieren der Formulardaten
                    const formData = new FormData(form);
                    let formEntries = {};
                    for (let pair of formData.entries()) {
                        formEntries[pair[0]] = pair[1];
                    }
                    console.log("Formulareinträge:", formEntries);
                    
                    // Erstellen eines userData-Objekts mit den extrahierten Daten
                    const userData = {
                        email: formEntries.email || '',
                        firstname: formEntries.firstname || formEntries.name || '',
                        lastname: formEntries.lastname || '',
                        company: formEntries.company || formEntries.firma || '',
                        phone: formEntries.phone || formEntries.telefon || '',
                        website: formEntries.website || ''
                    };
                    
                    console.log("Extrahierte Benutzerdaten:", userData);
                    
                    // Senden an MailerLite, wenn eine E-Mail-Adresse vorhanden ist
                    if (userData.email) {
                        sendToMailerLiteAPI(userData);
                    } else {
                        console.log("Keine E-Mail-Adresse gefunden, überspringe MailerLite API");
                    }
                } catch (error) {
                    console.error("Fehler beim Extrahieren der Formulardaten:", error);
                }
            }, 500);
        });
    });
    
    // Funktion zum Senden an MailerLite API mit CORS-Proxy
    function sendToMailerLiteAPI(userData) {
        console.log("MailerLite API: Versuche Kontakt zu erstellen", userData);
        
        // CORS-Proxy verwenden
        const corsProxy = "https://corsproxy.io/?";
        const mailerliteUrl = 'https://connect.mailerlite.com/api/subscribers';
        
        // API-Schlüssel für MailerLite (prüfen Sie, ob dieser korrekt ist)
        const apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNjkzYTM4NTc4ZWJmOTY1NGY2OTBiNDVmMjExNzViNWMwZTdlODIzZWZmZWFiZDQ2NmNjN2E3ZGNmYjljNDkzNmJkMDc1YzdhOGFiZTEwMGYiLCJpYXQiOjE3NDY2OTUxMTMuOTA0OTM2LCJuYmYiOjE3NDY2OTUxMTMuOTA0OTM5LCJleHAiOjQ5MDIzNjg3MTMuODk5NDI2LCJzdWIiOiIxNDIwODkxIiwic2NvcGVzIjpbXX0.Zdgdv64UEYxXTnSjUGj6DLwlQL_v7OmZFNsykcXvOiObU889tnwoRATc_TrtxGMTPSHOFaqEu_M_A3mUyaF4tQtpEQr6S_s-v9Bv4RcpbQtLt5bUBfXd6mtLdgoZRbtyQDYQOLQ1jUaggl1PDEaTujnAcAah5AtfQuJ-tRNIKuyEpX6LOK04Lb52Ua1i4h2lxckPNX-iLQR28sZ3Eg4bWW3A78Cx9Y29jYtnNbxpdMn28IFXRkSwfeWh3Jxwf1Zyq-GKl-jGXOQTEPD9futBvoaiiT4Ct9k4FC6pcgSPn0qAII2Q3Ct7jioy1rr1dJkgB30PV1rdyLiCf8M9ksMG__Ubc_GBO69fNfEEE75n_yGLn0pwfxEUZGyrYAiLPZzt1GhJv7I3-6rJlKsODKNBpvqex05IGwjuxsAEGpxViTAEnbHemWoxcQYwAvAUE06uKvgRGoiG9hmCn9k8Kz7mdDNPmT6UrBU3J8YgjjJOYJodxohmlcFvdhzuSUqMz2tosXCZqDfPyVtDRnRTBDW4NddwHlpx0PS29P5IRRU8x79yvLyYy8C79LNtUfVg1l1x4dLSdugc4N2Et9Rb339WcsUTSSGDx2KWBxFJe2nFx09viED9o_Gr9TrCqFW8yw-KrHWPwo-xYSADxaOfXyej-i1vNEQdvY1kLi8m2JWNoQA";
        
        // Gruppen-ID für MailerLite
        const groupIds = ["153798590884480855"];
        
        // Daten für die API-Anfrage vorbereiten
        const data = {
            email: userData.email,
            fields: {
                name: (userData.firstname + " " + userData.lastname).trim(),
                company: userData.company,
                phone: userData.phone || "",
                website: userData.website || ""
            },
            groups: groupIds
        };
        
        console.log("MailerLite API Anfragedaten:", data);
        
        // Versuche API-Aufruf mit CORS-Proxy
        try {
            const proxyUrl = corsProxy + encodeURIComponent(mailerliteUrl);
            console.log("Sende Anfrage an:", proxyUrl);
            
            fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                console.log("MailerLite API Statuscode:", response.status);
                return response.json();
            })
            .then(result => {
                console.log("MailerLite API Erfolgreiche Antwort:", result);
                if (result.data && result.data.id) {
                    console.log("Kontakt erfolgreich zu MailerLite hinzugefügt! Kontakt-ID:", result.data.id);
                } else {
                    console.warn("Unerwartete API-Antwort:", result);
                }
            })
            .catch(error => {
                console.error("MailerLite API Fehler bei der Anfrage:", error);
            });
        } catch (error) {
            console.error("MailerLite API Genereller Fehler:", error);
        }
    }
});
