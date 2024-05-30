import ApiClient from '../clients/ApiClient';

export interface Order {
  id: number;
  creatorName: string;
  participants: number;
  points: number;
}

export class HttpOrderApi {
  constructor(private client: ApiClient) {
    this.client = client;
  }
  listCompletedOrders() {
    return Promise.resolve(getMockedCompletedOrders());
  }
  listLiveOrders() {
    return Promise.resolve(getMockedLiveOrders());
  }
}
function getMockedCompletedOrders(): Order[] {
  return [
    {
      id: 1,
      creatorName: 'sakura82',
      participants: 23,
      points: 2,
    },
    {
      id: 2,
      creatorName: 'geos',
      participants: 128,
      points: 0,
    },
  ];
}
function getMockedLiveOrders(): Order[] {
  return [
    {
      id: 3,
      creatorName: 'geos-82',
      participants: 23,
      points: 2,
    },
    {
      id: 5,
      creatorName: 'sakura',
      participants: 128,
      points: 42,
    },
  ];
}
