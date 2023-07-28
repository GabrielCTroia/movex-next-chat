import { MovexBoundResource } from 'movex-react';
import { Main } from '@/modules/chat/Main';
import { useRouter } from 'next/router';
import { isRidOfType, toRidAsStr } from 'movex';
import { ChatOnboarding } from '@/modules/chat/ChatOnboarding';
import { objectKeys } from 'movex-core-util';
import { UserSlots } from '@/modules/chat/movex';
import movexConfig from '@/movex.config';

export default function Home() {
  const { rid, slot } = useRouter().query;

  if (!isRidOfType('chat', rid)) {
    return null;
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <MovexBoundResource
        movexDefinition={movexConfig}
        rid={rid}
        render={({ boundResource }) => {
          if (slot) {
            return (
              <Main
                userSlot={slot as UserSlots}
                boundChatResource={boundResource}
              />
            );
          }

          // Filter out the taken User Slots
          const availableUserSlots = objectKeys(
            boundResource.state.userSlots
          ).reduce(
            (accum, nextSlot) =>
              boundResource.state.userSlots[nextSlot]
                ? [...accum, nextSlot]
                : accum,
            [] as UserSlots[]
          );

          return (
            <ChatOnboarding
              slots={availableUserSlots}
              onSubmit={(slot) => {
                // Redirect to the same page with the userSlot
                window.location.href = `${
                  window.location.origin
                }/chat/${toRidAsStr(rid)}?slot=${slot}`;
              }}
            />
          );
        }}
      />
    </main>
  );
}
