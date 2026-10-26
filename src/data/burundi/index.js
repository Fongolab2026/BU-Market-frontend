/**
 * Découpage administratif officiel du Burundi (5 provinces, 42 communes).
 *
 * Les quartiers/collines proviennent du COD-AB Burundi v02 (juillet 2026)
 * publié par OCHA Burundi / HDX (https://data.humdata.org/dataset/cod-ab-bdi),
 * aligné sur la loi organique n°1/05 du 16 mars 2023. Les zones servent
 * uniquement à regrouper les quartiers dans le sélecteur : le formulaire
 * n'enregistre que la province, la commune et le quartier.
 *
 * Le fichier est découpé par province (et par tranche de communes lorsque la
 * province est volumineuse) pour respecter la limite de 500 lignes.
 */
import { buhumuza1 } from './provinces/buhumuza-1.js'
import { buhumuza2 } from './provinces/buhumuza-2.js'
import { bujumbura1 } from './provinces/bujumbura-1.js'
import { bujumbura2 } from './provinces/bujumbura-2.js'
import { burunga1 } from './provinces/burunga-1.js'
import { burunga2 } from './provinces/burunga-2.js'
import { butanyerera1 } from './provinces/butanyerera-1.js'
import { butanyerera2 } from './provinces/butanyerera-2.js'
import { butanyerera3 } from './provinces/butanyerera-3.js'
import { gitega1 } from './provinces/gitega-1.js'
import { gitega2 } from './provinces/gitega-2.js'
import { gitega3 } from './provinces/gitega-3.js'

export const BURUNDI_LOCATIONS = {
  "Buhumuza": {
    ...buhumuza1,
    ...buhumuza2,
  },
  "Bujumbura": {
    ...bujumbura1,
    ...bujumbura2,
  },
  "Burunga": {
    ...burunga1,
    ...burunga2,
  },
  "Butanyerera": {
    ...butanyerera1,
    ...butanyerera2,
    ...butanyerera3,
  },
  "Gitega": {
    ...gitega1,
    ...gitega2,
    ...gitega3,
  },
}
