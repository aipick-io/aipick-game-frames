import { Button, Frog } from 'frog';
import dayjs from 'dayjs';
import { LayeredCard, Layout } from '../../components';
import { Text } from '../../system';
import { portfolioApi } from '../../api';
import { createOfferUnauthorizedFrameHandler, createOfferAuthorizedFrameHandler } from '../handlers';
import { encodeData, decodeDate } from '../../utils/encoding';

export const createOfferFramesApi = () => {
  const router = new Frog();

  router.frame(
    '/:offerDay',
    createOfferUnauthorizedFrameHandler(async (context) => {
      const formattedDate = dayjs(context.offer.date, 'MM/DD/YYYY').format('MMM Do');

      return context.res({
        image: (
          <Layout>
            <LayeredCard>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Text size="24">Wow! What do we have here?</Text>
              </div>
              <Text color="primary" size="18">
                ⭐{formattedDate} 12AM - 11:59PM (UTC) Offer!⭐
              </Text>
            </LayeredCard>
          </Layout>
        ),
        intents: [<Button action={`/${context.offer.day}/portfolio`}>Create Portfolio</Button>],
      });
    }),
  );

  router.frame(
    '/:offerDay/portfolio',
    createOfferAuthorizedFrameHandler(async (context) => {
      const { buttonValue, offer, currentDay, user } = context;

      if (offer.day !== currentDay + 1) {
        return context.res({
          image: (
            <Layout>
              <LayeredCard>
                <Text size="24">😔 Sorry, but this offer is closed!</Text>
              </LayeredCard>
            </Layout>
          ),
        });
      }

      const encodedPortfolioData = buttonValue || '';

      const { tokens = [], submit = false } =
        decodeDate<{
          tokens?: string[];
          submit?: boolean;
        }>(encodedPortfolioData) || {};

      if (tokens.length > offer.tokenOffers.length) {
        return context.res({
          image: (
            <Layout>
              <LayeredCard>
                <Text size="24">Hmm... you've selected so many offers!</Text>
                <div style={{ display: 'flex', marginTop: 10 }}>
                  <Text size="24">Your portfolio become so heavy to submit it!</Text>
                </div>
              </LayeredCard>
            </Layout>
          ),
          intents: [<Button action={`/${offer.day}`}>Go Back</Button>],
        });
      }

      const allTokensSelected = tokens.length === offer.tokenOffers.length;

      if (allTokensSelected && submit) {
        await portfolioApi.createPortfolio({
          userId: user.id,
          offerId: offer.id,
          selectedTokens: tokens,
        });

        console.log(process.env.FARCASTER_ACCOUNT_URL)

        return context.res({
          image: (
            <Layout>
              <LayeredCard>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text size="32">🎉 Congratulations! 🎉</Text>
                  <Text color="primary" size="24">
                    Your portfolio was submitted!
                  </Text>
                  <Text size="18">⌛ Wait for results! ⌛</Text>
                </div>
              </LayeredCard>
            </Layout>
          ),
          intents: [
            <Button.Link href={process.env.APPLICATION_ORIGIN || ''}>Go to App</Button.Link>,
            <Button.Link href={process.env.FARCASTER_ACCOUNT_URL || ''}>Follow</Button.Link>,
          ],
        });
      }

      const tokenOffer = offer.tokenOffers[tokens.length];

      const firstButtonAction = allTokensSelected
        ? undefined
        : encodeData({ tokens: [...tokens, tokenOffer.firstToken] });

      const secondButtonAction = allTokensSelected
        ? encodeData({ tokens, submit: true })
        : encodeData({ tokens: [...tokens, tokenOffer.secondToken] });

      return context.res({
        image: (
          <Layout>
            <LayeredCard>
              <div style={{ display: 'flex', marginBottom: 40 }}>
                {allTokensSelected ? (
                  <Text color="primary" size="24">
                    You Portfolio is ready! Submit it!
                  </Text>
                ) : (
                  <div style={{ display: 'flex', columnGap: 20 }}>
                    <Text size="24" color="primary">
                      {tokenOffer.firstToken.toUpperCase()}
                    </Text>
                    <Text size="24" color="white100Base">
                      vs
                    </Text>
                    <Text size="24" color="primary">
                      {tokenOffer.secondToken.toUpperCase()}
                    </Text>
                  </div>
                )}
              </div>
              <Text size="18" color="white100Base">
                👑 Add your Token to your Daily Portfolio 👑
              </Text>
            </LayeredCard>
            <div style={{ display: 'flex', marginTop: 40 }}>
              <Text size="20" color="white100Base">
                {dayjs(offer.date, 'MM/DD/YYYY').format('MMM Do')} 12AM - 11:59PM (UTC)
              </Text>
            </div>
          </Layout>
        ),
        intents: [
          <Button action={`/${offer.day}/portfolio`} value={firstButtonAction}>
            {allTokensSelected ? 'Reset' : tokenOffer.firstToken.toUpperCase()}
          </Button>,
          <Button action={`/${offer.day}/portfolio`} value={secondButtonAction}>
            {allTokensSelected ? 'Submit' : tokenOffer.secondToken.toUpperCase()}
          </Button>,
        ],
      });
    }),
  );

  return router;
};
