import { Button, Frog } from 'frog';
import { LayeredCard, Layout } from '../../components';
import { Text } from '../../system';
import { createDefaultFrameHandler } from '../handlers';
import dayjs from 'dayjs';
import { orderApi, Order } from '../../api';

export const createBattleFramesApi = () => {
  const router = new Frog();

  router.frame(
    '/',
    createDefaultFrameHandler(async (context) => {
      return context.res({
        image: (
          <Layout>
            <LayeredCard>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Text size="24">Join our new PvP competition and Win daily rewards🏆!</Text>
              </div>
            </LayeredCard>
          </Layout>
        ),
        intents: [
          <Button.Link href={`https://aipick.io`}>Market</Button.Link>,
          <Button action={`/orders`}>Order</Button>,
        ],
      });
    }),
  );

  router.frame(
    '/orders',
    createDefaultFrameHandler(async (context) => {
      const formattedDate = dayjs().add(1, 'day').format('MMM Do');

      return context.res({
        image: (
          <Layout>
            <LayeredCard>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Text size="24">Complete in PvP today to win Tomorrow!</Text>
              </div>
              <Text color="primary" size="18">
                ⭐{formattedDate} 12AM - 11:59PM (UTC) Offer!⭐
              </Text>
            </LayeredCard>
          </Layout>
        ),
        intents: [
          <Button action={`/orders/completed`}>Finished</Button>,
          <Button action={`/orders/create`}>Create</Button>,
          <Button action={`/orders/live`}>Live</Button>,
        ],
      });
    }),
  );

  router.frame(
    '/orders/completed',
    createDefaultFrameHandler(async (context) => {
      const orders = await orderApi.listCompletedOrders();
      const title = '1 day(s) tips send to sports-fi';

      return context.res({
        image: (
          <OrdersLayout>
            <OrderPageTitle title={title} />
            <Orders orders={orders} />
          </OrdersLayout>
        ),
        intents: [<Button action={`/orders`}>Go Back</Button>],
      });
    }),
  );

  router.frame(
    '/orders/live',
    createDefaultFrameHandler(async (context) => {
      const orders = await orderApi.listLiveOrders();
      const title = '1 day(s) tips send to sports-fi';

      return context.res({
        image: (
          <OrdersLayout>
            <OrderPageTitle title={title} />
            <Orders orders={orders} />
          </OrdersLayout>
        ),
        intents: [<Button action={`/orders`}>Go Back</Button>],
      });
    }),
  );

  return router;
};

interface OrdersProps {
  orders: Order[];
}

interface OrderLayoutProps {
  children: JSX.Element | JSX.Element[];
}

interface OrderPageTitleProps {
  title: string;
}

function Orders({ orders }: OrdersProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {orders.length === 0 ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 32,
            margin: '20px',
          }}
        >
          No orders yet
        </div>
      ) : (
        orders.map((item, index) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              margin: '10px 0',
              width: '50%',
              borderRight: '2px solid #FFFFFF',
              fontSize: 32,
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', flex: '0 0 40px', justifyContent: 'center' }}>{index + 1}</div>
            <div style={{ display: 'flex' }}>-</div>
            <div style={{ display: 'flex' }}>{item.creatorName}</div>
            <div
              style={{
                display: 'flex',
                marginLeft: 'auto',
                flex: '0 0 90px',
                textAlign: 'left',
              }}
            >
              {item.participants}
            </div>
            <div
              style={{
                display: 'flex',
                flex: '0 0 90px',
                textAlign: 'left',
              }}
            >
              {item.points || '0'}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function OrdersLayout({ children }: OrderLayoutProps) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #432889 30%, #cd34da 100%)',
        backgroundSize: '100% 100%',
        fontStyle: 'normal',
        display: 'flex',
        padding: 10,
        height: '100%',
        width: '100%',
        color: '#FFFFFF',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
}

function OrderPageTitle({ title }: OrderPageTitleProps) {
  return (
    <div
      style={{
        justifyContent: 'center',
        width: '100%',
        padding: '10px',
        marginBottom: '40px',
        textTransform: 'uppercase',
        display: 'flex',
      }}
    >
      <Text size="18" color="white100Base">
        {title}
      </Text>
    </div>
  );
}
