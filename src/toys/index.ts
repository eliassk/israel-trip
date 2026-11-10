import { createElement, type FC } from 'react'
import { NightSkyToy } from './NightSkyToy'
import { SaltwaterToy } from './SaltwaterToy'
import { BethesdaToy } from './BethesdaToy'
import { GameLauncher } from '../games/GameLauncher'
import { GAME_DEFS } from '../games/registry'
import type { GameKey } from '../games/types'

export interface ToyProps { onDone: () => void }

// Scored games open in the full-screen shell; the small toys play inline on the place page.
const launcher = (game: GameKey) => ({
  title: GAME_DEFS[game].title,
  Component: ((p: ToyProps) => createElement(GameLauncher, { game, onDone: p.onDone })) as FC<ToyProps>,
})

export const TOYS = {
  matkot: launcher('matkot'),
  excavation: launcher('excavation'),
  fishing: launcher('fishing'),
  range: launcher('range'),
  olivepress: launcher('olivepress'),
  wallbuilder: launcher('wallbuilder'),
  haggle: launcher('haggle'),
  bethesda: { title: 'Wskocz do sadzawki, kiedy woda się poruszy.', Component: BethesdaToy },
  sky: { title: 'Zgaś światła miasta i zobacz niebo nad pustynią.', Component: NightSkyToy },
  saltwater: { title: 'Dosyp soli do wody i zobacz, co się stanie.', Component: SaltwaterToy },
} satisfies Record<string, { title: string; Component: FC<ToyProps> }>

export type ToyId = keyof typeof TOYS
