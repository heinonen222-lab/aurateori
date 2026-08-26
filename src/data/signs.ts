export type SignCategory =
  | "Varningsmärken"
  | "Förbudsmärken"
  | "Påbudsmärken"
  | "Anvisningsmärken"
  | "Information";

export interface RoadSign {
  id: string;
  name: string;
  category: SignCategory;
  meaning: string;
  trap: string;
}

export const ROAD_SIGNS: RoadSign[] = [
  {
    id: "varning-kurva",
    name: "Varning för kurva",
    category: "Varningsmärken",
    meaning: "Varnar för en kurva där hastigheten kan behöva sänkas.",
    trap: "Pilen visar kurvans riktning – höger eller vänster.",
  },
  {
    id: "varning-barn",
    name: "Varning för barn",
    category: "Varningsmärken",
    meaning: "Varnar för plats där barn ofta uppehåller sig, t.ex. skola eller lekplats.",
    trap: "Innebär INTE nedsatt hastighetsgräns automatiskt – anpassa hastigheten själv.",
  },
  {
    id: "varning-vilt",
    name: "Varning för vilt",
    category: "Varningsmärken",
    meaning: "Varnar för vilda djur, oftast älg eller rådjur.",
    trap: "Gäller ofta en längre sträcka – var uppmärksam även efter skylten.",
  },
  {
    id: "varning-halka",
    name: "Varning för slirig väg",
    category: "Varningsmärken",
    meaning: "Vägen kan vara hal p.g.a. regn, is, löv eller grus.",
    trap: "Sänk hastigheten och undvik plötsliga rattrörelser.",
  },
  {
    id: "forbud-stopp",
    name: "Stopplikt",
    category: "Förbudsmärken",
    meaning: "Du måste stanna helt och lämna företräde innan du kör vidare.",
    trap: "Även om vägen är fri måste du stanna helt – inte bara sakta ner.",
  },
  {
    id: "forbud-hastighet-50",
    name: "Hastighetsbegränsning 50",
    category: "Förbudsmärken",
    meaning: "Högsta tillåtna hastighet 50 km/h tills nytt märke.",
    trap: "Gäller tills annat hastighetsmärke eller tätbebyggt område upphör.",
  },
  {
    id: "forbud-omkorning",
    name: "Förbud mot omkörning",
    category: "Förbudsmärken",
    meaning: "Det är förbjudet att köra om andra motordrivna fordon utom moped klass II.",
    trap: 'Gäller tills märket "slut på omkörningsförbud" eller korsning kommer.',
  },
  {
    id: "forbud-infart",
    name: "Förbud mot infart",
    category: "Förbudsmärken",
    meaning: "Fordonstrafik i riktning mot märket är förbjuden.",
    trap: 'Röd med vit balk – förväxla inte med "förbud mot trafik" som är helt röd med svart cykel/bil.',
  },
  {
    id: "pabud-hoger",
    name: "Påbjuden körriktning höger",
    category: "Påbudsmärken",
    meaning: "Du måste köra i pilens riktning.",
    trap: "Påbudsmärken är runda och blå – till skillnad från anvisningsmärken.",
  },
  {
    id: "pabud-cykel",
    name: "Påbjuden cykelbana",
    category: "Påbudsmärken",
    meaning: "Cyklister och mopedister klass II måste använda banan.",
    trap: "Även gående får använda banan om trottoar saknas.",
  },
  {
    id: "pabud-rondellen",
    name: "Cirkulationsplats",
    category: "Påbudsmärken",
    meaning: "Fordon i rondellen har företräde. Kör motsols.",
    trap: "Blinka höger när du ska lämna rondellen – inte vid ingång.",
  },
  {
    id: "anv-huvudled",
    name: "Huvudled",
    category: "Anvisningsmärken",
    meaning: "Du kör på huvudled och har företräde vid korsningar.",
    trap: 'Huvudleden gäller tills märket "slut på huvudled" – inte bara till nästa korsning.',
  },
  {
    id: "anv-overgang",
    name: "Övergångsställe",
    category: "Anvisningsmärken",
    meaning: "Här finns ett övergångsställe – lämna företräde åt gående som ska korsa.",
    trap: "Även vid obevakat övergångsställe måste du släppa förbi gående.",
  },
  {
    id: "info-motorvag",
    name: "Motorväg",
    category: "Information",
    meaning: "Här börjar motorväg. Endast motorfordon med minst 40 km/h får köra.",
    trap: "På motorväg är stannande, U-sväng och backning förbjudet.",
  },
  {
    id: "info-tatort",
    name: "Tättbebyggt område",
    category: "Information",
    meaning: "Här börjar tättbebyggt område – bashastighet 50 km/h om ej annat anges.",
    trap: "När du passerar upphör-märket gäller landsvägshastighet 70 km/h igen.",
  },

  {
    id: "varning-vagarbete",
    name: "Varning för vägarbete",
    category: "Varningsmärken",
    meaning: "Vägarbete pågår. Personal och maskiner kan finnas nära eller på körbanan.",
    trap: "Tillfälliga hastighetsmärken vid vägarbete gäller före de ordinarie.",
  },
  {
    id: "varning-cyklande",
    name: "Varning för cyklande och mopedförare",
    category: "Varningsmärken",
    meaning: "Varnar för cykeltrafik som korsar eller färdas längs vägen.",
    trap: "Gäller även moped klass II – ge gott sidoavstånd vid omkörning (minst 1,5 m).",
  },
  {
    id: "varning-korsning",
    name: "Varning för vägkorsning",
    category: "Varningsmärken",
    meaning: "Korsning där högerregeln gäller om inget annat anges.",
    trap: "Märket ger dig inte företräde – högerregeln gäller fortfarande.",
  },
  {
    id: "varning-avsmalnande",
    name: "Varning för avsmalnande väg",
    category: "Varningsmärken",
    meaning: "Vägen blir smalare, ofta så att möte försvåras.",
    trap: "Märket reglerar inte vem som har företräde – anpassa och samverka.",
  },
  {
    id: "varning-mote",
    name: "Varning för mötande trafik",
    category: "Varningsmärken",
    meaning: "Du kommer till en vägdel med mötande trafik, t.ex. efter enkelriktad sträcka.",
    trap: "Vanligt efter vägarbete eller där två körfält blir ett.",
  },
  {
    id: "vajningsplikt",
    name: "Väjningsplikt",
    category: "Förbudsmärken",
    meaning: "Du har väjningsplikt mot fordon på den korsande vägen.",
    trap: "Du behöver inte stanna om vägen är fri – men du måste kunna stanna.",
  },
  {
    id: "forbud-parkering",
    name: "Förbud att parkera",
    category: "Förbudsmärken",
    meaning: "Parkering är förbjuden på den sida av vägen där märket sitter.",
    trap: "Du får stanna kort för av- och påstigning eller lastning – men inte parkera.",
  },
  {
    id: "forbud-stannaparkera",
    name: "Förbud att stanna och parkera",
    category: "Förbudsmärken",
    meaning: "Både stannande och parkering är förbjudet.",
    trap: "Undantag gäller för trafiksignal, köbildning eller för att undvika fara.",
  },
  {
    id: "forbud-trafik",
    name: "Förbud mot trafik med motordrivet fordon",
    category: "Förbudsmärken",
    meaning: "Motordrivna fordon får inte passera märket.",
    trap: "Förväxla inte med förbud mot infart – detta gäller båda riktningarna.",
  },
  {
    id: "forbud-hastighet-30",
    name: "Hastighetsbegränsning 30",
    category: "Förbudsmärken",
    meaning: "Högsta tillåtna hastighet 30 km/h.",
    trap: "Vanligt vid skolor – gäller dygnet runt om inte tilläggstavla anger tid.",
  },
  {
    id: "forbud-svang-vanster",
    name: "Förbud mot sväng i korsning (vänster)",
    category: "Förbudsmärken",
    meaning: "Det är förbjudet att svänga vänster i korsningen.",
    trap: "Förbudet gäller endast närmaste korsning efter märket.",
  },
  {
    id: "pabud-gangbana",
    name: "Påbjuden gångbana",
    category: "Påbudsmärken",
    meaning: "Banan är avsedd för gående.",
    trap: "Cyklar får normalt inte användas här om inte tilläggstavla anger det.",
  },
  {
    id: "pabud-vanster",
    name: "Påbjuden körriktning vänster",
    category: "Påbudsmärken",
    meaning: "Du måste köra i pilens riktning, till vänster.",
    trap: "Blå rund pil = påbud (måste), blå rektangulär pil = anvisning (enkelriktat).",
  },
  {
    id: "pabud-minsta-hastighet",
    name: "Påbjuden gång- och cykelbana",
    category: "Påbudsmärken",
    meaning:
      "Banan är avsedd för både gående och cyklande. Cyklister och mopedister klass II ska använda den.",
    trap: "Förväxla inte med påbjuden cykelbana (D4) – här ska gående och cyklande samsas på samma bana.",
  },
  {
    id: "anv-enkelriktat",
    name: "Enkelriktad trafik",
    category: "Anvisningsmärken",
    meaning: "Vägen är enkelriktad i pilens riktning – ingen mötande trafik.",
    trap: "Även om det inte möter trafik gäller vanliga regler för cyklister som kan färdas i båda riktningarna där det tillåts.",
  },
  {
    id: "anv-slut-huvudled",
    name: "Huvudled upphör",
    category: "Anvisningsmärken",
    meaning: "Huvudleden slutar. Efter märket gäller normalt högerregeln.",
    trap: "Många glömmer att företrädet försvinner direkt efter detta märke.",
  },
  {
    id: "anv-gangfartsomrade",
    name: "Gångfartsområde",
    category: "Anvisningsmärken",
    meaning:
      "Fordon får framföras i gångfart, gående har företräde och parkering endast på markerade platser.",
    trap: "Gångfart är cirka 7 km/h – hastighetsmätaren visar knappt utslag.",
  },
  {
    id: "anv-slut-gangfart",
    name: "Gångfartsområde upphör",
    category: "Anvisningsmärken",
    meaning: "Efter märket gäller vanliga trafikregler och bashastighet igen.",
    trap: "Glöm inte att gående inte längre har generellt företräde.",
  },
  {
    id: "info-parkering",
    name: "Parkering",
    category: "Information",
    meaning: "Anger plats där parkering är tillåten, ofta med villkor på tilläggstavla.",
    trap: "Tilläggstavlor styr tid, avgift och fordonsslag – läs dem alltid.",
  },
  {
    id: "info-motorvag-slut",
    name: "Motorväg upphör",
    category: "Information",
    meaning: "Motorvägen slutar – räkna med mötande trafik, korsningar och lägre hastighet.",
    trap: "Sänk farten i god tid; hastighetsintrycket gör att 70 km/h känns långsamt.",
  },
  {
    id: "info-motortrafikled",
    name: "Motortrafikled",
    category: "Information",
    meaning: "Liknande regler som motorväg men ofta bara ett körfält per riktning.",
    trap: "Mötande trafik kan förekomma – omkörning kräver stor försiktighet.",
  },
  {
    id: "info-vagnr",
    name: "Vägnummer (Europaväg)",
    category: "Information",
    meaning: "Visar vilken väg du färdas på – E-vägar har grön botten.",
    trap: "Grön skylt betyder Europaväg, blå betyder övriga riksvägar/länsvägar.",
  },
  {
    id: "info-sjukhus",
    name: "Sjukhus",
    category: "Information",
    meaning: "Anger väg till sjukhus med akutmottagning.",
    trap: "Ett serviceinformationsmärke – ger inga trafikregler eller företräde.",
  },
];
