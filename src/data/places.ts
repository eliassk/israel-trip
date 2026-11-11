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
  /** A fact MAY be a Bible quote, shown as a verse instead of plain text. */
  facts: (string | { text: string; ref: string })[]
  /** Bible events tied to this place. Own words, not quotations. */
  /** `where` ties the verse to the place; the verse text itself lives in `verses.ts`. */
  bible?: { where: string; ref: string }[]
  /** Quoted from Biblia Warszawska. */
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
      { where: "Jafa, czyli dawna Joppa", ref: "Jon 1,3" },
      { where: "Jafa", ref: "Dz 9,36-42" },
      { where: "Jafa, dom Szymona garbarza", ref: "Dz 10,9-23" },
      { where: "Port w Jafie", ref: "2 Krn 2,15" },
    ],
    toy: 'matkot',
  },
  {
    id: 'megiddo', name: 'Megiddo', region: 'Dolina Jezreel', lat: 32.585, lon: 35.185,
    label: { dx: -8, dy: -6, anchor: 'end' }, altitude: 60,
    intro: 'Wzgórze, na którym przez tysiące lat budowano miasto na mieście. Strategiczne skrzyżowanie dróg starożytnego świata.',
    facts: [
      'Megiddo to „tel”, czyli wzgórze z ponad 20 warstw miast.',
      'Można przejść starożytnym tunelem wodnym wykutym w skale.',
      'Harmagedon z Apokalipsy to po hebrajsku Har Megiddo, czyli „góra Megiddo”.',
      { text: 'Są to bowiem duchy demonów, które czynią cuda i wychodzą do królów całego świata, aby ich zgromadzić na wojnę w wielkim dniu Boga Wszechmogącego. […] I zgromadziły ich na miejscu, które po hebrajsku nazywa się Harmagedon.', ref: 'Ap 16,14.16' },
    ],
    bible: [
      { where: "Wody Megiddo, u stóp wzgórza", ref: "Sdz 5,19" },
      { where: "Megiddo", ref: "1 Krl 9,15" },
      { where: "Megiddo", ref: "2 Krl 23,29" },
      { where: "Harmagedon, czyli góra Megiddo", ref: "Ap 16,16" },
    ],
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
      { where: "Źródło Charod, kilka km od parku", ref: "Sdz 7,1-7" },
      { where: "Góra Gilboa, widoczna z basenów", ref: "1 Sm 31,1-6" },
      { where: "Góra Gilboa", ref: "2 Sm 1,17-27" },
    ],
    quiz: { question: 'Jaką temperaturę ma woda w Gan HaShlosha?', answers: ['ok. 15°C', 'ok. 28°C', 'ok. 40°C'], correct: 1 },
  },
  {
    id: 'galilee', name: 'Jezioro Galilejskie', region: 'Galilea', lat: 32.79, lon: 35.53,
    label: { dx: -10, dy: -6, anchor: 'end' }, altitude: -210,
    intro: 'Jezioro, nad którym Jezus nauczał i powołał rybaków na uczniów. Kafarnaum, Góra Błogosławieństw i Tabgha.',
    facts: [
      'Jezioro leży ok. 210 m poniżej poziomu morza.',
      'Ma 21 km długości i 13 km szerokości.',
      'Jezioro słynie z nagłych burz. Leży w niecce otoczonej górami, a chłodny wiatr spadający ze wzgórz potrafi w kilka minut zmienić spokojną wodę w fale wysokie na ponad 2 metry. Tak zaskoczyła uczniów burza z Ewangelii.',
      'W Kafarnaum widać ruiny synagogi i domu Piotra.',
    ],
    bible: [
      { where: "Brzeg jeziora", ref: "Mk 1,16-20" },
      { where: "Kafarnaum, nad jeziorem", ref: "Mk 2,1-12" },
      { where: "Góra Błogosławieństw, nad jeziorem", ref: "Mt 5–7" },
      { where: "Na jeziorze", ref: "Mk 4,35-41" },
      { where: "Na jeziorze", ref: "Mt 14,22-33" },
      { where: "Brzeg jeziora, Tabgha", ref: "J 21" },
    ],
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
      { where: "Cezarea Filipowa (Banias), u stóp Hermonu", ref: "Mt 16,13-20" },
      { where: "Golan, jedno z miast schronienia", ref: "Pwt 4,43" },
    ],
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
      { where: "Miasto Dawida, najstarsza część Jerozolimy", ref: "2 Sm 5,6-10" },
      { where: "Droga z Góry Oliwnej do miasta", ref: "Mk 11,1-11" },
      { where: "Golgota i grób, dziś Bazylika Grobu", ref: "J 19–20" },
      { where: "Jerozolima, w Zielone Świątki", ref: "Dz 2" },
    ],
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
      { where: "Zbocze Góry Oliwnej, z widokiem na miasto", ref: "Łk 19,41-44" },
      { where: "Betfage na Górze Oliwnej", ref: "Mk 11,1-10" },
      { where: "Góra Oliwna", ref: "Mt 24,3" },
      { where: "Ogród Getsemani", ref: "Mk 14,32-42" },
      { where: "Góra Oliwna", ref: "Dz 1,9-12" },
    ],
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
      { where: "Sadzawka Betesda", ref: "J 5,1-9" },
      { where: "Słowa Jezusa po uzdrowieniu przy sadzawce", ref: "J 5,17" },
    ],
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
      { where: "Góra Moria, dziś Wzgórze Świątynne", ref: "Rdz 22,2" },
      { where: "Góra Moria, dziś Wzgórze Świątynne", ref: "2 Krn 3,1" },
      { where: "Świątynia", ref: "Łk 2,22-38" },
      { where: "Świątynia", ref: "Łk 2,41-52" },
      { where: "Dziedziniec świątyni", ref: "J 2,13-22" },
      { where: "Przed świątynią", ref: "Mk 13,1-2" },
    ],
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
      { where: "Pustynia Judzka", ref: "Mt 3,1-3" },
      { where: "Pustynia Judzka", ref: "Mt 4,1-11" },
      { where: "Droga z Jerozolimy do Jerycha przez pustynię", ref: "Łk 10,30-37" },
      { where: "En-Gedi, oaza na pustyni", ref: "1 Sm 24" },
    ],
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
      { where: "Herod, który zbudował Masadę", ref: "Mt 2,16" },
      { where: "„Twierdza”, po hebrajsku mecuda, jak Masada", ref: "Ps 18,3" },
      { where: "Warownie Pustyni Judzkiej", ref: "1 Sm 23,14" },
    ],
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
      'Morze Martwe kurczy się z roku na rok: poziom wody spada o ponad metr rocznie.',
      'W grotach Qumran nad brzegiem znaleziono najstarsze znane rękopisy Biblii.',
    ],
    bible: [
      { where: "Okolice Morza Martwego", ref: "Rdz 19,24-26" },
      { where: "Morze Martwe", ref: "Ez 47,8-10" },
      { where: "Jordan, niedaleko ujścia do Morza Martwego", ref: "Mt 3,13-17" },
    ],
    toy: 'saltwater',
  },
  {
    id: 'shefayim', name: 'Shefayim', region: 'Konferencja', lat: 32.22, lon: 34.82,
    label: { dx: -8, dy: -4, anchor: 'end' }, altitude: 20,
    intro: 'Kibuc nad morzem, niedaleko Herclijji. Tu odbywa się konferencja.',
    facts: [
      'Kibuc Shefayim założono w 1935 roku.',
      'Kibuc to wspólnota, w której mieszkańcy razem pracują i dzielą się zasobami.',
      'Do plaży jest stąd kilkanaście minut.',
    ],
    bible: [
      { where: "Pierwsza wspólnota, trochę jak kibuc", ref: "Dz 2,44-47" },
      { where: "Cezarea, ok. 30 km od Shefayim", ref: "Dz 10" },
      { where: "Cezarea", ref: "Dz 26" },
    ],
    quiz: { question: 'Czym jest kibuc?', answers: ['Rodzaj chleba', 'Wspólnota, która razem pracuje', 'Żydowskie święto'], correct: 1 },
    highlight: true,
  },
]

/** Places with their own pin and tile. Sub-places live under their parent. */
export const TOP_PLACES = PLACES.filter(p => !p.parent)
export const childrenOf = (id: PlaceId) => PLACES.filter(p => p.parent === id)

export const placeById = Object.fromEntries(PLACES.map(p => [p.id, p])) as Record<PlaceId, Place>
