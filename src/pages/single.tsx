import reducer, { UserSlot, initialChatState } from '@/modules/chat/reducer';
import { ChatBoxContainer } from '@/modules/chat/ChatBoxContainer';
import { useReducer } from 'react';
import { ChatOnboarding } from '@/modules/chat/ChatOnboarding';
import { useRouter } from 'next/router';
import { objectKeys } from 'movex-core-util';

export default function () {
  const router = useRouter();
  const { slot } = router.query;

  const [state, dispatch] = useReducer(reducer, initialChatState);

  if (slot) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-600">
        <ChatBoxContainer
          userSlot={slot as UserSlot}
          state={state}
          dispatch={dispatch}
        />
      </main>
    );
  }

  // Filter out the taken User Slots
  const availableUserSlots = objectKeys(state.userSlots).reduce(
    (accum, nextSlot) =>
      state.userSlots[nextSlot] ? [...accum, nextSlot] : accum,
    [] as UserSlot[]
  );

  return (
    <ChatOnboarding
      slots={availableUserSlots}
      onSubmit={(slot) => {
        // Redirect to the same page with the selected "slot"
        router.push({
          pathname: router.asPath,
          query: { slot },
        });
      }}
    />
  );
}
