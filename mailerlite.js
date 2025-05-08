// MailerLite API Integration
function sendToMailerLite(userData) {
    // MailerLite API Endpunkt
    const url = 'https://connect.mailerlite.com/api/subscribers';
    
    // Dein API-Schlüssel
    const apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNjkzYTM4NTc4ZWJmOTY1NGY2OTBiNDVmMjExNzViNWMwZTdlODIzZWZmZWFiZDQ2NmNjN2E3ZGNmYjljNDkzNmJkMDc1YzdhOGFiZTEwMGYiLCJpYXQiOjE3NDY2OTUxMTMuOTA0OTM2LCJuYmYiOjE3NDY2OTUxMTMuOTA0OTM5LCJleHAiOjQ5MDIzNjg3MTMuODk5NDI2LCJzdWIiOiIxNDIwODkxIiwic2NvcGVzIjpbXX0.Zdgdv64UEYxXTnSjUGj6DLwlQL_v7OmZFNsykcXvOiObU889tnwoRATc_TrtxGMTPSHOFaqEu_M_A3mUyaF4tQtpEQr6S_s-v9Bv4RcpbQtLt5bUBfXd6mtLdgoZRbtyQDYQOLQ1jUaggl1PDEaTujnAcAah5AtfQuJ-tRNIKuyEpX6LOK04Lb52Ua1i4h2lxckPNX-iLQR28sZ3Eg4bWW3A78Cx9Y29jYtnNbxpdMn28IFXRkSwfeWh3Jxwf1Zyq-GKl-jGXOQTEPD9futBvoaiiT4Ct9k4FC6pcgSPn0qAII2Q3Ct7jioy1rr1dJkgB30PV1rdyLiCf8M9ksMG__Ubc_GBO69fNfEEE75n_yGLn0pwfxEUZGyrYAiLPZzt1GhJv7I3-6rJlKsODKNBpvqex05IGwjuxsAEGpxViTAEnbHemWoxcQYwAvAUE06uKvgRGoiG9hmCn9k8Kz7mdDNPmT6UrBU3J8YgjjJOYJodxohmlcFvdhzuSUqMz2tosXCZqDfPyVtDRnRTBDW4NddwHlpx0PS29P5IRRU8x79yvLyYy8C79LNtUfVg1l1x4dLSdugc4N2Et9Rb339WcsUTSSGDx2KWBxFJe2nFx09viED9o_Gr9TrCqFW8yw-KrHWPwo-xYSADxaOfXyej-i1vNEQdvY1kLi8m2JWNoQA";
    
    // Deine Gruppen-ID
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
    
    console.log("MailerLite: Versuche Kontakt zu erstellen", data);
    
    // Browser-CORS-Problem umgehen mit formbasierten Ansatz
    // Da direkter API-Zugriff via fetch im Browser oft durch CORS blockiert wird,
    // verwenden wir eine E-Mail-Benachrichtigung, dass ein neuer Abonnent vorhanden ist
    
    // E-Mail mit Abonnenten-Details an dich senden
    const emailTo = "angebot@pm-hannover.de";
    const subject = "Neuer Newsletter-Abonnent von GBP-PRO-AUDIT";
    let body = `Neuer Newsletter-Abonnent:\n\n`;
    body += `Name: ${userData.firstname} ${userData.lastname}\n`;
    body += `E-Mail: ${userData.email}\n`;
    body += `Unternehmen: ${userData.company}\n`;
    body += `Telefon: ${userData.phone || "Nicht angegeben"}\n`;
    body += `Website: ${userData.website || "Nicht angegeben"}\n\n`;
    body += `Bitte füge diesen Kontakt zur "Google Business Optimierung"-Gruppe in MailerLite hinzu.`;
    
    // Wenn der Browser es unterstützt, E-Mail-Client öffnen
    const mailtoLink = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Für Testzwecke: Öffnen wir das Mail-Programm nur, wenn der Nutzer es erlaubt
    if (confirm("Möchten Sie uns über den neuen Newsletter-Abonnenten informieren? Dies öffnet Ihr E-Mail-Programm.")) {
        window.open(mailtoLink);
    }
    
    // Optional: Logging
    console.log("MailerLite: Benachrichtigung über neuen Abonnenten gesendet");
}

// PDF-Generierung
function generatePDF() {
    if (typeof window.jspdf === 'undefined') {
        alert('Die PDF-Bibliothek wird geladen. Bitte versuchen Sie es in wenigen Sekunden erneut.');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Titel
        doc.setFontSize(22);
        doc.setTextColor(6, 102, 204); // #0066cc
        doc.text('GBP-PRO-AUDIT Ergebnis', 105, 20, null, null, 'center');
        
        // Unternehmensdaten
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Unternehmensdaten:', 20, 40);
        doc.setFontSize(10);
        doc.text(`Unternehmen: ${userData.company}`, 20, 50);
        doc.text(`Kontaktperson: ${userData.firstname} ${userData.lastname}`, 20, 57);
        doc.text(`E-Mail: ${userData.email}`, 20, 64);
        doc.text(`Telefon: ${userData.phone || "Nicht angegeben"}`, 20, 71);
        doc.text(`Website: ${userData.website || "Nicht angegeben"}`, 20, 78);
        doc.text(`Datum: ${new Date().toLocaleDateString()}`, 20, 85);
        
        // Auswertung
        const percentage = calculatePercentage();
        doc.setFontSize(14);
        doc.setTextColor(6, 102, 204);
        doc.text('Auswertung Ihres Google Business Profils', 20, 100);
        
        // Score anzeigen
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(60, 110, 90, 30, 3, 3, 'F');
        
        // Score-Farbe basierend auf Prozentsatz
        let scoreColor;
        if (percentage < 40) {
            scoreColor = [255, 77, 77]; // Rot
        } else if (percentage < 70) {
            scoreColor = [255, 165, 0]; // Orange
        } else {
            scoreColor = [76, 175, 80]; // Grün
        }
        
        // Score-Text
        doc.setFontSize(24);
        doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
        doc.text(`${percentage}%`, 105, 130, null, null, 'center');
        
        // Empfehlungen
        const recommendations = getRecommendations();
        doc.setFontSize(14);
        doc.setTextColor(6, 102, 204);
        doc.text('Empfehlungen zur Verbesserung:', 20, 150);
        
        // Empfehlungsliste
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        let y = 160;
        
        recommendations.forEach((recommendation, index) => {
            // Text umbrechen, damit er auf die Seite passt
            const lines = doc.splitTextToSize(`${index + 1}. ${recommendation}`, 170);
            doc.text(lines, 20, y);
            y += 10 * lines.length;
            
            // Neue Seite, falls nötig
            if (y > 270 && index < recommendations.length - 1) {
                doc.addPage();
                y = 20;
            }
        });
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Erstellt von PrintMedia Grafik + Druck | Tel: 0511 - 978 24 748', 105, 285, null, null, 'center');
        
        // PDF speichern
        doc.save(`GBP-Audit_${userData.company.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
        
        console.log("PDF erfolgreich generiert");
    } catch (error) {
        console.error("Fehler bei der PDF-Generierung:", error);
        alert("Bei der Erstellung des PDFs ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
    }
}

// Hilfsfunktion für Empfehlungen
function getRecommendations() {
    const recommendations = {
        1: "Verifizieren Sie Ihr Google Business Profil, um die Glaubwürdigkeit zu erhöhen und alle Funktionen nutzen zu können.",
        2: "Stellen Sie sicher, dass Ihre Geschäftsdaten vollständig und aktuell sind. Korrekte Daten sind für die lokale Suche entscheidend.",
        3: "Tragen Sie Ihre regulären Öffnungszeiten ein und vergessen Sie nicht, Sonderöffnungszeiten für Feiertage zu aktualisieren.",
        4: "Laden Sie hochwertige Fotos in verschiedenen Kategorien hoch: Außenansicht, Innenansicht, Team, Produkte oder Dienstleistungen.",
        5: "Veröffentlichen Sie regelmäßig Google Posts, um Kunden über Neuigkeiten, Angebote oder Events zu informieren.",
        6: "Bitten Sie zufriedene Kunden aktiv um Bewertungen. Positive Bewertungen verbessern Ihre Sichtbarkeit und das Vertrauen potenzieller Kunden.",
        7: "Antworten Sie auf alle Bewertungen - sowohl positive als auch negative. Dies zeigt, dass Sie sich um Kundenfeedback kümmern.",
        8: "Wählen Sie neben Ihrer Hauptkategorie auch relevante Unterkategorien, um Ihre Auffindbarkeit für verschiedene Suchanfragen zu verbessern.",
        9: "Aktivieren Sie alle relevanten Attribute und Funktionen, um Ihr Profil vollständig zu beschreiben.",
        10: "Überprüfen Sie regelmäßig Ihre GBP-Statistiken, um zu verstehen, wie Kunden mit Ihrem Profil interagieren."
    };
    
    // Prüfen, welche Bereiche verbessert werden können
    const missedQuestions = [];
    for (let i = 1; i <= 10; i++) {
        if (answers[i] < 8) {
            missedQuestions.push(i);
        }
    }
    
    if (missedQuestions.length === 0) {
        return ["Hervorragend! Ihr Google Business Profil ist bereits sehr gut optimiert. Behalten Sie Ihre Strategie bei und aktualisieren Sie regelmäßig Ihre Inhalte."];
    } else {
        return missedQuestions.map(q => recommendations[q]);
    }
}

// E-Mail-Versand für Paketanfragen
function sendPackageRequest(packageName) {
    const emailTo = "angebot@pm-hannover.de";
    const subject = `GBP-PRO-AUDIT: Anfrage ${packageName.toUpperCase()} Paket`;
    const percentage = calculatePercentage();
    
    // E-Mail-Body erstellen
    let body = `Sehr geehrtes PrintMedia-Team,\n\n`;
    body += `Ich interessiere mich für Ihr ${packageName.toUpperCase()} Paket für Google Business Profile Optimierung.\n\n`;
    body += `Mein GBP-PRO-AUDIT Ergebnis: ${percentage}%\n\n`;
    body += `Hier sind meine Kontaktdaten:\n`;
    body += `Unternehmen: ${userData.company}\n`;
    body += `Name: ${userData.firstname} ${userData.lastname}\n`;
    body += `E-Mail: ${userData.email}\n`;
    body += `Telefon: ${userData.phone || "Nicht angegeben"}\n`;
    body += `Website: ${userData.website || "Nicht angegeben"}\n\n`;
    body += `Bitte kontaktieren Sie mich für ein individuelles Angebot.\n\n`;
    body += `Mit freundlichen Grüßen,\n${userData.firstname} ${userData.lastname}`;
    
    // E-Mail-Link erstellen und öffnen
    const mailtoLink = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    
    // Hinweis anzeigen
    alert(`Vielen Dank für Ihr Interesse am ${packageName.toUpperCase()} Paket!\n\nEine E-Mail-Vorlage wurde erstellt. Bitte senden Sie diese ab, um Ihre Anfrage zu übermitteln.\n\nWir werden uns umgehend bei Ihnen melden.`);
}
