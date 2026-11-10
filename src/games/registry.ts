import type { GameDef, GameKey } from './types'
import { FishingCore } from './cores/FishingCore'
import { MatkotCore } from './cores/MatkotCore'
import { ExcavationCore } from './cores/ExcavationCore'
import { WallCore } from './cores/WallCore'
import { RangeCore } from './cores/RangeCore'
import { OlivePressCore } from './cores/OlivePressCore'
import { HaggleCore } from './cores/HaggleCore'

export const GAME_DEFS: Record<GameKey, GameDef> = {
  fishing: {
    key: 'fishing', slug: 'polow', title: 'Połów na Jeziorze Galilejskim', icon: '🐟', place: 'galilee',
    rules: 'Stukaj w wodę, żeby zarzucić sieć. 🐟 to 1 ryba, 🐠 to 5. Puste zarzucenie kosztuje rybę. Seria trafień daje mnożnik!',
    unit: 'ryb', duration: 30, combo: true, medals: [40, 90, 153],
    background: 'radial-gradient(circle at 30% 20%, #5fb3cf, #1d6a8a)',
    outro: 'Piotr po nocy bez ryb złowił 153, bo posłuchał Jezusa (J 21,6-11).',
    Core: FishingCore,
  },
  range: {
    key: 'range', slug: 'strzelnica', title: 'Strzelnica Caliber 3', icon: '🎯', place: 'caliber',
    rules: 'Trafiaj czerwone tarcze, im szybciej, tym więcej punktów. Niebieskich „swoich” 🙋 nie ruszaj: −50! Pudło: −5.',
    unit: 'pkt', duration: 30, combo: true, medals: [1000, 2500, 4500],
    background: 'linear-gradient(#9cc9e6 0 18%, #c7b37f 18% 26%, #d9c89a 26%)',
    outro: 'W Caliber 3 najważniejsze jest wiedzieć, kiedy NIE strzelać.',
    Core: RangeCore,
  },
  matkot: {
    key: 'matkot', slug: 'matkot', title: 'Matkot w Tel Awiwie', icon: '🏓', place: 'jaffa',
    rules: 'Plażowe odbijanie bez siatki. Stuknij, gdy piłka wpadnie w jasny pas. Za wcześnie albo za późno: koniec.',
    unit: 'odbić', combo: false, medals: [10, 25, 50],
    background: 'linear-gradient(#7cc6dd 0 14%, #f1d9a6 14%)',
    outro: 'Na plaży w Tel Awiwie stuk piłeczek matkot słychać od rana do nocy.',
    Core: MatkotCore,
  },
  excavation: {
    key: 'excavation', slug: 'wykopaliska', title: 'Wykopaliska w Megiddo', icon: '⛏️', place: 'megiddo',
    rules: 'Łap znaleziska, zanim znikną: 🏺 1, 🪙🏹 2, 📜 5, 👑 10. Śmieci turystów 🥤🩴 to −3!',
    unit: 'pkt', duration: 30, combo: true, medals: [60, 140, 250],
    background: '#8a6a43',
    outro: 'W Megiddo naprawdę znaleziono pieczęć sługi króla Jeroboama.',
    Core: ExcavationCore,
  },
  wallbuilder: {
    key: 'wallbuilder', slug: 'mur', title: 'Mur Heroda', icon: '🧱', place: 'temple',
    rules: 'Stuknij, żeby położyć kamień. Co wystaje poza mur, odpada. Idealne położenie zachowuje cały kamień.',
    unit: 'warstw', combo: false, medals: [10, 20, 35],
    background: 'linear-gradient(#f7c873, #ffe7b0)',
    outro: 'Ściana Zachodnia ma 45 warstw kamieni, w tym 17 pod ziemią.',
    Core: WallCore,
  },
  haggle: {
    key: 'haggle', slug: 'targ', title: 'Targowanie na Machane Jehuda', icon: '🛍️', place: 'market',
    rules: 'Kup 3 rzeczy jak najtaniej. Za niska oferta obraża sprzedawcę, a po 3 obrazach płacisz pełną cenę.',
    unit: '₪', combo: false, medals: [40, 70, 100],
    background: 'linear-gradient(#3b2a4a, #7a3b2e)',
    outro: 'Na targu cena to dopiero początek rozmowy.',
    Core: HaggleCore,
  },
  olivepress: {
    key: 'olivepress', slug: 'tlocznia', title: 'Tłocznia w Getsemani', icon: '🫒', place: 'olives',
    rules: 'Getsemani to „tłocznia oliwy”. Stukaj jak najszybciej, żeby kręcić kamieniem. Masz 10 sekund.',
    unit: 'ml', duration: 10, combo: false, medals: [300, 450, 600],
    background: 'linear-gradient(#cfe3c0, #9db57f)',
    outro: 'Z jednego drzewa oliwnego zbiera się rocznie kilkanaście litrów oliwy.',
    Core: OlivePressCore,
  },
}

export const GAME_ORDER: GameKey[] = ['fishing', 'range', 'matkot', 'excavation', 'wallbuilder', 'haggle', 'olivepress']
