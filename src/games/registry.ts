import type { GameDef, GameKey } from './types'
import { FishingCore } from './cores/FishingCore'
import { MatkotCore } from './cores/MatkotCore'
import { TunnelCore } from './cores/TunnelCore'
import { WallCore } from './cores/WallCore'
import { RangeCore } from './cores/RangeCore'
import { OlivePressCore } from './cores/OlivePressCore'
import { FalafelCore } from './cores/FalafelCore'

export const GAME_DEFS: Record<GameKey, GameDef> = {
  fishing: {
    key: 'fishing', slug: 'polow', title: 'Połów na Jeziorze Galilejskim', icon: '🐟', place: 'galilee',
    rules: 'Stukaj w wodę, żeby zarzucić sieć. 🐟 to 1 ryba, 🐡 to 2, 🐠 to 5, świecąca ryba z ⏳ daje +3 sekundy. W połowie przyjdzie burza! Po rzucie trzeba chwilę wyciągnąć sieć. Puste zarzucenie kosztuje rybę, seria trafień daje mnożnik.',
    unit: 'ryb', duration: 30, combo: true, medals: [40, 90, 153],
    background: 'radial-gradient(circle at 30% 20%, #5fb3cf, #1d6a8a)',
    outro: 'Piotr po nocy bez ryb złowił 153, bo posłuchał Jezusa (J 21,6-11).',
    Core: FishingCore,
  },
  range: {
    key: 'range', slug: 'strzelnica', title: 'Strzelnica Caliber 3', icon: '🎯', place: 'caliber',
    rules: '3 rundy: zwykłe tarcze, ruchome tarcze i zakładnicy obok celu. Trafiaj czerwone tarcze, im szybciej, tym więcej punktów. Niebieskich 🙋 nie ruszaj: −50! Pudło: −5.',
    unit: 'pkt', duration: 30, combo: true, medals: [1000, 2500, 4500],
    background: 'linear-gradient(#9cc9e6 0 18%, #c7b37f 18% 26%, #d9c89a 26%)',
    outro: 'W Caliber 3 najważniejsze jest wiedzieć, kiedy NIE strzelać.',
    Core: RangeCore,
  },
  matkot: {
    key: 'matkot', slug: 'matkot', title: 'Matkot w Tel Awiwie', icon: '🏓', place: 'jaffa',
    rules: 'Plażowe odbijanie bez siatki. Gdy piłka wpadnie w jasny pas, stuknij po tej stronie plaży, gdzie spada. Za wcześnie, za późno albo zła strona: koniec. Później zacznie wiać!',
    unit: 'odbić', combo: false, medals: [10, 25, 50],
    background: 'linear-gradient(#7cc6dd 0 14%, #f1d9a6 14%)',
    outro: 'Na plaży w Tel Awiwie stuk piłeczek matkot słychać od rana do nocy.',
    Core: MatkotCore,
  },
  tunnel: {
    key: 'tunnel', slug: 'tunel', title: 'Tunel wodny Megiddo', icon: '🏃', place: 'megiddo',
    rules: 'Oblężenie! Biegnij starożytnym tunelem po wodę. Stukaj lewą lub prawą stronę (albo przesuń palcem), żeby zmienić tor. Zbieraj dzbany 🏺, omijaj skały 🪨 i nietoperze 🦇. Masz 3 życia.',
    unit: 'dzbanów', combo: true, medals: [15, 40, 80],
    background: 'linear-gradient(#2a1d12, #4a3420)',
    outro: 'Tunel w Megiddo wykuto w skale, żeby w czasie oblężenia mieszkańcy mieli dostęp do źródła poza murami.',
    Core: TunnelCore,
  },
  wallbuilder: {
    key: 'wallbuilder', slug: 'mur', title: 'Mur Heroda', icon: '🧱', place: 'temple',
    rules: 'Stuknij, żeby położyć kamień. Co wystaje poza mur, odpada. Idealne położenie poszerza kamień z powrotem. Co 10 warstw trzęsienie ziemi przesuwa mur!',
    unit: 'warstw', combo: false, medals: [10, 20, 35],
    background: 'linear-gradient(#f7c873, #ffe7b0)',
    outro: 'Ściana Zachodnia ma 45 warstw kamieni, w tym 17 pod ziemią.',
    Core: WallCore,
  },
  falafel: {
    key: 'falafel', slug: 'falafel', title: 'Falafel na Machane Jehuda', icon: '🧆', place: 'market',
    rules: 'Prowadzisz stoisko z falafelem w godzinie szczytu. Składaj pitę dokładnie w kolejności z dymka klienta. Im szybciej, tym większy napiwek. Klient VIP 🤵 i ostatnie sekundy przed szabatem płacą podwójnie!',
    unit: '₪', duration: 45, combo: true, medals: [150, 400, 750],
    background: 'linear-gradient(#3b2a4a, #7a3b2e)',
    outro: 'W piątek przed szabatem kolejki do falafela na targu ciągną się przez pół ulicy.',
    Core: FalafelCore,
  },
  olivepress: {
    key: 'olivepress', slug: 'tlocznia', title: 'Tłocznia w Getsemani', icon: '🫒', place: 'olives',
    rules: 'Getsemani to „tłocznia oliwy”. Kręć kamieniem w rytmie: stuknij dokładnie wtedy, gdy pierścień dotknie kamienia. Seria w rytm daje mnożnik. Masz 15 sekund.',
    unit: 'ml', duration: 15, combo: true, medals: [150, 350, 550],
    background: 'linear-gradient(#cfe3c0, #9db57f)',
    outro: 'Z jednego drzewa oliwnego zbiera się rocznie kilkanaście litrów oliwy.',
    Core: OlivePressCore,
  },
}

export const GAME_ORDER: GameKey[] = ['fishing', 'range', 'matkot', 'tunnel', 'wallbuilder', 'falafel', 'olivepress']
