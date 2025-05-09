// functions/newsletter-signup.js
const axios = require('axios');

exports.handler = async function(event, context) {
  // Nur POST-Anfragen akzeptieren
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: "Methode nicht erlaubt" })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { email, name } = data;
    
    // API-Key aus Umgebungsvariablen holen
    const API_KEY = process.env.MAILER_LITE_API_KEY;
    
    // Ersetze YOUR_GROUP_ID mit deiner tatsächlichen MailerLite Gruppen-ID
    const GROUP_ID = process.env.MAILER_LITE_GROUP_ID; 
    
    const response = await axios.post(
      `https://api.mailerlite.com/api/v2/groups/${GROUP_ID}/subscribers`,
      {
        email: email,
        name: name,
        resubscribe: true
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-MailerLite-ApiKey": API_KEY
        }
      }
    );
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // CORS-Header für Zugriff von beliebigen Domains
      },
      body: JSON.stringify({ 
        success: true, 
        message: "Erfolgreich zum Newsletter angemeldet!"
      })
    };
  } catch (error) {
    console.error("MailerLite Error:", error);
    
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ 
        success: false,
        message: "Fehler bei der Newsletter-Anmeldung", 
        details: error.message 
      })
    };
  }
};
