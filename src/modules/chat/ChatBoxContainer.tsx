import { Dispatch, useEffect } from 'react';
import { ChatBox } from './ChatBox';
import { ChatActions, ChatState, UserSlot } from './reducer';

type Props = {
  userSlot: UserSlot;
  state: ChatState;
  dispatch: Dispatch<ChatActions>;
};

export const ChatBoxContainer: React.FC<Props> = ({
  dispatch,
  state,
  userSlot,
}) => {
  useEffect(() => {
    // Join as soon as the component mounts
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
