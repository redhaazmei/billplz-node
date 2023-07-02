import { APIConfig } from './resources/base';
import { BillplzCollections } from './resources/collections';

class Billplz {
  public collections: BillplzCollections;

  constructor(config: APIConfig) {
    this.collections = new BillplzCollections(config);
  }
}

export default Billplz;
