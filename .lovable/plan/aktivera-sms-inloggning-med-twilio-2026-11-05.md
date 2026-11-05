# Aktivera SMS-inloggning med Twilio

SMS-inloggningen finns redan på inloggningssidan (svenska nummer, engångskod). Den visar just nu "SMS-inloggning är inte aktiverad ännu", eftersom ingen SMS-leverantör är kopplad till inloggningssystemet.

## Det du behöver göra (kan inte göras åt dig)
1. Skapa ett Twilio-konto och köp ett nummer som kan skicka SMS till Sverige, eller skapa en Messaging Service / Verify Service.
2. I Twilio: slå på **SMS Pumping Protection** och begränsa **SMS Geo Permissions** till Sverige, så att ingen kan skicka massor av dyra SMS i ditt namn.
3. I Lovable: **More → Users → Auth settings → Phone settings**. Slå på Phone, välj Twilio och fyll i Account SID, Auth Token och Message Service SID (eller Verify SID).
4. Kontrollera att SMS-mallen innehåller `{{ .Code }}`, t.ex. "Din Aurateori-kod: {{ .Code }}".

Inloggningsuppgifterna sparas direkt i inloggningsinställningarna och behöver inte skickas i chatten.

## Det jag gör efter godkännande
1. Kontrollerar att Phone-inloggning är aktiv i backend.
2. Skickar en testkod till ett nummer du anger och verifierar att kod-steget fungerar i förhandsvisningen.
3. Justerar felmeddelanden i SMS-rutan om det behövs (fel nummer, fel kod, för många försök).
4. Publicerar så att det fungerar på aurateori.lovable.app.

## Viktigt om Premium
Ett konto som skapas via mobilnummer saknar e-post och får inte automatiskt Premium som getts till elevens e-post. Premium ges då i adminpanelen till det nya kontot (sök på telefonnummer läggs till i elevlistan om du vill).

## Tekniska detaljer
- Ingen ny kod för SMS-utskick behövs; inloggningssystemet skickar och verifierar koden via Twilio.
- Twilio-kopplingen för appen (connector) används inte här, eftersom koden skickas av inloggningssystemet självt.
- Kostnad: Twilio debiterar per SMS (ca 0,5–1 kr till svenska nummer).
