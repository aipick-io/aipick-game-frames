import { Button, FrameContext, FrameResponse, HandlerResponse } from 'frog';
import { portfolioApi, PortfolioOffer, portfolioOfferApi } from '../../api';
import { getCurrentDay } from '../../utils';
import { LayeredCard, Layout } from '../../components';
import { Text } from '../../system';
import {createDefaultFrameHandler, createUserScopeFrameHandler, UserScopeFrameHandlerContext} from './default';

interface OfferUnauthorizedFrameHandlerContext extends FrameContext {
  offer: PortfolioOffer;
  currentDay: number;
}

export type OfferAuthorizedFrameHandlerContext = UserScopeFrameHandlerContext &
  OfferUnauthorizedFrameHandlerContext;

export const createOfferUnauthorizedFrameHandler = <FrameContextType extends FrameContext>(
  callback: (
    context: OfferUnauthorizedFrameHandlerContext & FrameContextType,
  ) => HandlerResponse<FrameResponse>,
) => {
  return createDefaultFrameHandler(async (context: FrameContextType) => {
    const offerDay = Number(context.req.param('offerDay'));
    const offer = await portfolioOfferApi.getPortfolioOfferByDay(Number(offerDay));

    const currentDay = getCurrentDay();

    if (!offer || offer.day > currentDay + 1) {
      return context.res({
        image: (
          <Layout>
            <LayeredCard>
              <Text size="24">😔 Sorry, but this offer is not available!</Text>
            </LayeredCard>
          </Layout>
        ),
        intents: [
          <Button.Redirect location={process.env.APPLICATION_ORIGIN || ''}>Go to App</Button.Redirect>,
        ],
      });
    }

    return callback(Object.assign(context, { offer, currentDay }));
  });
};

export const createOfferAuthorizedFrameHandler = (
  callback: (context: OfferAuthorizedFrameHandlerContext) => HandlerResponse<FrameResponse>,
) => {
  return createOfferUnauthorizedFrameHandler(
    createUserScopeFrameHandler<OfferUnauthorizedFrameHandlerContext>(async (context) => {
      const { offer, currentDay, user } = context;

      const [portfolio] = await portfolioApi.listPortfolios({ userId: user.id, offerIds: [offer.id] });

      if (portfolio) {
        return context.res({
          image: (
            <Layout>
              <LayeredCard>
                <div style={{ display: 'flex', marginBottom: 10 }}>
                  <Text size="24">Portfolio was submitted for this offer!</Text>
                </div>
                <Text size="18" color="primary">
                  {portfolio.isAwarded
                    ? `Your Points: ${portfolio.earnedPoints || 0}`
                    : 'Please, wait for results!'}
                </Text>
              </LayeredCard>
            </Layout>
          ),
          intents: [
            <Button.Redirect location={process.env.APPLICATION_ORIGIN || ''}>Go to App</Button.Redirect>,
            <Button action={`/${offer.day}`}>Go Back</Button>,
          ],
        });
      }

      return callback(Object.assign(context, { offer, currentDay }));
    }),
  );
};
