import './dotenv';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Button, Frog } from 'frog';
import { devtools } from 'frog/dev';
import { neynar } from 'frog/hubs';
import dayjs from 'dayjs';
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat';
import utcPlugin from 'dayjs/plugin/utc';
import { vars, Text } from './system';
import { createOfferFramesApi } from './frames/api';
import { LayeredCard, Layout } from './components';
import logger from './logger';

dayjs.extend(advancedFormatPlugin);
dayjs.extend(utcPlugin);

export const app = new Frog({
  verify: true,
  ...(process.env.NEYNAR_API_KEY ? { hub: neynar({ apiKey: process.env.NEYNAR_API_KEY }) } : {}),
  ui: { vars },
});

const initializeFrames = async () => {
  app.use('/*', serveStatic({ root: './public' }));

  if (process.env.NODE_ENV === 'development') {
    app.frame('/', (context) => {
      const offerDay = context.req.query('offerDay');

      return context.res({
        image: (
          <Layout>
            <LayeredCard>
              <Text size="32" color="primary">
                Play AiPick
              </Text>
              <div style={{ display: 'flex', marginTop: 20 }}>
                <Text size="20">👑 Time to win some $AiP (if you are good) 👑</Text>
              </div>
              {!offerDay && (
                <div style={{ display: 'flex', marginTop: 10 }}>
                  <Text color="white100Base" size="12">
                    Provide offer day to start.
                  </Text>
                </div>
              )}
            </LayeredCard>
          </Layout>
        ),
        intents: offerDay
          ? [
              <Button action={`/offers/${offerDay}`}>
                Start
              </Button>,
            ]
          : [],
      });
    });
  }

  app.route('/offers', createOfferFramesApi());

  app.get('/health', (context) => {
    return context.body('OK', 200);
  });

  const port = process.env.PORT || 3000;

  if (process.env.NODE_ENV === 'development') {
    devtools(app, { serveStatic });

    logger.info('Devtools are running.');
  }

  serve({
    fetch: app.fetch,
    port: Number(port),
  });

  logger.info(`Server is running on port ${port}`);
};

initializeFrames()
  .then(() => {
    logger.info('Frames initialized.');
  })
  .catch(() => {
    logger.error('Frames initialization failed.');

    process.exit(1);
  });
