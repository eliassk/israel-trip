import type { ToyId } from '../toys'

export type PlaceId =
  | 'jaffa' | 'megiddo' | 'sachne' | 'galilee' | 'golan' | 'caliber'
  | 'jerusalem' | 'olives' | 'bethesda' | 'temple' | 'market'
  | 'desert' | 'masada' | 'deadsea' | 'shefayim'

export interface Place {
  id: PlaceId
  name: string
  region: string
  lat: number
  lon: number
  /** Label offset on the map, in SVG units. */
  label: { dx: number; dy: number; anchor?: 'start' | 'middle' | 'end' }
  altitude: number
  intro: string
  facts: string[]
  /** Bible events tied to this place. Own words, not quotations. */
  bible?: { event: string; ref: string }[]
  /** Quoted from Biblia Warszawska. */
  verse?: { text: string; ref: string }
  tip: string
  toy?: ToyId
  quiz?: { question: string; answers: string[]; correct: number }
  highlight?: boolean
  /** A sub-place is reached through its parent's page and has no pin of its own. */
  parent?: PlaceId
}

export const PLACES: Place[] = [
  {
    id: 'jaffa', name: 'Tel Awiw i Jaffa', region: 'Wybrzeże', lat: 32.06, lon: 34.76,
    label: { dx: -8, dy: 16, anchor: 'end' }, altitude: 5,
    intro: 'Nowoczesne miasto nad morzem i obok niego starożytny port. Kamienne uliczki Jaffy, plaża i zachody słońca nad Morzem Śródziemnym.',
    facts: [
      'Jaffa to jeden z najstarszych portów świata. Działał już ponad 3000 lat temu.',
      'Tel Awiw założono w 1909 roku na wydmach obok Jaffy.',
      '„Białe Miasto” w Tel Awiwie ma ponad 4000 budynków w stylu Bauhaus i jest na liście UNESCO.',
    ],
    bible: [
      { event: "Jonasz wsiada tu na statek, uciekając przed Bogiem", ref: "Jon 1,3" },
      { event: "Piotr przywraca do życia Tabitę", ref: "Dz 9,36-42" },
      { event: "Na dachu domu Szymona garbarza Piotr ma widzenie: Ewangelia jest także dla pogan", ref: "Dz 10,9-23" },
      { event: "Do portu w Jafie spławiano cedry z Libanu na budowę świątyni Salomona", ref: "2 Krn 2,15" },
    ],
    verse: { text: 'Lecz Jonasz wstał, aby uciec do Tarszyszu sprzed oblicza Pana. Zszedł do Joppy…', ref: 'Jon 1,3' },
    tip: 'Strój kąpielowy i krem z filtrem miej w bagażu podręcznym.',
    toy: 'matkot',
  },
  {
    id: 'megiddo', name: 'Megiddo', region: 'Dolina Jezreel', lat: 32.585, lon: 35.185,
    label: { dx: -8, dy: -6, anchor: 'end' }, altitude: 60,
    intro: 'Wzgórze, na którym przez tysiące lat budowano miasto na mieście. Strategiczne skrzyżowanie dróg starożytnego świata.',
    facts: [
      'Megiddo to „tel”, czyli wzgórze z ponad 20 warstw miast.',
      'Można przejść starożytnym tunelem wodnym wykutym w skale.',
      'Harmagedon z Apokalipsy to po hebrajsku Har Megiddo, czyli „góra Megiddo”. Staniemy dokładnie w miejscu, które Biblia wybrała na scenę ostatecznej bitwy dobra ze złem.',
    ],
    bible: [
      { event: "Debora i Barak pokonują Syserę „nad wodami Megiddo”", ref: "Sdz 5,19" },
      { event: "Salomon odbudowuje Megiddo jako miasto warowne", ref: "1 Krl 9,15" },
      { event: "Pod Megiddo ginie dobry król Jozjasz", ref: "2 Krl 23,29" },
      { event: "Harmagedon: miejsce ostatecznej bitwy", ref: "Ap 16,16" },
    ],
    verse: { text: 'I zgromadziły ich na miejscu, które po hebrajsku nazywa się Harmagedon.', ref: 'Ap 16,16' },
    tip: 'Wygodne buty. Na wzgórzu jest mało cienia.',
    toy: 'tunnel',
  },
  {
    id: 'sachne', name: 'Gan HaShlosha', region: 'Dolina Bet Szean', lat: 32.5, lon: 35.45,
    label: { dx: 8, dy: 14, anchor: 'start' }, altitude: -120,
    intro: 'Park z naturalnymi basenami i wodospadami. Woda jest krystaliczna i ciepła o każdej porze roku.',
    facts: [
      'Woda ma ok. 28°C przez cały rok.',
      'Arabska nazwa parku to Sachne.',
      'Baseny połączone są małymi wodospadami, pod którymi można usiąść.',
    ],
    bible: [
      { event: "Nad źródłem Charod, kilka km stąd, Gedeon wybiera 300 wojowników", ref: "Sdz 7,1-7" },
      { event: "Na górze Gilboa, widocznej z basenów, giną Saul i Jonatan", ref: "1 Sm 31,1-6" },
      { event: "Dawid opłakuje ich pieśnią: „Góry Gilboa, niech nie pada na was rosa”", ref: "2 Sm 1,17-27" },
    ],
    verse: { text: 'Na zielonych niwach pasie mnie, prowadzi mnie nad wody, gdzie mogę odpocząć.', ref: 'Ps 23,2' },
    tip: 'Ręcznik i klapki. Dno basenów jest kamieniste.',
    quiz: { question: 'Jaką temperaturę ma woda w Gan HaShlosha?', answers: ['ok. 15°C', 'ok. 28°C', 'ok. 40°C'], correct: 1 },
  },
  {
    id: 'galilee', name: 'Jezioro Galilejskie', region: 'Galilea', lat: 32.79, lon: 35.53,
    label: { dx: -10, dy: -6, anchor: 'end' }, altitude: -210,
    intro: 'Jezioro, nad którym Jezus nauczał i powołał rybaków na uczniów. Kafarnaum, Góra Błogosławieństw i Tabgha.',
    facts: [
      'Jezioro leży ok. 210 m poniżej poziomu morza.',
      'Ma 21 km długości i 13 km szerokości.',
      'W Kafarnaum widać ruiny synagogi i domu Piotra.',
    ],
    bible: [
      { event: "Jezus powołuje rybaków: Piotra, Andrzeja, Jakuba i Jana", ref: "Mk 1,16-20" },
      { event: "W Kafarnaum uzdrawia paralityka spuszczonego przez dach", ref: "Mk 2,1-12" },
      { event: "Wygłasza Kazanie na Górze", ref: "Mt 5–7" },
      { event: "Ucisza burzę na jeziorze", ref: "Mk 4,35-41" },
      { event: "Chodzi po wodzie, a Piotr próbuje do Niego dojść", ref: "Mt 14,22-33" },
      { event: "Po zmartwychwstaniu przygotowuje uczniom śniadanie na brzegu i pyta Piotra: „Czy miłujesz mnie?”", ref: "J 21" },
    ],
    verse: { text: 'Pójdźcie za mną, a uczynię was rybakami ludzi.', ref: 'Mt 4,19' },
    tip: 'Nakrycie głowy. Nad jeziorem bywa bardzo gorąco.',
    toy: 'fishing',
  },
  {
    id: 'golan', name: 'Wzgórza Golan', region: 'Północ', lat: 33.0, lon: 35.75,
    label: { dx: 0, dy: -14, anchor: 'middle' }, altitude: 1100,
    intro: 'Wysoki płaskowyż nad Jeziorem Galilejskim. Widać stąd Syrię, a na północy górę Hermon.',
    facts: [
      'Z Góry Bental granicę widać gołym okiem: po izraelskiej stronie zielone sady, winnice i pola, po syryjskiej często suche, puste pola.',
      'Na szczycie Bentalu są stare bunkry z wojny w 1973 roku. Można po nich chodzić.',
      'Hermon ma ok. 2800 m. Zimą działa tam stok narciarski.',
      'Z Golanu spływa duża część wody, która zasila Jordan.',
    ],
    bible: [
      { event: "U stóp Hermonu, w Cezarei Filipowej, Piotr wyznaje: „Ty jesteś Chrystus”", ref: "Mt 16,13-20" },
      { event: "Wielu uważa Hermon za górę Przemienienia", ref: "Mk 9,2-8" },
      { event: "Golan był jednym z miast schronienia", ref: "Pwt 4,43" },
    ],
    verse: { text: 'Jak rosa Hermonu, która spływa na góry Syjonu.', ref: 'Ps 133,3' },
    tip: 'Bluza. Na Golanie jest wietrznie i chłodniej.',
    quiz: { question: 'Co można robić zimą na Hermonie?', answers: ['Jeździć na nartach', 'Nurkować z rafą', 'Zbierać banany'], correct: 0 },
  },
  {
    id: 'caliber', name: 'Caliber 3', region: 'Gush Etzion', lat: 31.66, lon: 35.12,
    label: { dx: -8, dy: 14, anchor: 'end' }, altitude: 950,
    intro: 'Ośrodek szkolenia antyterrorystycznego. Instruktorzy pokazują, jak wygląda praca służb bezpieczeństwa w Izraelu.',
    facts: [
      'Instruktorzy to byli żołnierze jednostek specjalnych.',
      'Turyści mogą zobaczyć pokaz i spróbować strzelania sportowego.',
      'Ośrodek leży w górach na południe od Jerozolimy.',
    ],
    tip: 'Wygodne, zakryte buty. Obowiązują ścisłe zasady bezpieczeństwa.',
    toy: 'range',
  },
  {
    id: 'jerusalem', name: 'Jerozolima', region: 'Góry Judzkie', lat: 31.777, lon: 35.235,
    label: { dx: 10, dy: -6, anchor: 'start' }, altitude: 750,
    intro: 'Serce całej historii. Tu Jezus nauczał, umarł na krzyżu i zmartwychwstał. Miasto ma tyle miejsc, że rozbiliśmy je na osobne karty.',
    facts: [
      'Wszystkie budynki muszą być obłożone jasnym „kamieniem jerozolimskim”. O zachodzie słońca całe miasto robi się złote.',
      'Stare Miasto ma tylko ok. 1 km² i dzieli się na cztery dzielnice.',
      'Dzisiejsze mury zbudował sułtan Sulejman Wspaniały w XVI wieku. Prowadzi przez nie 8 bram.',
    ],
    bible: [
      { event: "Dawid zdobywa Jerozolimę i robi z niej stolicę", ref: "2 Sm 5,6-10" },
      { event: "Jezus wjeżdża do Jerozolimy na osiołku", ref: "Mk 11,1-11" },
      { event: "Umiera na krzyżu i zmartwychwstaje", ref: "J 19–20" },
      { event: "W Zielone Świątki uczniowie otrzymują Ducha Świętego", ref: "Dz 2" },
    ],
    verse: { text: 'Nogi nasze stoją w bramach twoich, Jeruzalemie!', ref: 'Ps 122,2' },
    tip: 'Wygodne buty. W Jerozolimie chodzi się dużo, po kamieniach i schodach.',
    quiz: { question: 'Ile bram prowadzi przez mury Starego Miasta?', answers: ['4', '8', '12'], correct: 1 },
  },
  {
    id: 'olives', parent: 'jerusalem', name: 'Góra Oliwna i Getsemani', region: 'Jerozolima', lat: 31.779, lon: 35.243,
    label: { dx: 0, dy: 0 }, altitude: 800,
    intro: 'Wzgórze naprzeciw Starego Miasta, z najpiękniejszym widokiem na Jerozolimę. U jego stóp leży ogród oliwny, w którym Jezus modlił się w noc przed śmiercią.',
    facts: [
      'Getsemani znaczy po hebrajsku „tłocznia oliwy”.',
      'Najstarsze drzewa oliwne w ogrodzie mają ok. 900 lat.',
      'Na zboczu leży ogromny żydowski cmentarz z dziesiątkami tysięcy grobów.',
    ],
    bible: [
      { event: "Jezus płacze, patrząc na miasto", ref: "Łk 19,41-44" },
      { event: "Z Góry Oliwnej zaczyna się wjazd Jezusa do Jerozolimy", ref: "Mk 11,1-10" },
      { event: "Opowiada uczniom o końcu czasów", ref: "Mt 24,3" },
      { event: "Modli się w Getsemani, a uczniowie zasypiają", ref: "Mk 14,32-42" },
      { event: "Stąd wstępuje do nieba", ref: "Dz 1,9-12" },
    ],
    verse: { text: 'Ojcze, jeśli chcesz, oddal ten kielich ode mnie; wszakże nie moja, lecz twoja wola niech się stanie.', ref: 'Łk 22,42' },
    tip: 'Najlepszy widok jest rano, kiedy słońce świeci prosto na Stare Miasto.',
    toy: 'olivepress',
  },
  {
    id: 'bethesda', parent: 'jerusalem', name: 'Sadzawka Betesda', region: 'Jerozolima', lat: 31.781, lon: 35.236,
    label: { dx: 0, dy: 0 }, altitude: 750,
    intro: 'Ruiny dwóch wielkich basenów tuż przy Bramie Lwów. Tu Jezus uzdrowił człowieka, który czekał na cud 38 lat.',
    facts: [
      'Jan pisze o pięciu krużgankach. Archeolodzy znaleźli dokładnie taki układ: cztery wokół basenów i jeden pośrodku.',
      'Długo uważano, że ta sadzawka to legenda. Odkopano ją dopiero w XIX wieku.',
      'Obok stoi kościół św. Anny, słynny z akustyki. Grupy przychodzą tam śpiewać.',
    ],
    bible: [
      { event: "Jezus uzdrawia człowieka chorego od 38 lat", ref: "J 5,1-9" },
      { event: "„Mój Ojciec działa aż do tej chwili i Ja działam”", ref: "J 5,17" },
    ],
    verse: { text: 'Rzecze mu Jezus: Wstań, weź łoże swoje i chodź!', ref: 'J 5,8' },
    tip: 'W kościele św. Anny warto zaśpiewać razem. Pogłos jest niesamowity.',
    toy: 'bethesda',
  },
  {
    id: 'temple', parent: 'jerusalem', name: 'Wzgórze Świątynne i Ściana Płaczu', region: 'Jerozolima', lat: 31.7767, lon: 35.2345,
    label: { dx: 0, dy: 0 }, altitude: 740,
    intro: 'Tu stała świątynia. Dziś na górze stoi Kopuła na Skale, a u jej stóp przy Ścianie Zachodniej modlą się ludzie z całego świata.',
    facts: [
      'Ściana Zachodnia to fragment muru oporowego, który Herod zbudował wokół świątyni.',
      'Największy kamień w murze ma ok. 13,6 m długości i waży kilkaset ton. Nikt do końca nie wie, jak go przesunięto.',
      'Przy Ścianie modlitwa trwa dzień i noc. Kobiety i mężczyźni modlą się w osobnych częściach.',
    ],
    bible: [
      { event: "Na górze Moria Abraham ma złożyć Izaaka w ofierze", ref: "Rdz 22,2" },
      { event: "Na tej samej górze Salomon buduje świątynię", ref: "2 Krn 3,1" },
      { event: "Symeon i Anna rozpoznają w małym Jezusie Mesjasza", ref: "Łk 2,22-38" },
      { event: "Dwunastoletni Jezus rozmawia z nauczycielami w świątyni", ref: "Łk 2,41-52" },
      { event: "Jezus wypędza kupców ze świątyni", ref: "J 2,13-22" },
      { event: "Zapowiada, że nie zostanie tu kamień na kamieniu", ref: "Mk 13,1-2" },
    ],
    tip: 'Ramiona i kolana zakryte. Mężczyźni dostaną przy Ścianie kipę.',
    toy: 'wallbuilder',
  },
  {
    id: 'market', parent: 'jerusalem', name: 'Targ Machane Jehuda', region: 'Jerozolima', lat: 31.785, lon: 35.212,
    label: { dx: 0, dy: 0 }, altitude: 780,
    intro: 'Najgłośniejsze miejsce w mieście. Sprzedawcy przekrzykują się nad górami przypraw, chałwy i owoców, a wieczorem targ zamienia się w miejsce spotkań z muzyką.',
    facts: [
      'Na targu jest ponad 250 straganów.',
      'W piątek przed szabatem jest tłoczno jak na koncercie. Potem całe miasto cichnie aż do sobotniego wieczoru.',
      'Spróbuj: chałwy, rugelach, świeżego soku z granatów i falafela.',
    ],
    bible: [
      { event: "Nehemiasz zamyka bramy Jerozolimy, żeby kupcy nie handlowali w szabat", ref: "Ne 13,15-22" },
    ],
    tip: 'Weź gotówkę w szeklach. Targowanie się to część zabawy, a falafel zjedz na stojąco jak miejscowi.',
    toy: 'falafel',
  },
  {
    id: 'desert', name: 'Pustynia Judzka', region: 'Obóz na pustyni', lat: 31.42, lon: 35.2,
    label: { dx: -9, dy: 4, anchor: 'end' }, altitude: -100,
    intro: 'Skały, kaniony i cisza. Nocleg w obozie, kolacja przy ogniu i niebo pełne gwiazd.',
    facts: [
      'Między Jerozolimą a Morzem Martwym teren opada o ponad 1100 m na ok. 30 km.',
      'Na tej pustyni Dawid ukrywał się przed Saulem.',
      'Bez świateł miasta widać Drogę Mleczną gołym okiem.',
    ],
    bible: [
      { event: "Jan Chrzciciel woła na pustyni: „Przygotujcie drogę Pańską”", ref: "Mt 3,1-3" },
      { event: "Jezus pości 40 dni i odpiera pokusy", ref: "Mt 4,1-11" },
      { event: "Przez tę pustynię biegła droga z przypowieści o dobrym Samarytaninie", ref: "Łk 10,30-37" },
      { event: "W En-Gedi Dawid oszczędza Saula w jaskini", ref: "1 Sm 24" },
    ],
    verse: { text: 'Boże, Boże mój, ciebie szukam… w ziemi suchej, spragnionej, bezwodnej.', ref: 'Ps 63,2' },
    tip: 'Noce są zimne. Ciepła bluza i latarka.',
    toy: 'sky',
  },
  {
    id: 'masada', name: 'Masada', region: 'Nad Morzem Martwym', lat: 31.315, lon: 35.354,
    label: { dx: -9, dy: 12, anchor: 'end' }, altitude: 60,
    intro: 'Twierdza króla Heroda na szczycie samotnej skały. Najlepiej wejść o świcie.',
    facts: [
      'W 73/74 r. n.e. Masada była ostatnim punktem oporu przeciw Rzymianom.',
      'Na szczyt prowadzi Ścieżka Węża (ok. 45 min) albo kolejka linowa.',
      'Rzymianie usypali ogromną rampę, która stoi do dziś.',
    ],
    bible: [
      { event: "Masadę zbudował Herod Wielki, ten sam, który kazał zabić dzieci w Betlejem", ref: "Mt 2,16" },
      { event: "Słowo „mecuda” (twierdza) pojawia się w psalmach Dawida", ref: "Ps 18,3" },
      { event: "Dawid ukrywał się w warowniach tej pustyni", ref: "1 Sm 23,14" },
    ],
    verse: { text: 'Panie, opoko moja i twierdzo moja, i wybawicielu mój!', ref: 'Ps 18,3' },
    tip: 'Minimum 2 litry wody i czapka.',
    quiz: { question: 'Ile mniej więcej trwa wejście Ścieżką Węża?', answers: ['5 minut', 'ok. 45 minut', '4 godziny'], correct: 1 },
  },
  {
    id: 'deadsea', name: 'Morze Martwe', region: 'Najniżej na Ziemi', lat: 31.5, lon: 35.5,
    label: { dx: 10, dy: 4, anchor: 'start' }, altitude: -430,
    intro: 'Najniżej położone miejsce na lądzie. Woda jest tak słona, że unosisz się jak korek.',
    facts: [
      'Brzeg leży ok. 430 m poniżej poziomu morza.',
      'Woda ma ok. 34% soli, prawie 10 razy więcej niż ocean.',
      'Nie da się tu utonąć… ani zanurkować.',
      'W grotach Qumran nad brzegiem znaleziono najstarsze znane rękopisy Biblii.',
    ],
    bible: [
      { event: "Tu leżały Sodoma i Gomora, a żona Lota zamieniła się w słup soli", ref: "Rdz 19,24-26" },
      { event: "Ezechiel widzi rzekę wypływającą ze świątyni, która ożywia Morze Martwe", ref: "Ez 47,8-10" },
      { event: "Niedaleko, nad Jordanem, Jan ochrzcił Jezusa", ref: "Mt 3,13-17" },
    ],
    tip: 'Nie gol się dzień wcześniej i nie chlap wodą. Sól mocno szczypie.',
    toy: 'saltwater',
  },
  {
    id: 'shefayim', name: 'Shefayim', region: 'Konferencja', lat: 32.22, lon: 34.82,
    label: { dx: -8, dy: -4, anchor: 'end' }, altitude: 20,
    intro: 'Kibuc nad morzem, niedaleko Herclijji. Tu odbywa się konferencja: uwielbienie, nauczanie i ludzie z wielu krajów.',
    facts: [
      'Kibuc Shefayim założono w 1935 roku.',
      'Kibuc to wspólnota, w której mieszkańcy razem pracują i dzielą się zasobami.',
      'Do plaży jest stąd kilkanaście minut.',
    ],
    bible: [
      { event: "Pierwsi chrześcijanie „mieli wszystko wspólne”, trochę jak w kibucu", ref: "Dz 2,44-47" },
      { event: "Niedaleko, w Cezarei, Piotr chrzci Korneliusza, pierwszego poganina", ref: "Dz 10" },
      { event: "W Cezarei Paweł głosi Ewangelię królowi Agryppie", ref: "Dz 26" },
    ],
    verse: { text: 'Bo gdzie są dwaj albo trzej zgromadzeni w imię moje, tam jestem pośród nich.', ref: 'Mt 18,20' },
    tip: 'Notes i Biblia. Warto zapisywać, co Bóg mówi przez te dni.',
    quiz: { question: 'Czym jest kibuc?', answers: ['Rodzaj chleba', 'Wspólnota, która razem pracuje', 'Żydowskie święto'], correct: 1 },
    highlight: true,
  },
]

/** Places with their own pin and tile. Sub-places live under their parent. */
export const TOP_PLACES = PLACES.filter(p => !p.parent)
export const childrenOf = (id: PlaceId) => PLACES.filter(p => p.parent === id)

export const placeById = Object.fromEntries(PLACES.map(p => [p.id, p])) as Record<PlaceId, Place>
