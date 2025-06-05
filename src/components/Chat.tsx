"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { api } from "~/trpc/react";

export function Chat() {
  const { data: session } = useSession();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const utils = api.useUtils();
  const { ref } = useInView();

  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;
    setIsNearBottom(scrollBottom < 100); // Consider "near bottom" if within 100px
  };

  const scrollToBottom = () => {
    if (isNearBottom) {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight - 100,
        behavior: "smooth",
      });
    }
  };

  const {
    data: chatData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.chat.getMessages.useInfiniteQuery(
    {
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: undefined,
    },
  );

  const { mutate: sendMessage } = api.chat.sendMessage.useMutation({
    onSuccess: () => {
      setNewMessage("");
      void utils.chat.getMessages.invalidate();
    },
  });

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData?.pages[0]?.messages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !session) return;

    sendMessage({ message: newMessage.trim() });
  };

  const messages = (chatData?.pages ?? [])
    .flatMap((page) => page.messages)
    .reverse();

  return (
    <div className="flex h-[500px] flex-col">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        {hasNextPage && (
          <div
            ref={ref}
            className="flex justify-center p-2"
            onClick={() => !isFetchingNextPage && fetchNextPage()}
          >
            {isFetchingNextPage ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            ) : (
              <button className="text-sm text-gray-500 hover:text-blue-500">
                Load older messages
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender.name === session?.user?.name
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[70%] items-start space-x-2 rounded-lg p-3 ${
                  msg.sender.name === session?.user?.name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={msg.sender.image ?? "/default-avatar.png"}
                  alt={msg.sender.name ?? "User"}
                  className="h-8 w-8 rounded-full"
                  width={32}
                  height={32}
                />
                <div>
                  <p className="text-sm font-semibold">{msg.sender.name}</p>
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs text-gray-500">
                    {msg.createdAt.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            disabled={!session}
          />
          <button
            type="submit"
            disabled={!session || !newMessage.trim()}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
