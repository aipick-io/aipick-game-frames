import RestApiClient from '../clients/ApiClient';
import { HttpPortfolioOfferApi } from './PortfolioOfferApi';
import { HttpPortfolioApi } from './PortfolioApi';
import { HttpUserApi } from './UserApi';

const apiClient = new RestApiClient(process.env.AIPICK_API_URL || '', process.env.AIPICK_API_KEY || '');

const portfolioOfferApi = new HttpPortfolioOfferApi(apiClient);
const portfolioApi = new HttpPortfolioApi(apiClient);
const userApi = new HttpUserApi(apiClient);

export { portfolioOfferApi, portfolioApi, userApi };

export * from './PortfolioOfferApi';
export * from './PortfolioApi';
export * from './UserApi';
