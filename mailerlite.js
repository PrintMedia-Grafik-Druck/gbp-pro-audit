// MailerLite API Integration
function sendToMailerLite(userData) {
    console.log("MailerLite: Versuche Kontakt zu erstellen", userData);

    // CORS-Proxy verwenden, um CORS-Probleme zu umgehen
    const corsProxy = 'https://corsproxy.io/?';
    const mailerliteUrl = 'https://connect.mailerlite.com/api/subscribers';
    
    // API-Schlüssel für MailerLite
    const apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNjkzYTM4NTc4ZWJmOTY1NGY2OTBiNDVmMjExNzViNWMwZTdlODIzZWZmZWFiZDQ2NmNjN2E3ZGNmYjljNDkzNmJkMDc1YzdhOGFiZTEwMGYiLCJpYXQiOjE3NDY2OTUxMTMuOTA0OTM2LCJuYmYiOjE3NDY2OTUxMTMuOTA0OTM5LCJleHAiOjQ5MDIzNjg3MTMuODk5NDI2LCJzdWIiOiIxNDIwODkxIiwic2NvcGVzIjpbXX0.Zdgdv64UEYxXTnSjUGj6DLwlQL_v7OmZFNsykcXvOiObU889tnwoRATc_TrtxGMTPSHOFaqEu_M_A3mUyaF4tQtpEQr6S_s-v9Bv4RcpbQtLt5bUBfXd6mtLdgoZRbtyQDYQOLQ1jUaggl1PDEaTujnAcAah5AtfQuJ-tRNIKuyEpX6LOK04Lb52Ua1i4h2lxckPNX-iLQR28sZ3Eg4bWW3A78Cx9Y29jYtnNbxpdMn28IFXRkSwfeWh3Jxwf1Zyq-GKl-jGXOQTEPD9futBvoaiiT4Ct9k4FC6pcgSPn0qAII2Q3Ct7jioy1rr1dJkgB30PV1rdyLiCf8M9ksMG__Ubc_GBO69fNfEEE75n_yGLn0pwfxEUZGyrYAiLPZzt1GhJv7I3-6rJlKsODKNBpvqex05IGwjuxsAEGpxViTAEnbHemWoxcQYwAvAUE06uKvgRGoiG9hmCn9k8Kz7mdDNPmT6UrBU3J8YgjjJOYJodxohmlcFvdhzuSUqMz2tosXCZqDfPyVtDRnRTBDW4NddwHlpx0PS29P5IRRU8x79yvLyYy8C79LNtUfVg1l1x4dLSdugc4N2Et9Rb339WcsUTSSGDx2KWBxFJe2nFx09viED9o_Gr9TrCqFW8yw-KrHWPwo-xYSADxaOfXyej-i1vNEQdvY1kLi8m2JWNoQA";
    
    // Gruppen-ID für MailerLite
    const groupIds = ["153798590884480855"];
    
    // Daten für die API-Anfrage vorbereiten
    const data = {
        email: userData.email,
        fields: {
            name: userData.firstname + " " + userData.lastname,
            company: userData.company,
            phone: userData.phone || "",
            website: userData.website || ""
        },
        groups: groupIds
    };
    
    // Versuchen, die API-Anfrage über den Proxy zu senden
    fetch(corsProxy + encodeURIComponent(mailerliteUrl), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log("MailerLite API Antwort:", data);
        
        // Prüfen, ob die API-Anfrage erfolgreich war
        if (data.data && data.data.id) {
            console.log("MailerLite: Kontakt erfolgreich hinzugefügt", data);
        } else {
            console.warn("MailerLite: Möglicher Fehler bei der API-Anfrage", data);
            // Bei API-Fehlern die E-Mail-Fallback-Methode verwenden
            sendMailerLiteFallback(userData);
        }
    })
    .catch(error => {
        console.error("MailerLite: Netzwerkfehler bei der API-Anfrage", error);
        // Bei Netzwerkfehlern die E-Mail-Fallback-Methode verwenden
        sendMailerLiteFallback(userData);
    });
    
    // Originale E-Mail-Fallback-Funktion
    function sendMailerLiteFallback(userData) {
        // E-Mail mit Abonnenten-Details per mailto öffnen
        const emailTo = "angebot@pm-hannover.de";
        const subject = "Neuer Newsletter-Abonnent von GBP-PRO-AUDIT";
        let body = `Neuer Newsletter-Abonnent:\n\n`;
        body += `Name: ${userData.firstname} ${userData.lastname}\n`;
        body += `E-Mail: ${userData.email}\n`;
        body += `Unternehmen: ${userData.company}\n`;
        body += `Telefon: ${userData.phone || "Nicht angegeben"}\n`;
        body += `Website: ${userData.website || "Nicht angegeben"}\n\n`;
        body += `Bitte füge diesen Kontakt zur "Google Business Optimierung"-Gruppe in MailerLite hinzu.`;
        
        // E-Mail-Client öffnen
        const mailtoLink = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink);
        
        console.log("MailerLite: Benachrichtigung über neuen Abonnenten gesendet");
    }
}
