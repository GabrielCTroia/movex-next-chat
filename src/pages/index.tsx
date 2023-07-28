import { useMovexResourceType } from 'movex-react';
import { initialChatState } from '@/modules/chat/reducer';
import { toRidAsStr } from 'movex';
import { ChatOnboarding } from '@/modules/chat/ChatOnboarding';
import { useRouter } from 'next/router';
import movexConfig from '@/movex.config';

export default function () {
  const chatResource = useMovexResourceType(movexConfig, 'chat');
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {chatResource ? (
        <ChatOnboarding
          slots={Object.keys(initialChatState.userSlots)}
          onSubmit={(slot) => {
            chatResource.create(initialChatState).map((item) => {
              router.push({
                pathname: `/chat/${toRidAsStr(item.rid)}`,
                query: { slot },
              });
            });
          }}
        />
      ) : (
        <div>waiting...</div>
      )}
    </main>
  );
}
