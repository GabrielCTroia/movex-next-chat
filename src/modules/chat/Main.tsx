import { useEffect } from 'react';
import { MovexBoundResourceFromConfig } from 'movex-react';
import { ChatBox } from './ChatBox';
import { ResourceIdentifierStr, toRidAsStr } from 'movex';
import { userSlots } from './movex';
import movexConfig from '../../movex.config';

type Props = {
  boundChatResource: MovexBoundResourceFromConfig<
    (typeof movexConfig)['resources'],
    'chat'
  >;
  userSlot: keyof typeof userSlots;
};

export const Main: React.FC<Props> = ({ boundChatResource, userSlot }) => {
  const { state, dispatch, rid } = boundChatResource;

  useEffect(() => {
    // Join as soon as the component mounts
    // This behavior can be changed per use case of course.
    dispatch({
      type: 'join',
      payload: {
        userSlot,
      },
    });

    return () => {
      // Leave as soon as the component umounts
      dispatch({
        type: 'leave',
        payload: {
          userSlot,
        },
      });
    };
  }, [userSlot]);

  return (
    <ChatBox
      messages={state.messages}
      userSlot={userSlot}
      ridAsStr={toRidAsStr(rid) as ResourceIdentifierStr<'chat'>}
      onSubmit={(msg) => {
        // Submit the message to Movex
        dispatch({
          type: 'submit',
          payload: msg,
        });
      }}
    />
  );
};
