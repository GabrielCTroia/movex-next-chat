## TL;DR

I'm building a chat app and deployed it without writing a single line of server-specific* code.

![alt text](https://media.giphy.com/media/2A75RyXVzzSI2bx4Gj/giphy.gif "Logo Title Text 1")

## 👩‍💻Let's start

```
npx create-next-app
```

Just click enter multiple times to create the project.

I don't need the fancy Next.JS's new App router, so I will use the old pages folder, but feel free to do it your way.

## Step 1 – Add the UI

We'll build a pretty basic UI for this tutorial.

### Chat Box component

This component displays the message history and hadnles submitting new messages.

```tsx
// path=src/modules/chat/ChatBox.ts

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChatMsg, UserSlot } from './reducer';
import { ResourceIdentifierStr } from 'movex';

type Props = {
  userSlot: string;
  messages: ChatMsg[];
  ridAsStr: ResourceIdentifierStr<'chat'>;
  onSubmit: (msg: ChatMsg) => void;
};

export const ChatBox: React.FC<Props> = ({
  userSlot,
  messages,
  ridAsStr,
  onSubmit,
}) => {
  const [msg, setMsg] = useState<string>();

  const submit = useCallback(() => {
    if (msg?.length && msg.length > 0) {
      onSubmit({
        content: msg,
        atTimestamp: new Date().getTime(),
        userSlot,
      });

      setMsg('');
    }
  }, [msg, userSlot, onSubmit]);

  const messagesInDescOrder = useMemo(
    () => [...messages].sort((a, b) => b.atTimestamp - a.atTimestamp),
    [messages]
  );

  // Invitation Copy logic
  const [inviteCopied, setInviteCopied] = useState(false);

  useEffect(() => {
    if (inviteCopied === true) {
      setTimeout(() => {
        setInviteCopied(false);
      }, 2000);
    }
  }, [inviteCopied]);

  return (
    <div className="flex">
      <div
        style={{
          height: 600,
          width: 300,
        }}
      >
        <div className="text-right">
          Me =
          <span
            style={{
              color: userSlot,
            }}
          >
            {' ' + userSlot}
          </span>
        </div>
        <div
          className="bg-slate-100 w-full mb-3 flex rounded-lg"
          style={{
            height: 'calc(100% - 60px + 1em)',
            flexDirection: 'column-reverse',
            overflowY: 'scroll',
            scrollBehavior: 'smooth',
          }}
        >
          {messagesInDescOrder.map((msg) => (
            <div
              key={msg.atTimestamp}
              className={`p-3 pt-2 pb-2 border-solid border-t border-slate-300 last:border-none ${
                msg.userSlot === userSlot && 'text-right'
              }`}
            >
              <div>{msg.content}</div>

              <i style={{ fontSize: '.8em', color: msg.userSlot }}>
                by "{msg.userSlot}" at{' '}
                {new Date(msg.atTimestamp).toLocaleString()}
              </i>
            </div>
          ))}
        </div>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="p-2 w-full rounded-lg"
          style={{
            border: '1px solid #ddd',
            height: '60px',
          }}
        />
        <div className="flex justify-between">
          <button
            className="bg-green-300 hover:bg-green-500 text-black font-bold py-2 px-4 rounded-lg"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/chat/${ridAsStr}`
              );

              setInviteCopied(true);
            }}
          >
            {inviteCopied ? 'Copied' : 'Invite Friend'}
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            disabled={!!(msg?.length && msg.length === 0)}
            onClick={submit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
```



## Add the Server Part 😓

Normally, this is the most difficult part as it involves a few different segments to work together – a data store (redis, postgres, etc.), the network logic and protocols (websockets, rest, p2p, etc.), a server framework, the server code and of course the server deployment and hosting. That's quite a lot, isn't it? 😣

Luckily we can use [Movex](https://movex.dev), which handles all of these out of the box as well as the frontend state management (the flux part).

### What the "X" is Movex?🧐

> Movex is a "predictable state container*" for multiplayer applications.
Server Authoritative by nature. No Server hassle by design. Realtime Sync and Secret State out of the box.

> The best part is that there is no need to worry about Server Code or Server Deployments. Really! You just just write client code using any of the Javascript frameworks or game engines, and Movex will takes care of the server code incidentally.

> See more on how here https://www.movex.dev/

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bsgt24urbnsrqlzownos.png)

I would appreciate it a lot if you could give us a star and let us know if you find it useful in the comments! 🙌 https://github.com/movesthatmatter/movex

### How to add Movex to the React app

```
yarn add movex movex-react movex-core-util; yarn add --dev movex-service
```

#### 1. Add the State Reducer and Actions

The Api for this is exactly the same as [useReducer](https://react.dev/reference/react/useReducer) or [Redux](https://redux.js.org/introduction/getting-started). 


```ts
// path=./modules/chat/movex.state.ts

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
```

#### 2. Add the movex.config

This ties in the reducer with a resource and provides the way way Movex can run the code on the server. For more info on this check out the [docs](https://www.movex.dev/docs/how/resources).

```ts
import { reducer as chatReducer } from './modules/chat/movex';

export default {
  url: undefined,
  resources: {
    chat: chatReducer,
  },
};
```

Nothing crazy happens here, except that we let Movex know we have a `resource` called "chat" and we assigned it a reducer. Movex will then run the reducer on the client as well as on the server and by using [Deterministic Action Propagation](https://www.movex.dev/docs/features/server_authoritative#determinstic-action-propagation-method) will seamlessly make the states sync up on all the clients. Ta Daaaa.🥳

#### 3. Hooking everything up



