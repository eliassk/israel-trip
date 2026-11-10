import type { FC } from 'react'
import { MatkotGame } from './MatkotGame'
import { ExcavationGame } from './ExcavationGame'
import { FishingGame } from './FishingGame'
import { OlivePressGame } from './OlivePressGame'
import { BethesdaToy } from './BethesdaToy'
import { WallBuilderGame } from './WallBuilderGame'
import { HaggleGame } from './HaggleGame'
import { NightSkyToy } from './NightSkyToy'
import { SaltwaterToy } from './SaltwaterToy'

export interface ToyProps { onDone: () => void }

export const TOYS = {
  matkot: { title: 'Matkot na plaży w Tel Awiwie. Ile odbić wytrzymasz?', Component: MatkotGame },
  excavation: { title: 'Wykopaliska na czas: 30 sekund, łap skarby, omijaj śmieci.', Component: ExcavationGame },
  fishing: { title: 'Zarzuć sieć! 30 sekund, ile ryb złowisz?', Component: FishingGame },
  olivepress: { title: 'Tłocznia oliwy: 10 sekund, ile oliwy wyciśniesz?', Component: OlivePressGame },
  bethesda: { title: 'Wskocz do sadzawki, kiedy woda się poruszy.', Component: BethesdaToy },
  wallbuilder: { title: 'Zbuduj mur Heroda. Ile warstw ułożysz?', Component: WallBuilderGame },
  haggle: { title: 'Potarguj się na targu. Ile zaoszczędzisz?', Component: HaggleGame },
  sky: { title: 'Zgaś światła miasta i zobacz niebo nad pustynią.', Component: NightSkyToy },
  saltwater: { title: 'Dosyp soli do wody i zobacz, co się stanie.', Component: SaltwaterToy },
} satisfies Record<string, { title: string; Component: FC<ToyProps> }>

export type ToyId = keyof typeof TOYS
