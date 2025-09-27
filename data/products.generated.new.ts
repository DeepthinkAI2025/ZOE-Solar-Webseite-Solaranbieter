import {
  ProductCatalog,
  Manufacturer,
  Product,
  ProductCategory,
  ProductCatalogSource,
  ProductCatalogMetadata,
} from './productTypes';

import { alpitronic } from './manufacturers/alpitronic';
import { byd } from './manufacturers/byd';
import { enphase } from './manufacturers/enphase';
import { fox_ess } from './manufacturers/fox-ess';
import { fronius } from './manufacturers/fronius';
import { goodwe } from './manufacturers/goodwe';
import { huawei } from './manufacturers/huawei';
import { ja_solar } from './manufacturers/ja-solar';
import { jinko_solar } from './manufacturers/jinko-solar';
import { k2_systems } from './manufacturers/k2-systems';
import { keba } from './manufacturers/keba';
import { lg_energy_solution } from './manufacturers/lg-energy-solution';
import { longi_solar } from './manufacturers/longi-solar';
import { mennekes } from './manufacturers/mennekes';
import { meyer_burger } from './manufacturers/meyer-burger';
import { q_cells } from './manufacturers/q-cells';
import { schneider_electric } from './manufacturers/schneider-electric';
import { sma } from './manufacturers/sma';
import { solaredge } from './manufacturers/solaredge';
import { sonnen } from './manufacturers/sonnen';
import { trina_solar } from './manufacturers/trina-solar';
import { victron_energy } from './manufacturers/victron-energy';
import { wallbox_chargers } from './manufacturers/wallbox-chargers';

export const productCatalog: ProductCatalog = {
  version: '2024.09.11-static-seed',
  generatedAt: '2024-09-11T00:00:00.000Z',
  source: {
    system: 'manual-curated-seed',
    lastSync: '2024-09-11T00:00:00.000Z',
    reference: 'Bootstrap dataset migrated from legacy products.ts'
  },
  metadata: {
    tags: ['static', 'bootstrap'],
    locale: 'de-DE'
  },
  allCategories: ['Module', 'Wechselrichter', 'Speicher', 'Ladestationen', 'Unterkonstruktion', 'Elektrokomponenten', 'Leistungsoptimierer'],
  manufacturers: [
  alpitronic,
  byd,
  enphase,
  fox_ess,
  fronius,
  goodwe,
  huawei,
  ja_solar,
  jinko_solar,
  k2_systems,
  keba,
  lg_energy_solution,
  longi_solar,
  mennekes,
  meyer_burger,
  q_cells,
  schneider_electric,
  sma,
  solaredge,
  sonnen,
  trina_solar,
  victron_energy,
  wallbox_chargers,
  ]
};

export default productCatalog;
