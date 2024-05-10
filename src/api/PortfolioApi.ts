import ApiClient from '../clients/ApiClient';

export interface ListPortfoliosParams {
  offerIds?: string[];
  userId?: string;
}

export interface CreatePortfolioParams {
  userId: string;
  offerId: string;
  selectedTokens: string[];
}

export interface Portfolio {
  id: string;
  userId: string;
  offerId: string;
  selectedTokens: string[];
  earnedPoints?: number;
  isAwarded: boolean;
}

export interface PortfolioApi {
  listPortfolios(params: ListPortfoliosParams): Promise<Portfolio[]>;
  createPortfolio(params: CreatePortfolioParams): Promise<Portfolio>;
}

export class HttpPortfolioApi implements PortfolioApi {
  public constructor(private client: ApiClient) {}

  public listPortfolios(params: ListPortfoliosParams) {
    return this.client.makeCall<Portfolio[]>(`/portfolios/listPortfolios`, 'POST', params);
  }

  public createPortfolio(params: CreatePortfolioParams): Promise<Portfolio> {
    return this.client.makeCall<Portfolio>(`/portfolios/createPortfolio`, 'POST', params);
  }
}
