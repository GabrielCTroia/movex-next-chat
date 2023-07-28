import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChatMsg, UserSlot } from './reducer';
import { useRouter } from 'next/router';

type Props = {
  userSlot: UserSlot;
  messages: ChatMsg[];
  onSubmit: (msg: ChatMsg) => void;
};

export const ChatBox: React.FC<Props> = ({ userSlot, messages, onSubmit }) => {
  const router = useRouter();
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
    <div className="flex text-slate-900">
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
            height: '60px',
          }}
        />
        <div className="flex justify-between">
          <button
            className="bg-green-300 hover:bg-green-500 text-black font-bold py-2 px-4 rounded-lg"
            onClick={() => {
              const pathWithoutQuery = router.asPath.slice(
                0,
                router.asPath.indexOf('?')
              );

              navigator.clipboard.writeText(
                window.location.origin + pathWithoutQuery
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
