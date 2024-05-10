import ApiClient from '../clients/ApiClient';

export interface TokenOffer {
  firstToken: string;
  secondToken: string;
}

export interface PortfolioOffer {
  id: string;
  day: number;
  date: string;
  tokenOffers: TokenOffer[];
}

export interface PortfolioOfferApi {
  getPortfolioOfferByDay(day: number): Promise<PortfolioOffer | null>;
}

export class HttpPortfolioOfferApi implements PortfolioOfferApi {
  public constructor(private client: ApiClient) {}

  public async getPortfolioOfferByDay(day: number) {
    const { offer } = await this.client.makeCall<{
      offer: PortfolioOffer | null;
    }>(`/portfolio-offers/getOfferByDay`, 'POST', {
      offerDay: day,
    });

    return offer;
  }
}
