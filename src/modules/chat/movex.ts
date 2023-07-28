import { Action } from 'movex';

/**
 * Define the State Type and the Initial State Value
 */

export const userSlots = {
  pink: true,
  red: true,
  blue: true,
  yellow: true,
  green: true,
  orange: true,
};

export type UserSlots = keyof typeof userSlots;

export type ChatMsg = {
  content: string;
  atTimestamp: number;
  userSlot: UserSlots;
};

export type ChatState = {
  userSlots: {
    [slot in UserSlots]: boolean;
  };
  messages: ChatMsg[];
};

export const initialChatState: ChatState = {
  userSlots,
  messages: [],
};

/**
 * Type all the Actions that affect the state
 */
export type ChatActions =
  | Action<
      'join',
      {
        userSlot: UserSlots;
      }
    >
  | Action<
      'leave',
      {
        userSlot: UserSlots;
      }
    >
  | Action<
      'submit',
      {
        userSlot: UserSlots;
        content: string;
        atTimestamp: number;
      }
    >;

/**
 * The Chat Reducer. This is where all the logic happens
 *
 * @param state
 * @param action
 * @returns
 */
export const reducer = (
  state = initialChatState,
  action: ChatActions
): ChatState => {
  // User Joins
  if (action.type === 'join') {
    return {
      ...state,
      userSlots: {
        ...state.userSlots,
        [action.payload.userSlot]: false,
      },
    };
  } 
  // User Leaves
  else if (action.type === 'leave') {
    return {
      ...state,
      userSlots: {
        ...state.userSlots,
        [action.payload.userSlot]: true,
      },
    };
  }
  // Message gets submitted
  else if (action.type === 'submit') {
    const nextMsg = action.payload;

    return {
      ...state,
      messages: [...state.messages, nextMsg],
    };
  }

  return state;
};
