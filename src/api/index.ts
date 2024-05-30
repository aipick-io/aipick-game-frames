import RestApiClient from '../clients/ApiClient';
import { HttpPortfolioOfferApi } from './PortfolioOfferApi';
import { HttpPortfolioApi } from './PortfolioApi';
import { HttpUserApi } from './UserApi';
import { HttpOrderApi } from './OrderApi';

const apiClient = new RestApiClient(process.env.AIPICK_API_URL || '', process.env.AIPICK_API_KEY || '');

const portfolioOfferApi = new HttpPortfolioOfferApi(apiClient);
const portfolioApi = new HttpPortfolioApi(apiClient);
const userApi = new HttpUserApi(apiClient);
const orderApi = new HttpOrderApi(apiClient);

export { portfolioOfferApi, portfolioApi, userApi, orderApi };

export * from './PortfolioOfferApi';
export * from './PortfolioApi';
export * from './UserApi';
export * from './OrderApi';
