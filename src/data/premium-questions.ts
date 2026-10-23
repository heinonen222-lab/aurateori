import type { Question } from "./questions";

export const PREMIUM_QUESTIONS: Question[] = [
  {
    "id": "q11",
    "category": "Trafikregler",
    "question": "Vad innebär högerregeln?",
    "options": [
      "Du har alltid företräde",
      "Du ska lämna företräde åt fordon som kommer från höger",
      "Endast på huvudled",
      "Bara vid rondeller"
    ],
    "correct": 1,
    "explanation": "Vid korsning utan skyltning gäller högerregeln – lämna företräde åt fordon från höger.",
    "reference": "Trafikförordningen 3 kap. 18 §"
  },
  {
    "id": "q12",
    "category": "Vägmärken",
    "image": "forbud-hastighet-50",
    "question": "Detta märke gäller tills...",
    "options": [
      "Nästa korsning",
      "Till annan hastighet med C31 eller till C32, E7 eller E9",
      "Slutet av dagen",
      "Nästa rondell"
    ],
    "correct": 1,
    "explanation": "C31 gäller tills annan hastighet anges med C31, eller tills C32 (tillfällig hastighetsbegränsning upphör), E7 (gågata) eller E9 (gångfartsområde) är uppsatt. En korsning eller tätortsgräns upphäver inte i sig C31.",
    "reference": "Vägmärkesförordning C31",
    "source": {
      "label": "Vägmärkesförordningen – C31",
      "url": "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/vagmarkesforordning-200790_sfs-2007-90/"
    }
  },
  {
    "id": "q13",
    "category": "Trafikregler",
    "image": "pabud-rondellen",
    "question": "Vad gäller när du kör i en cirkulationsplats?",
    "options": [
      "Fordon som ska in har företräde",
      "Fordon som är i cirkulationen har företräde; blinka höger vid utfart",
      "Ingen blinkning behövs",
      "Blinka vänster vid ingång"
    ],
    "correct": 1,
    "explanation": "Vid infart ska du väja för fordon i cirkulationsplatsen. Det finns inget krav på tecken vid infart. Ge tecken vid körfältsbyte och blinka höger vid utfart.",
    "reference": "Trafikförordningen 3 kap. 22 och 65 §§"
  },
  {
    "id": "q14",
    "category": "Människan & Trafiken",
    "question": "Hur mycket ökar bromssträckan om hastigheten fördubblas och bromsförmåga och väggrepp är oförändrade?",
    "options": [
      "2 gånger",
      "3 gånger",
      "4 gånger",
      "Ingen skillnad"
    ],
    "correct": 2,
    "explanation": "Bromssträckan ökar med kvadraten av hastigheten. Fördubblad hastighet ger 4 ggr längre bromssträcka.",
    "reference": "Fysikens lagar – kinetisk energi"
  },
  {
    "id": "q15",
    "category": "Fordonskännedom",
    "question": "Vad ska du göra om ABS-lampan tänds under körning?",
    "options": [
      "Ignorera lampan",
      "Stanna säkert och kontrollera instruktionsboken; uppsök verkstad enligt anvisning",
      "Fortsätt utan att kontrollera bromsarna",
      "Slå av tändningen medan bilen rullar"
    ],
    "correct": 1,
    "explanation": "ABS-varning kan betyda att låsningsskyddet inte fungerar. Bromsarnas övriga funktion måste kontrolleras enligt instruktionsboken. Kör inte vidare vid nedsatt bromsverkan.",
    "reference": "Fordonets instruktionsbok – ABS-varning"
  },
  {
    "id": "q16",
    "category": "Vägmärken",
    "image": "varning-vilt",
    "question": "Vad varnar detta märke för?",
    "options": [
      "Tama djur på vägen",
      "Vilt (t.ex. älg)",
      "Hundpark",
      "Ridväg"
    ],
    "correct": 1,
    "explanation": "Varning för vilt – oftast älg eller rådjur. Sänk hastigheten och håll extra uppsikt i skymningen.",
    "reference": "Vägmärkesförordningen A19"
  },
  {
    "id": "q17",
    "category": "Miljö",
    "question": "Vilken faktor påverkar bränsleförbrukningen MEST negativt?",
    "options": [
      "Att köra i rätt växel",
      "Aggressiv körning med hastiga accelerationer",
      "Att hålla jämn hastighet",
      "Rätt lufttryck i däcken"
    ],
    "correct": 1,
    "explanation": "Hastiga accelerationer och onödiga inbromsningar ökar normalt förbrukningen. Hur mycket beror på bil och körförhållanden.",
    "reference": "Energimyndigheten – Sparsam körning"
  },
  {
    "id": "q18",
    "category": "Trafikregler",
    "question": "Vilken hastighet gäller normalt på landsväg om inget vägmärke finns?",
    "options": [
      "50 km/h",
      "70 km/h",
      "80 km/h",
      "90 km/h"
    ],
    "correct": 1,
    "explanation": "Utanför tättbebyggt område är bashastigheten 70 km/h om inget annat anges med vägmärke.",
    "reference": "Trafikförordningen 3 kap. 17 §"
  },
  {
    "id": "q19",
    "category": "Trafikregler",
    "question": "Får du parkera 8 meter före ett övergångsställe?",
    "options": [
      "Ja, om det inte står stoppförbud",
      "Nej, det är förbjudet inom 10 meter före ett övergångsställe",
      "Ja, i högst 10 minuter",
      "Endast nattetid"
    ],
    "correct": 1,
    "explanation": "Du får inte stanna eller parkera inom 10 meter före ett övergångsställe, korsning eller cykelöverfart.",
    "reference": "Trafikförordningen 3 kap. 53 §"
  },
  {
    "id": "q20",
    "category": "Trafikregler",
    "question": "Vad gäller vid en järnvägskorsning utan bommar?",
    "options": [
      "Du har alltid företräde",
      "Du måste anpassa hastigheten och lämna företräde åt tåg",
      "Du måste alltid stanna helt",
      "Endast om ljussignalen blinkar vitt"
    ],
    "correct": 1,
    "explanation": "Tåg har alltid företräde. Utan bommar måste du sänka farten och försäkra dig om att spåret är fritt.",
    "reference": "Trafikförordningen 2 kap. 7 §"
  },
  {
    "id": "q21",
    "category": "Trafikregler",
    "question": "När ska en bil köras om på höger sida, om omkörningen kan göras säkert?",
    "options": [
      "Aldrig",
      "När föraren framför svänger vänster eller tydligt förbereder en vänstersväng",
      "Alltid på motorväg",
      "Alltid vid vägarbete"
    ],
    "correct": 1,
    "explanation": "Omkörning ska ske till höger när framförvarande svänger vänster eller tydligt förbereder det. På väg med högst 70 km/h och flera markerade körfält finns ytterligare undantag; parallell köpassage regleras särskilt.",
    "reference": "Trafikförordningen 3 kap. 7, 31 och 41 §§"
  },
  {
    "id": "q22",
    "category": "Trafikregler",
    "question": "Vad innebär en heldragen linje mitt i vägen?",
    "options": [
      "Du får alltid korsa den om vägen är fri",
      "Som huvudregel får du inte korsa linjen; särskilda undantag finns",
      "Den är bara en rekommendation",
      "Den markerar alltid busskörfält"
    ],
    "correct": 1,
    "explanation": "Huvudregeln är att en heldragen linje inte får korsas. Med särskild försiktighet finns undantag för hinder, otillräckligt utrymme i korsning, färd till eller från fastighet och när en streckad linje löper omedelbart till höger om den heldragna linjen i färdriktningen.",
    "reference": "Trafikförordningen 3 kap. 11 §; Vägmärkesförordningen M8"
  },
  {
    "id": "q23",
    "category": "Trafikregler",
    "question": "Du ska svänga vänster och möter en bil som kör rakt fram. Vad gäller?",
    "options": [
      "Mötande ska alltid väja",
      "Svängen får inte hindra mötande trafik",
      "Blinkers ger dig företräde",
      "Du ska svänga först om du är störst"
    ],
    "correct": 1,
    "explanation": "Sväng bara när det kan ske utan hinder för mötande trafik. Regler för gående, cykelpassager och cykelöverfarter gäller dessutom där sådana finns.",
    "reference": "Trafikförordningen 3 kap. 24 och 60–61 a §§"
  },
  {
    "id": "q24",
    "category": "Trafikregler",
    "question": "Hur långt före en sväng bör du ge tecken (blinkers)?",
    "options": [
      "Direkt när du svänger",
      "I god tid så att andra hinner uppfatta din avsikt",
      "Minst 200 meter före",
      "Bara om det finns andra fordon"
    ],
    "correct": 1,
    "explanation": "Tecken ska ges i god tid före manövern och avbrytas efteråt. Tecken ger dock aldrig förtur.",
    "reference": "Trafikförordningen 3 kap. 65 §"
  },
  {
    "id": "q25",
    "category": "Trafikregler",
    "question": "Vilka får normalt använda ett körfält för fordon i linjetrafik?",
    "options": [
      "Alla bilar",
      "Fordon i linjetrafik samt cykel och moped klass II om fältet ligger till höger; annan skyltning kan gälla",
      "Bara personbilar efter kl. 18",
      "Taxi har alltid rätt att använda det"
    ],
    "correct": 1,
    "explanation": "Fordon i linjetrafik får använda körfältet. Om det ligger till höger får även cykel och moped klass II föras där. Taxi kräver särskilt tillstånd i föreskrifter eller skyltning.",
    "reference": "Trafikförordningen 8 kap. 2 §"
  },
  {
    "id": "q26",
    "category": "Trafikregler",
    "question": "Får du använda mobiltelefon under körning?",
    "options": [
      "Ja, alltid",
      "Bara utan handhållen användning och utan att körningen påverkas negativt",
      "Ja, under 30 km/h",
      "Ja, för meddelanden"
    ],
    "correct": 1,
    "explanation": "Handhållen användning är förbjuden. Även handsfree får bara användas om det inte inverkar menligt på körningen.",
    "reference": "Trafikförordningen 4 kap. 10 e §"
  },
  {
    "id": "q27",
    "category": "Trafikregler",
    "question": "Vad gäller på en gågata?",
    "options": [
      "Högsta hastighet 30 km/h",
      "Gångfart, gående har företräde och parkering är endast tillåten på markerade platser",
      "Fri fart om inga gående syns",
      "Motorfordon är alltid förbjudna"
    ],
    "correct": 1,
    "explanation": "På gågata och i gångfartsområde gäller gångfart anpassad till gående och väjningsplikt mot gående. Parkering kräver särskilt tillåten plats. Motordriven trafik på gågata är dessutom begränsad till vissa ändamål.",
    "reference": "Trafikförordningen 8 kap. 1 §"
  },
  {
    "id": "q28",
    "category": "Trafikregler",
    "question": "Vad ska du göra när ett utryckningsfordon närmar sig med blåljus och siren?",
    "options": [
      "Bromsa tvärt där du är",
      "Lämna fri väg, kör åt sidan och stanna vid behov på säker plats",
      "Öka farten för att komma undan",
      "Fortsätta som vanligt"
    ],
    "correct": 1,
    "explanation": "Du ska lämna fri väg men får inte skapa fara – kör åt sidan när det är säkert, blockera inte korsningar.",
    "reference": "Trafikförordningen 2 kap. 5 §"
  },
  {
    "id": "q29",
    "category": "Trafikregler",
    "question": "Vad gäller vid stopp för rött ljus tillsammans med grön pil åt höger?",
    "options": [
      "Du får inte köra alls",
      "Du får köra i pilens riktning och ska fortfarande följa tillämpliga trafikregler",
      "Du får köra i alla riktningar",
      "Pilen betyder bara varning"
    ],
    "correct": 1,
    "explanation": "Grön pil gäller färdriktningen som pilen anger, även när annan signalbild visas samtidigt. Visa omsorg och följ tillämpliga regler.",
    "reference": "Vägmärkesförordningen 3 kap. 6 §"
  },
  {
    "id": "q30",
    "category": "Vägmärken",
    "image": "varning-halka",
    "question": "Vad varnar detta märke för?",
    "options": [
      "Grusväg",
      "Slirig väg",
      "Ojämn väg",
      "Vägarbete"
    ],
    "correct": 1,
    "explanation": "Märket varnar för att vägbanan kan vara hal, t.ex. vid regn, is eller lös grus.",
    "reference": "Vägmärkesförordningen A10"
  },
  {
    "id": "q31",
    "category": "Vägmärken",
    "image": "forbud-omkorning",
    "question": "Vilket fordon är undantaget från omkörningsförbudet C27?",
    "options": [
      "Personbil",
      "Tvåhjulig motorcykel utan sidvagn",
      "Lastbil",
      "Motorcykel med sidvagn"
    ],
    "correct": 1,
    "explanation": "C27 förbjuder omkörning av andra motordrivna fordon än tvåhjuliga mopeder och tvåhjuliga motorcyklar utan sidvagn. Övriga regler för säker omkörning gäller.",
    "reference": "Vägmärkesförordning C27"
  },
  {
    "id": "q32",
    "category": "Vägmärken",
    "image": "varning-barn",
    "question": "Vad innebär detta märke för din hastighet?",
    "options": [
      "Hastigheten sänks automatiskt till 30 km/h",
      "Ingen automatisk sänkning – du måste själv anpassa hastigheten",
      "Du måste stanna",
      "Hastigheten höjs till 50 km/h"
    ],
    "correct": 1,
    "explanation": "Varningsmärket ändrar inte hastighetsgränsen, men du är skyldig att anpassa farten efter risken.",
    "reference": "Vägmärkesförordningen A15"
  },
  {
    "id": "q33",
    "category": "Vägmärken",
    "image": "vajningsplikt",
    "question": "Vad betyder detta märke?",
    "options": [
      "Stopplikt – stanna alltid",
      "Väjningsplikt – lämna företräde men du behöver inte stanna om vägen är fri",
      "Huvudled börjar",
      "Förbud mot infart"
    ],
    "correct": 1,
    "explanation": "Väjningsplikt innebär att du ska lämna företräde. Du måste stanna endast om det behövs.",
    "reference": "Vägmärkesförordning B1"
  },
  {
    "id": "q34",
    "category": "Vägmärken",
    "image": "forbud-parkering",
    "question": "Vad betyder detta märke?",
    "options": [
      "Förbud att stanna och parkera",
      "Förbud att parkera – du får stanna för av- och påstigning",
      "Parkering tillåten i 24 timmar",
      "Endast lastning förbjuden"
    ],
    "correct": 1,
    "explanation": "Parkeringsförbud tillåter kortare stopp för av-/påstigning eller lastning, men inte parkering.",
    "reference": "Vägmärkesförordning C35"
  },
  {
    "id": "q35",
    "category": "Vägmärken",
    "image": "forbud-stannaparkera",
    "question": "Vad innebär märket med två röda kryssande streck i röd cirkel?",
    "options": [
      "Parkering förbjuden men stannande tillåtet",
      "Förbud att stanna och parkera",
      "Tillfällig parkering tillåten",
      "Förbud mot infart"
    ],
    "correct": 1,
    "explanation": "Märket förbjuder både stannande och parkering, utom vid trafiksignal eller för att undvika fara.",
    "reference": "Vägmärkesförordning C39"
  },
  {
    "id": "q36",
    "category": "Vägmärken",
    "image": "info-motorvag",
    "question": "Vad gäller på motorväg?",
    "options": [
      "Backning och U-sväng är tillåten på vägrenen",
      "Endast motorfordon som kan och får köra minst 40 km/h får framföras",
      "Alla fordon inklusive moped klass II får köra",
      "Ingen hastighetsgräns"
    ],
    "correct": 1,
    "explanation": "Motorfordon eller motorfordonståg ska vara konstruerade för och få framföras i minst 40 km/h. Moped klass I är ändå förbjuden. Backning och vändning är förbjuden; stannande tillåts på utmärkta parkerings- eller rastplatser.",
    "reference": "Trafikförordningen 9 kap."
  },
  {
    "id": "q37",
    "category": "Vägmärken",
    "image": "varning-vagarbete",
    "question": "Vad ska du tänka på vid detta märke?",
    "options": [
      "Öka hastigheten för att snabbt passera",
      "Sänk hastigheten, håll extra avstånd och räkna med vägarbetare nära körbanan",
      "Märket gäller endast vardagar",
      "Du får köra om fritt"
    ],
    "correct": 1,
    "explanation": "Vid vägarbete gäller ofta tillfälliga hastighetsgränser och personal kan befinna sig nära körbanan.",
    "reference": "Vägmärkesförordning A20"
  },
  {
    "id": "q38",
    "category": "Vägmärken",
    "image": "anv-enkelriktat",
    "question": "Vad betyder märket med vit pil på blå rektangel?",
    "options": [
      "Påbjuden körriktning",
      "Enkelriktad trafik i pilens riktning",
      "Motorväg börjar",
      "Återvändsgata"
    ],
    "correct": 1,
    "explanation": "E16 anger fordonstrafik i pilens riktning. Var uppmärksam på tillåtna undantag och andra trafikanter.",
    "reference": "Vägmärkesförordning E16"
  },
  {
    "id": "q39",
    "category": "Vägmärken",
    "image": "pabud-hoger",
    "question": "Vad kräver detta blå runda märke med pil?",
    "options": [
      "Rekommenderad körriktning",
      "Påbjuden körriktning – du måste köra åt det håll pilen visar",
      "Varning för kurva",
      "Förbud att svänga"
    ],
    "correct": 1,
    "explanation": "Blå runda märken är påbudsmärken – de anger vad du måste göra, till skillnad från rekommendationer.",
    "reference": "Vägmärkesförordning D1"
  },
  {
    "id": "q40",
    "category": "Miljö",
    "question": "Vilket ämne bidrar mest till växthuseffekten från bilavgaser?",
    "options": [
      "Kolmonoxid (CO)",
      "Koldioxid (CO2)",
      "Kväveoxider (NOx)",
      "Svaveldioxid"
    ],
    "correct": 1,
    "explanation": "Koldioxid är den största klimatpåverkande gasen från förbränning av fossila drivmedel.",
    "reference": "Naturvårdsverket – utsläpp från vägtrafik"
  },
  {
    "id": "q41",
    "category": "Miljö",
    "question": "Vad orsakar kväveoxider (NOx) främst?",
    "options": [
      "Global uppvärmning",
      "Försurning, övergödning och luftvägsproblem",
      "Ozonlagrets uttunning",
      "Inget alls"
    ],
    "correct": 1,
    "explanation": "Kväveoxider bidrar till försurning, övergödning och marknära ozon samt irriterar luftvägarna.",
    "reference": "Naturvårdsverket"
  },
  {
    "id": "q42",
    "category": "Miljö",
    "question": "Hur påverkar för lågt lufttryck i däcken miljön?",
    "options": [
      "Ingen påverkan",
      "Ökat rullmotstånd ger högre bränsleförbrukning och mer utsläpp",
      "Minskar bränsleförbrukningen",
      "Endast däckslitaget påverkas"
    ],
    "correct": 1,
    "explanation": "För lågt däcktryck ökar rullmotståndet, vilket ger högre förbrukning, mer utsläpp och snabbare däckslitage.",
    "reference": "Energimyndigheten – Sparsam körning"
  },
  {
    "id": "q43",
    "category": "Miljö",
    "question": "Vad är katalysatorns uppgift?",
    "options": [
      "Öka motoreffekten",
      "Omvandla skadliga avgaser till mindre skadliga ämnen",
      "Sänka bränsleförbrukningen",
      "Rena motoroljan"
    ],
    "correct": 1,
    "explanation": "Katalysatorn omvandlar kolmonoxid, kolväten och kväveoxider till koldioxid, vatten och kväve. Den fungerar bäst när den är varm.",
    "reference": "Transportstyrelsen – avgasrening"
  },
  {
    "id": "q44",
    "category": "Miljö",
    "question": "När släpper bilen ut mest skadliga avgaser?",
    "options": [
      "Vid landsvägskörning",
      "Vid kallstart och korta körsträckor",
      "Vid motorbromsning",
      "På motorväg"
    ],
    "correct": 1,
    "explanation": "Vid kallstart är katalysatorn inte varm och renar dåligt. Korta resor ger därför störst utsläpp per kilometer.",
    "reference": "Naturvårdsverket"
  },
  {
    "id": "q45",
    "category": "Miljö",
    "question": "Vilket drivmedel räknas som förnybart?",
    "options": [
      "Bensin",
      "Diesel (MK1)",
      "HVO100 och etanol E85",
      "Naturgas från fossila källor"
    ],
    "correct": 2,
    "explanation": "HVO100 och etanol tillverkas av förnybar råvara och ger lägre nettoutsläpp av fossil koldioxid.",
    "reference": "Energimyndigheten – förnybara drivmedel"
  },
  {
    "id": "q46",
    "category": "Miljö",
    "question": "Vilket körsätt kan minska bränsleförbrukningen?",
    "options": [
      "Onödiga inbromsningar",
      "Höga varvtal",
      "Framförhållning, jämn fart och lämplig växel",
      "Tomgång i tio minuter"
    ],
    "correct": 2,
    "explanation": "Sparsam körning minskar normalt förbrukningen. En bestämd procentsats gäller inte alla bilar och körförhållanden.",
    "reference": "Trafikverket – Sparsam körning"
  },
  {
    "id": "q47",
    "category": "Miljö",
    "question": "Vad bör du göra med takboxen när den inte används?",
    "options": [
      "Låta den sitta kvar – ingen skillnad",
      "Ta av den, den ökar luftmotståndet och bränsleförbrukningen",
      "Vända den bakåt",
      "Fylla den med last för balans"
    ],
    "correct": 1,
    "explanation": "Takboxen ökar normalt luftmotstånd och förbrukning. Ökningen varierar med bil, box och hastighet.",
    "reference": "Energimyndigheten"
  },
  {
    "id": "q48",
    "category": "Människan & Trafiken",
    "question": "Vad kan förlänga förarens reaktionstid?",
    "options": [
      "Att vara utvilad",
      "Trötthet och distraktion",
      "Att vara uppmärksam",
      "Att ta paus"
    ],
    "correct": 1,
    "explanation": "Reaktionstiden varierar med förare och situation. Trötthet och distraktion kan förlänga den; i räkneuppgifter anges reaktionstiden.",
    "reference": "Trafikverket – reaktionstid"
  },
  {
    "id": "q49",
    "category": "Människan & Trafiken",
    "question": "Vilken tidslucka används i tresekundersregeln som tumregel vid goda förhållanden?",
    "options": [
      "1 sekund",
      "Minst 3 sekunder",
      "0,5 sekunder",
      "10 sekunder"
    ],
    "correct": 1,
    "explanation": "Tre sekunder är en tumregel, inte en garanti eller lagstadgat minimiavstånd. Vid halka och dålig sikt behövs större marginaler.",
    "reference": "Trafikförordningen 3 kap. 2 §; tresekundersregeln är en tumregel"
  },
  {
    "id": "q50",
    "category": "Människan & Trafiken",
    "question": "Hur snabbt bryts alkohol ned i kroppen ungefär?",
    "options": [
      "0,05 promille per timme",
      "Cirka 0,15 promille per timme",
      "0,5 promille per timme",
      "1 promille per timme"
    ],
    "correct": 1,
    "explanation": "Ungefär 0,15 promille per timme är en genomsnittlig uppskattning, inte en garanti. Variationerna är stora. Använd aldrig denna siffra för att avgöra när det är säkert eller lagligt att köra.",
    "reference": "Trafikverket – alkohol i trafiken"
  },
  {
    "id": "q51",
    "category": "Människan & Trafiken",
    "question": "Vilken kombination ökar olycksrisken för en oerfaren förare?",
    "options": [
      "Tekniska fel på bilen",
      "Hög hastighet i kombination med bristande erfarenhet och risktagande",
      "Dåliga vägmärken",
      "För låg hastighet"
    ],
    "correct": 1,
    "explanation": "Hög hastighet och risktagande tillsammans med liten erfarenhet ökar risken. Detta är inte ett påstående om en viss statistiskt vanligaste olycksorsak.",
    "reference": "Trafikanalys – olycksstatistik"
  },
  {
    "id": "q52",
    "category": "Människan & Trafiken",
    "question": "Vad innebär tunnelseende vid hög hastighet?",
    "options": [
      "Synfältet blir bredare",
      "Synfältet smalnar av och du upptäcker mindre i periferin",
      "Du ser bättre i mörker",
      "Ingen förändring sker"
    ],
    "correct": 1,
    "explanation": "Ju högre hastighet, desto smalare blir synfältet. Detta gör att du missar risker vid vägkanten.",
    "reference": "VTI – syn och hastighet"
  },
  {
    "id": "q53",
    "category": "Människan & Trafiken",
    "question": "Vad ökar risken för trötthet mest vid längre körning?",
    "options": [
      "Att ta pauser var annan timme",
      "Monoton körning, värme i kupén och för lite sömn",
      "Att lyssna på radio",
      "Att köra på morgonen"
    ],
    "correct": 1,
    "explanation": "Monotoni, varm kupé och sömnbrist ökar tröttheten kraftigt. Ta paus minst varannan timme.",
    "reference": "Trafikverket – trötthet i trafiken"
  },
  {
    "id": "q54",
    "category": "Människan & Trafiken",
    "question": "Hur tar du reda på om ett läkemedel kan påverka körförmågan?",
    "options": [
      "Läkemedel påverkar aldrig",
      "Läs bipacksedeln och fråga läkare eller apotekspersonal vid behov",
      "Kontrollera bara förpackningens färg",
      "Kör en provtur oavsett hur du mår"
    ],
    "correct": 1,
    "explanation": "Läkemedel kan försämra körförmågan även utan särskild märkning. Läs bipacksedeln, bedöm hur du påverkas och fråga läkare eller apotekspersonal. Kör inte om din körförmåga är nedsatt.",
    "reference": "Läkemedelsverket – Bilkörning och läkemedel",
    "source": {
      "label": "Läkemedelsverket – Bilkörning",
      "url": "https://www.lakemedelsverket.se/sv/behandling-och-forskrivning/kopa-anvanda-och-hantera/anvanda-medicin/bilkorning"
    }
  },
  {
    "id": "q55",
    "category": "Människan & Trafiken",
    "question": "Vad är stoppsträcka?",
    "options": [
      "Endast bromssträckan",
      "Reaktionssträcka plus bromssträcka",
      "Sträckan efter att bilen har stannat",
      "Avståndet till framförvarande"
    ],
    "correct": 1,
    "explanation": "Stoppsträckan består av reaktionssträckan (medan du reagerar) och bromssträckan (medan bilen bromsar).",
    "reference": "Trafikverket – stoppsträcka"
  },
  {
    "id": "q56",
    "category": "Människan & Trafiken",
    "question": "Hur bör du agera mot en cyklist du ska köra om?",
    "options": [
      "Passera nära och snabbt",
      "Håll betryggande sidoavstånd och anpassa hastigheten",
      "Tuta hela tiden",
      "Kör om i skymd kurva"
    ],
    "correct": 1,
    "explanation": "Håll betryggande sidoavstånd och anpassa hastigheten. Vänta om utrymmet är otillräckligt. Lagen anger inte en generell fast gräns på 1,5 meter.",
    "reference": "Trafikförordningen 3 kap. 32–33 §§"
  },
  {
    "id": "q57",
    "category": "Fordonskännedom",
    "question": "Vilket minsta mönsterdjup krävs på en personbil högst 3 500 kg vid vinterväglag 1 december–31 mars?",
    "options": [
      "1,6 mm",
      "3,0 mm",
      "4,0 mm",
      "5,0 mm"
    ],
    "correct": 1,
    "explanation": "Vinterdäck måste ha minst 3 mm mönsterdjup när vinterväglag råder.",
    "reference": "Transportstyrelsen – Vinterdäck"
  },
  {
    "id": "q58",
    "category": "Fordonskännedom",
    "question": "Vad innebär det om varningslampan för motorolja (röd oljekanna) tänds?",
    "options": [
      "Dags för service snart",
      "Lågt oljetryck – stanna omedelbart och stäng av motorn",
      "Oljan behöver bytas inom 1000 km",
      "Endast en påminnelse"
    ],
    "correct": 1,
    "explanation": "Röd oljelampa betyder lågt oljetryck. Fortsatt körning kan förstöra motorn – stanna säkert och stäng av.",
    "reference": "Transportstyrelsen / instruktionsbok"
  },
  {
    "id": "q59",
    "category": "Fordonskännedom",
    "question": "Vad är servostyrningens funktion?",
    "options": [
      "Att bromsa hjulen",
      "Att förstärka din kraft på ratten så styrningen blir lättare",
      "Att hålla hastigheten konstant",
      "Att styra bilen automatiskt"
    ],
    "correct": 1,
    "explanation": "Servon förstärker rattkraften. Om den slutar fungera går bilen fortfarande att styra, men det krävs mycket mer kraft.",
    "reference": "Fordonsteknik – styrsystem"
  },
  {
    "id": "q60",
    "category": "Fordonskännedom",
    "question": "När ska en vanlig personbil högst 3 500 kg kontrollbesiktigas?",
    "options": [
      "Varje halvår",
      "Först senast efter 36 månader, sedan 24 månader och därefter senast var 14:e månad",
      "Alltid vart tredje år",
      "Aldrig efter första gången"
    ],
    "correct": 1,
    "explanation": "För en vanlig personbil med totalvikt högst 3 500 kg: första besiktningen senast 36 månader efter månaden då bilen togs i trafik första gången, andra senast 24 månader efter första besiktningsmånaden och därefter senast 14 månader efter föregående besiktningsmånad. Särskilda undantag finns.",
    "reference": "Transportstyrelsen – Besiktningsregler för personbil",
    "source": {
      "label": "Transportstyrelsen – Besiktningsintervall",
      "url": "https://www.transportstyrelsen.se/sv/vagtrafik/fordon/aga-kopa-eller-salja-fordon/fordonsbesiktning/besiktningsregler/personbil-och-lastbil-som-inte-overstiger-3500-kg-i-totalvikt/"
    }
  },
  {
    "id": "q61",
    "category": "Fordonskännedom",
    "question": "Vad betyder ESP/ESC i en bil?",
    "options": [
      "Låsningsfria bromsar",
      "Antisladdsystem som bromsar enskilda hjul för att hålla bilen stabil",
      "Farthållare",
      "Parkeringssensor"
    ],
    "correct": 1,
    "explanation": "ESP (antisladdsystem) upptäcker sladd och bromsar enskilda hjul samt reducerar motoreffekt för att stabilisera bilen.",
    "reference": "Fordonsteknik – aktiv säkerhet"
  },
  {
    "id": "q62",
    "category": "Fordonskännedom",
    "question": "Vad händer med bilens köregenskaper med last i bagageutrymmet?",
    "options": [
      "Ingen förändring",
      "Tyngdpunkten flyttas bakåt, styrningen blir lättare fram och bromssträckan kan öka",
      "Bilen bromsar bättre",
      "Strålkastarna riktas nedåt automatiskt alltid"
    ],
    "correct": 1,
    "explanation": "Last påverkar köregenskaper och kan öka bromssträckan. Placera och säkra lasten rätt och följ viktgränser och instruktioner för strålkastarinställning.",
    "reference": "Transportstyrelsen – lastning"
  },
  {
    "id": "q63",
    "category": "Fordonskännedom",
    "question": "När ska du använda halvljus?",
    "options": [
      "Endast i mörker",
      "Vid färd i mörker, gryning, skymning och vid dålig sikt – varselljus räcker ej i mörker",
      "Aldrig i tunnlar",
      "Endast på motorväg"
    ],
    "correct": 1,
    "explanation": "I mörker används halvljus eller tillåtet helljus. Varselljus räcker inte i mörker, gryning, skymning eller när sikten kräver halvljus. Kontrollera att bakljusen lyser.",
    "reference": "Trafikförordningen 3 kap. 68–71 §§"
  },
  {
    "id": "q64",
    "category": "Fordonskännedom",
    "question": "Vad gäller för dimbakljus?",
    "options": [
      "Får användas alltid i mörker",
      "Får endast användas vid dimma eller kraftigt nedsatt sikt – bländar annars bakomvarande",
      "Ska vara på vid regn",
      "Är obligatoriskt vintertid"
    ],
    "correct": 1,
    "explanation": "Dimbakljus är mycket starkt och får bara användas vid kraftigt nedsatt sikt, annars bländar det bakomvarande.",
    "reference": "Trafikförordningen 3 kap. 72 §"
  },
  {
    "id": "q65",
    "category": "Fordonskännedom",
    "question": "Vad är vattenplaning?",
    "options": [
      "När bromsarna blir våta",
      "När däcket tappar kontakten med vägbanan och flyter på en vattenfilm",
      "När vindrutan immar igen",
      "När motorn får vatten i luftfiltret"
    ],
    "correct": 1,
    "explanation": "Vid vattenplaning tappar däcket greppet. Släpp gasen, styr rakt och undvik att bromsa hårt. Bra mönsterdjup minskar risken.",
    "reference": "Trafikverket – halka och vatten"
  },
  {
    "id": "q66",
    "category": "Fordonskännedom",
    "question": "Vad är den högsta tillåtna totalvikten för en släpvagn du får dra med B-körkort (utan utökad behörighet)?",
    "options": [
      "Fri vikt",
      "Bil + släp får väga högst 3 500 kg totalvikt, eller släp max 750 kg",
      "Alltid max 1 500 kg släp",
      "Släp är inte tillåtet med B"
    ],
    "correct": 1,
    "explanation": "Med B får du dra släp på max 750 kg, eller tyngre om bilens och släpets sammanlagda totalvikt är högst 3 500 kg.",
    "reference": "Körkortslagen – behörighet B"
  },
  {
    "id": "q67",
    "category": "Trafikregler",
    "question": "Vilken hastighet gäller vid bogsering av ett fordon?",
    "options": [
      "Högst 20 km/h",
      "Högst 30 km/h",
      "50 km/h",
      "70 km/h"
    ],
    "correct": 1,
    "explanation": "Vanlig bogsering med lina eller stång får ske i högst 30 km/h. Ett fordon som blivit stående på motorväg får bogseras på vägrenen till närmaste avfart.",
    "reference": "Trafikförordningen 4 kap. 20 § och 9 kap. 1 §"
  },
  {
    "id": "q68",
    "category": "Trafikregler",
    "question": "Vad gäller för barn under 135 cm i bilen?",
    "options": [
      "Vanligt bälte räcker",
      "Ska använda bilbarnstol, bälteskudde eller annan särskild skyddsanordning",
      "Får åka i knä",
      "Ska alltid sitta fram"
    ],
    "correct": 1,
    "explanation": "Barn kortare än 135 cm ska använda särskild skyddsanordning. Bakåtvänt så länge som möjligt, minst till 4 års ålder.",
    "reference": "Trafikförordningen 4 kap. 10 §"
  },
  {
    "id": "q69",
    "category": "Vägmärken",
    "image": "varning-cyklande",
    "question": "Vad varnar detta märke för?",
    "options": [
      "Cykelverkstad",
      "Cyklande och mopedförare kan korsa eller färdas på vägen",
      "Cykelparkering",
      "Cykelförbud"
    ],
    "correct": 1,
    "explanation": "Märket varnar för korsande eller utsatt cykeltrafik. Sänk farten och håll uppsikt.",
    "reference": "Vägmärkesförordning A16"
  },
  {
    "id": "q70",
    "category": "Vägmärken",
    "image": "info-parkering",
    "question": "Vad betyder blå skylt med vitt P?",
    "options": [
      "Parkering förbjuden",
      "Parkering tillåten enligt eventuella tilläggstavlor",
      "Privat väg",
      "Polisstation"
    ],
    "correct": 1,
    "explanation": "Märket anger parkeringsplats. Tilläggstavlor kan begränsa tid, avgift eller vilka fordon som får stå.",
    "reference": "Vägmärkesförordning E19"
  },
  {
    "id": "q71",
    "category": "Miljö",
    "question": "Vilket av följande beskriver miljözon klass 2 korrekt?",
    "options": [
      "Alla fordon får köra",
      "Berörda lätta fordon ska uppfylla utsläppskraven; elfordon är också tillåtna",
      "Enbart elbilar får köra",
      "Endast tunga lastbilar berörs"
    ],
    "correct": 1,
    "explanation": "För berörda lätta fordon med gnisttänd motor krävs minst Euro 5 och för diesel Euro 6. Elfordon är också tillåtna.",
    "reference": "Trafikförordningen 10 kap. – miljözoner",
    "source": {
      "label": "Transportstyrelsen – Miljözoner",
      "url": "https://www.transportstyrelsen.se/sv/vagtrafik/miljo/miljozoner/"
    }
  },
  {
    "id": "q72",
    "category": "Människan & Trafiken",
    "question": "Vad bör du göra först vid en trafikolycka?",
    "options": [
      "Ringa försäkringsbolaget",
      "Varna andra trafikanter, larma 112 och ge första hjälpen",
      "Flytta alla fordon direkt",
      "Fotografera skadorna"
    ],
    "correct": 1,
    "explanation": "Prioritera säkerhet: varna (varningstriangel och varningsblinkers), larma 112 och rädda liv innan dokumentation.",
    "reference": "Trafikförordningen 2 kap. 8 § / första hjälpen"
  }
];
