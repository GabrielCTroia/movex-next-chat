import { useMovexResourceType } from 'movex-react';
import { initialChatState } from '@/modules/chat/movex';
import movexConfig from '@/movex.config';
import { toRidAsStr } from 'movex';
import { ChatOnboarding } from '@/modules/chat/ChatOnboarding';

export default function Home() {
  const chatResource = useMovexResourceType(movexConfig, 'chat');

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      {chatResource ? (
        <ChatOnboarding
          slots={Object.keys(initialChatState.userSlots)}
          onSubmit={(slot) => {
            chatResource.create(initialChatState).map((item) => {
              // Take me to the chat page
              window.location.href = `${
                window.location.origin
              }/chat/${toRidAsStr(item.rid)}?slot=${slot}`;
            });
          }}
        />
      ) : (
        <div>waiting...</div>
      )}
    </main>
  );
}
