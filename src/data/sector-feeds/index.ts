import type { CompanySectorFeeds } from '../../types';
import { OS1_SECTOR_FEEDS } from './os1';
import { MCDONALDS_SECTOR_FEEDS } from './mcdonalds';
import { NIKE_SECTOR_FEEDS } from './nike';
import { NUBANK_SECTOR_FEEDS } from './nubank';
import { IFOOD_SECTOR_FEEDS } from './ifood';
import { AMBEV_SECTOR_FEEDS } from './ambev';
import { MAGALU_SECTOR_FEEDS } from './magalu';
import { EMBRAER_SECTOR_FEEDS } from './embraer';
import { TESLA_SECTOR_FEEDS } from './tesla';
import { NETFLIX_SECTOR_FEEDS } from './netflix';
import { SPOTIFY_SECTOR_FEEDS } from './spotify';
import { AIRBNB_SECTOR_FEEDS } from './airbnb';
import { UBER_SECTOR_FEEDS } from './uber';
import { APPLE_SECTOR_FEEDS } from './apple';
import { AMAZON_SECTOR_FEEDS } from './amazon';
import { NATURA_SECTOR_FEEDS } from './natura';
import { CERVEJA_IMPERIO_SECTOR_FEEDS } from './cerveja-imperio';
import { OSCAR_LOJA1_SECTOR_FEEDS } from './oscar-loja1';
import { PACHECO_LOJA1_SECTOR_FEEDS } from './pacheco-loja1';

export const PROFILE_SECTOR_FEEDS: Record<string, CompanySectorFeeds> = {
  os1:       OS1_SECTOR_FEEDS,
  mcdonalds: MCDONALDS_SECTOR_FEEDS,
  nike:      OSCAR_LOJA1_SECTOR_FEEDS,
  nubank:    NUBANK_SECTOR_FEEDS,
  'oscar-piloto-01': OSCAR_LOJA1_SECTOR_FEEDS,
  'pacheco-loja-01': PACHECO_LOJA1_SECTOR_FEEDS,
  'cerveja-imperio':                  CERVEJA_IMPERIO_SECTOR_FEEDS,
  'cerveja-imperio-distribuidora-01': CERVEJA_IMPERIO_SECTOR_FEEDS,
  ifood:     IFOOD_SECTOR_FEEDS,
  ambev:     AMBEV_SECTOR_FEEDS,
  magalu:    MAGALU_SECTOR_FEEDS,
  embraer:   EMBRAER_SECTOR_FEEDS,
  tesla:     TESLA_SECTOR_FEEDS,
  netflix:   NETFLIX_SECTOR_FEEDS,
  spotify:   SPOTIFY_SECTOR_FEEDS,
  airbnb:    AIRBNB_SECTOR_FEEDS,
  uber:      UBER_SECTOR_FEEDS,
  apple:     APPLE_SECTOR_FEEDS,
  amazon:    AMAZON_SECTOR_FEEDS,
  natura:    NATURA_SECTOR_FEEDS,
};
