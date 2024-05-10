import { FrameContext, FrameResponse, HandlerResponse } from 'frog';
import { LayeredCard, Layout } from '../../components';
import { Text } from '../../system';
import logger from '../../logger';
import { User, userApi } from '../../api';

export interface UserScopeFrameHandlerContext extends FrameContext {
  user: User;
}

export const createDefaultFrameHandler = <FrameContextType extends FrameContext>(
  callback: (context: FrameContextType) => HandlerResponse<FrameResponse>,
) => {
  return async (context: FrameContextType) => {
    try {
      return await callback(context);
    } catch (error) {
      logger.error('Error in frame handler:', error);

      if (error && typeof error === 'object' && 'stack' in error) {
        logger.error(error.stack);
      }

      return context.res({
        image: (
          <Layout>
            <LayeredCard>
              <Text size="24">😵 Uppppsss! Something went wrong!</Text>
            </LayeredCard>
          </Layout>
        ),
      });
    }
  };
};

export const createVerifiedFameHandler = <FrameContextType extends FrameContext>(
  callback: (context: FrameContextType) => HandlerResponse<FrameResponse>,
) => {
  return createDefaultFrameHandler((context: FrameContextType) => {
    if (!context.verified && process.env.NODE_ENV !== 'development') {
      return context.res({
        image: (
          <Layout>
            <LayeredCard>
              <Text size="24">⚠️ Frame is not verified!</Text>
            </LayeredCard>
          </Layout>
        ),
      });
    }

    if (!context.frameData) {
      return context.res({
        image: (
          <Layout>
            <LayeredCard>
              <Text size="24">⚠️ Frame data is not provided.</Text>
            </LayeredCard>
          </Layout>
        ),
      });
    }

    return callback(context);
  });
};

export const createUserScopeFrameHandler = <FrameContextType extends FrameContext>(
  callback: (context: UserScopeFrameHandlerContext & FrameContextType) => HandlerResponse<FrameResponse>,
) => {
  return createVerifiedFameHandler<FrameContextType>(async (context: FrameContextType) => {
    const { fid } = context.frameData!;

    let user = await userApi.getByFid(fid);

    if (!user) {
      user = await userApi.create(fid);
    }

    return callback(Object.assign(context, { user }));
  });
};
