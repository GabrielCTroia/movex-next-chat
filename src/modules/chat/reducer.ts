type Action<
  TType extends string,
  TPayload = undefined
> = TPayload extends undefined
  ? {
      type: TType;
    }
  : {
      type: TType;
      payload: TPayload;
    };

// PART 1: State Type and Initial State Value

export const userSlots = {
  pink: true,
  red: true,
  blue: true,
  purple: true,
  green: true,
  orange: true,
};

export type UserSlot = keyof typeof userSlots;

export type ChatMsg = {
  content: string;
  atTimestamp: number;
  userSlot: UserSlot;
};

export type ChatState = {
  userSlots: {
    [slot in UserSlot]: boolean;
  };
  messages: ChatMsg[];
};

export const initialChatState: ChatState = {
  userSlots,
  messages: [],
};

// PART 2: Action Types

export type ChatActions =
  | Action<
      'join',
      {
        userSlot: UserSlot;
      }
    >
  | Action<
      'leave',
      {
        userSlot: UserSlot;
      }
    >
  | Action<
      'submit',
      {
        userSlot: UserSlot;
        content: string;
        atTimestamp: number;
      }
    >;

// PART 3: The Reducer – This is where all the logic happens

export default (state = initialChatState, action: ChatActions): ChatState => {
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
