import { MovexBoundResource } from 'movex-react';
import { ChatBoxContainer } from '@/modules/chat/ChatBoxContainer';
import { useRouter } from 'next/router';
import { isRidOfType } from 'movex';
import { ChatOnboarding } from '@/modules/chat/ChatOnboarding';
import { objectKeys } from 'movex-core-util';
import { UserSlot } from '@/modules/chat/reducer';
import movexConfig from '@/movex.config';

export default function () {
  const router = useRouter();
  const { rid, slot } = router.query;

  if (!isRidOfType('chat', rid)) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-600">
      <MovexBoundResource
        movexDefinition={movexConfig}
        rid={rid}
        render={({ boundResource: { state, dispatch } }) => {
          if (slot) {
            return (
              <ChatBoxContainer
                userSlot={slot as UserSlot}
                state={state}
                dispatch={dispatch}
              />
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
                // Redirect to the same page with the selected  userSlot
                router.push({
                  pathname: router.asPath,
                  query: { slot },
                });
              }}
            />
          );
        }}
      />
    </main>
  );
}
