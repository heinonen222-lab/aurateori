export type SignCategory =
  | "Varningsmärken"
  | "Väjningspliktsmärken"
  | "Förbudsmärken"
  | "Påbudsmärken"
  | "Anvisningsmärken"
  | "Information"
  | "Lokaliseringsmärken för vägvisning"
  | "Lokaliseringsmärken för upplysning om allmänna inrättningar med mera";

export interface RoadSign {
  id: string;
  name: string;
  category: SignCategory;
  meaning: string;
  trap: string;
}

export const ROAD_SIGNS: RoadSign[] = [
  {
    "id": "varning-kurva",
    "name": "Varning för farlig kurva",
    "category": "Varningsmärken",
    "meaning": "Varnar för en kurva där hastigheten kan behöva sänkas.",
    "trap": "Pilen visar kurvans riktning – höger eller vänster."
  },
  {
    "id": "varning-barn",
    "name": "Varning för barn",
    "category": "Varningsmärken",
    "meaning": "Varnar för plats där barn ofta uppehåller sig, t.ex. skola eller lekplats.",
    "trap": "Innebär INTE nedsatt hastighetsgräns automatiskt – anpassa hastigheten själv."
  },
  {
    "id": "varning-vilt",
    "name": "Varning för djur",
    "category": "Varningsmärken",
    "meaning": "Varnar för vilda djur, oftast älg eller rådjur.",
    "trap": "Gäller ofta en längre sträcka – var uppmärksam även efter skylten."
  },
  {
    "id": "varning-halka",
    "name": "Varning för slirig väg",
    "category": "Varningsmärken",
    "meaning": "Märket anger att vägen kan vara slirig. För varning för snö eller is används det endast när särskilda skäl finns.",
    "trap": "Sänk hastigheten och undvik plötsliga rattrörelser."
  },
  {
    "id": "forbud-stopp",
    "name": "Stopplikt",
    "category": "Väjningspliktsmärken",
    "meaning": "Du måste stanna helt och lämna företräde innan du kör vidare.",
    "trap": "Även om vägen är fri måste du stanna helt – inte bara sakta ner."
  },
  {
    "id": "forbud-hastighet-50",
    "name": "Hastighetsbegränsning 50",
    "category": "Förbudsmärken",
    "meaning": "Högsta tillåtna hastighet 50 km/h tills nytt märke.",
    "trap": "C31 gäller tills annan hastighet anges med C31, eller tills C32 (tillfällig hastighetsbegränsning upphör), E7 (gågata) eller E9 (gångfartsområde) är uppsatt. En korsning eller tätortsgräns upphäver inte i sig C31."
  },
  {
    "id": "forbud-hastighet-60",
    "name": "Hastighetsbegränsning 60",
    "category": "Förbudsmärken",
    "meaning": "Högsta tillåtna hastighet 60 km/h tills nytt märke.",
    "trap": "Anpassa ändå farten efter väglag och sikt – 60 är ett tak, inte ett mål."
  },
  {
    "id": "anv-atervandsvag",
    "name": "Återvändsväg",
    "category": "Anvisningsmärken",
    "meaning": "Vägen är en återvändsgränd – den går inte att köra vidare på.",
    "trap": "Märket (E17) är en upplysning, inget förbud – du får köra in men måste vända."
  },
  {
    "id": "forbud-omkorning",
    "name": "Förbud mot omkörning",
    "category": "Förbudsmärken",
    "meaning": "C27 förbjuder omkörning av andra motordrivna fordon än tvåhjuliga mopeder och tvåhjuliga motorcyklar utan sidvagn. Övriga regler för säker omkörning gäller.",
    "trap": "Förbudet gäller på vägen till C28, slut på förbud mot omkörning. En korsning upphäver det inte."
  },
  {
    "id": "forbud-infart",
    "name": "Förbud mot infart med fordon",
    "category": "Förbudsmärken",
    "meaning": "Fordonstrafik i riktning mot märket är förbjuden.",
    "trap": "Röd rund skylt med gul vågrät balk. Förväxla inte med C2, förbud mot trafik med fordon, eller C3, som undantar moped klass II."
  },
  {
    "id": "pabud-hoger",
    "name": "Påbjuden körriktning höger",
    "category": "Påbudsmärken",
    "meaning": "Du måste köra i pilens riktning.",
    "trap": "Påbudsmärken är runda och blå – till skillnad från anvisningsmärken."
  },
  {
    "id": "pabud-cykel",
    "name": "Påbjuden cykelbana",
    "category": "Påbudsmärken",
    "meaning": "Banan är avsedd för cykel och normalt tvåhjulig moped klass II. Lagregler tillåter vissa undantag för cyklande.",
    "trap": "Tilläggstavla kan förbjuda moped klass II. Gående får använda cykelbana när gångbana och vägren saknas."
  },
  {
    "id": "pabud-rondellen",
    "name": "Cirkulationsplats",
    "category": "Påbudsmärken",
    "meaning": "Märket anger cirkulationsplats. Vid infart har du väjningsplikt mot fordon i cirkulationen.",
    "trap": "Inget krav på tecken vid infart. Ge tecken vid körfältsbyte och till höger vid utfart."
  },
  {
    "id": "anv-huvudled",
    "name": "Huvudled",
    "category": "Väjningspliktsmärken",
    "meaning": "Du kör på huvudled och har företräde vid korsningar.",
    "trap": "Huvudleden gäller tills märket \"slut på huvudled\" – inte bara till nästa korsning."
  },
  {
    "id": "anv-overgang",
    "name": "Övergångsställe",
    "category": "Väjningspliktsmärken",
    "meaning": "Här finns ett övergångsställe – lämna företräde åt gående som ska korsa.",
    "trap": "Även vid obevakat övergångsställe måste du släppa förbi gående."
  },
  {
    "id": "info-motorvag",
    "name": "Motorväg",
    "category": "Anvisningsmärken",
    "meaning": "Motorväg. Motorfordon eller motorfordonståg ska vara konstruerade för och få framföras i minst 40 km/h; moped klass I är ändå förbjuden.",
    "trap": "På motorväg är stannande, U-sväng och backning förbjudet."
  },
  {
    "id": "info-tatort",
    "name": "Tättbebyggt område",
    "category": "Anvisningsmärken",
    "meaning": "Här börjar tättbebyggt område – bashastighet 50 km/h om ej annat anges.",
    "trap": "Utanför området är bashastigheten 70 km/h om ingen annan gällande begränsning finns. Tätortsgränsen upphäver inte i sig ett C31-märke."
  },
  {
    "id": "varning-vagarbete",
    "name": "Varning för vägarbete",
    "category": "Varningsmärken",
    "meaning": "Vägarbete pågår. Personal och maskiner kan finnas nära eller på körbanan.",
    "trap": "Tillfälliga hastighetsmärken vid vägarbete gäller före de ordinarie."
  },
  {
    "id": "varning-cyklande",
    "name": "Varning för cyklande och mopedförare",
    "category": "Varningsmärken",
    "meaning": "Varnar för cykeltrafik som korsar eller färdas längs vägen.",
    "trap": "Var uppmärksam på cyklande och mopedförare. Håll betryggande sidoavstånd och vänta med omkörning om utrymmet inte räcker."
  },
  {
    "id": "varning-korsning",
    "name": "Varning för vägkorsning",
    "category": "Varningsmärken",
    "meaning": "Korsning där högerregeln gäller om inget annat anges.",
    "trap": "Märket ger dig inte företräde – högerregeln gäller fortfarande."
  },
  {
    "id": "varning-avsmalnande",
    "name": "Varning för avsmalnande väg",
    "category": "Varningsmärken",
    "meaning": "Vägen blir smalare, ofta så att möte försvåras.",
    "trap": "Märket reglerar inte vem som har företräde – anpassa och samverka."
  },
  {
    "id": "varning-mote",
    "name": "Varning för mötande trafik",
    "category": "Varningsmärken",
    "meaning": "Du kommer till en vägdel med mötande trafik, t.ex. efter enkelriktad sträcka.",
    "trap": "Vanligt efter vägarbete eller där två körfält blir ett."
  },
  {
    "id": "vajningsplikt",
    "name": "Väjningsplikt",
    "category": "Väjningspliktsmärken",
    "meaning": "Du har väjningsplikt mot fordon på den korsande vägen.",
    "trap": "Du behöver inte stanna om vägen är fri – men du måste kunna stanna."
  },
  {
    "id": "forbud-parkering",
    "name": "Förbud att parkera",
    "category": "Förbudsmärken",
    "meaning": "Parkering är förbjuden på den sida av vägen där märket sitter.",
    "trap": "Du får stanna kort för av- och påstigning eller lastning – men inte parkera."
  },
  {
    "id": "forbud-stannaparkera",
    "name": "Förbud att stanna och parkera",
    "category": "Förbudsmärken",
    "meaning": "Både stannande och parkering är förbjudet.",
    "trap": "Undantag gäller för trafiksignal, köbildning eller för att undvika fara."
  },
  {
    "id": "forbud-trafik",
    "name": "Förbud mot trafik med annat motordrivet fordon än moped klass II",
    "category": "Förbudsmärken",
    "meaning": "Motordrivna fordon utom moped klass II får inte trafikera vägen. Tilläggstavla kan ange att även moped klass II förbjuds.",
    "trap": "Förväxla inte med förbud mot infart – detta gäller båda riktningarna."
  },
  {
    "id": "forbud-hastighet-30",
    "name": "Hastighetsbegränsning 30",
    "category": "Förbudsmärken",
    "meaning": "Högsta tillåtna hastighet 30 km/h.",
    "trap": "Vanligt vid skolor – gäller dygnet runt om inte tilläggstavla anger tid."
  },
  {
    "id": "forbud-svang-vanster",
    "name": "Förbud mot sväng i korsning (vänster)",
    "category": "Förbudsmärken",
    "meaning": "Det är förbjudet att svänga vänster i korsningen.",
    "trap": "Förbudet gäller endast närmaste korsning efter märket."
  },
  {
    "id": "pabud-gangbana",
    "name": "Påbjuden gångbana",
    "category": "Påbudsmärken",
    "meaning": "Banan är avsedd för gående.",
    "trap": "Cyklar får normalt inte användas här om inte tilläggstavla anger det."
  },
  {
    "id": "pabud-vanster",
    "name": "Påbjuden körriktning vänster",
    "category": "Påbudsmärken",
    "meaning": "Du måste köra i pilens riktning, till vänster.",
    "trap": "Blå rund pil = påbud (måste), blå rektangulär pil = anvisning (enkelriktat)."
  },
  {
    "id": "pabud-minsta-hastighet",
    "name": "Påbjuden gång- och cykelbana",
    "category": "Påbudsmärken",
    "meaning": "Gemensam bana för gående och cyklande, normalt även tvåhjulig moped klass II. Tilläggstavla kan förbjuda moped klass II.",
    "trap": "Förväxla inte med påbjuden cykelbana (D4) – här ska gående och cyklande samsas på samma bana."
  },
  {
    "id": "anv-enkelriktat",
    "name": "Enkelriktad trafik",
    "category": "Anvisningsmärken",
    "meaning": "Fordonstrafiken regleras i pilens riktning. Var uppmärksam på eventuella undantag och andra trafikanter.",
    "trap": "Även om det inte möter trafik gäller vanliga regler för cyklister som kan färdas i båda riktningarna där det tillåts."
  },
  {
    "id": "anv-slut-huvudled",
    "name": "Huvudled upphör",
    "category": "Väjningspliktsmärken",
    "meaning": "Huvudleden slutar. Efter märket gäller normalt högerregeln.",
    "trap": "Många glömmer att företrädet försvinner direkt efter detta märke."
  },
  {
    "id": "anv-gangfartsomrade",
    "name": "Gångfartsområde",
    "category": "Anvisningsmärken",
    "meaning": "Fordon får framföras i gångfart, gående har företräde och parkering endast på markerade platser.",
    "trap": "Gångfart är inte en fast gräns i km/h. Anpassa farten till gående."
  },
  {
    "id": "anv-slut-gangfart",
    "name": "Gångfartsområde upphör",
    "category": "Anvisningsmärken",
    "meaning": "Gångfartsområdet upphör. När du kör ut på annan väg har du väjningsplikt mot fordon på den vägen.",
    "trap": "Utfartsregeln gäller när du lämnar gångfartsområdet."
  },
  {
    "id": "info-parkering",
    "name": "Parkering",
    "category": "Anvisningsmärken",
    "meaning": "Anger plats där parkering är tillåten, ofta med villkor på tilläggstavla.",
    "trap": "Tilläggstavlor styr tid, avgift och fordonsslag – läs dem alltid."
  },
  {
    "id": "info-motorvag-slut",
    "name": "Motorväg upphör",
    "category": "Anvisningsmärken",
    "meaning": "Motorvägen slutar – räkna med mötande trafik, korsningar och lägre hastighet.",
    "trap": "Sänk farten i god tid; hastighetsintrycket gör att 70 km/h känns långsamt."
  },
  {
    "id": "info-motortrafikled",
    "name": "Motortrafikled",
    "category": "Anvisningsmärken",
    "meaning": "Liknande regler som motorväg men ofta bara ett körfält per riktning.",
    "trap": "Mötande trafik kan förekomma – omkörning kräver stor försiktighet."
  },
  {
    "id": "info-vagnr",
    "name": "Vägnummer",
    "category": "Lokaliseringsmärken för vägvisning",
    "meaning": "Visar vilket nummer vägen du färdas på har.",
    "trap": "Blå botten används för riks- och länsvägar, grön botten för Europavägar (E-vägar)."
  },
  {
    "id": "info-sjukhus",
    "name": "Akutsjukhus",
    "category": "Lokaliseringsmärken för upplysning om allmänna inrättningar med mera",
    "meaning": "Anger väg till sjukhus med akutmottagning.",
    "trap": "G4 är ett lokaliseringsmärke för allmänna inrättningar; det ger inte företräde."
  }
];
