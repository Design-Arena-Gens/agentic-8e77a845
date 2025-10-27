"use client";

import { Fragment, useMemo } from "react";
import { EnvelopeIcon, EnvelopeOpenIcon, StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { MailFolder, MailMessage, folders as folderLabels } from "@/app/data/messages";
import { Menu, Transition } from "@headlessui/react";
import { TagBadge } from "./tag-badge";

type MessageListProps = {
  messages: MailMessage[];
  selectedMessageId: string | null;
  onSelectMessage: (id: string) => void;
  onToggleStar: (id: string) => void;
  onToggleRead: (id: string) => void;
  onMoveToFolder: (id: string, target: MailFolder) => void;
};

const actionFolders: MailFolder[] = ["archive", "spam", "trash"];

export function MessageList({
  messages,
  selectedMessageId,
  onSelectMessage,
  onToggleStar,
  onToggleRead,
  onMoveToFolder,
}: MessageListProps) {
  const emptyState = (
    <div className="flex h-full items-center justify-center border-r border-slate-200 bg-slate-50/60 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
      <div className="text-center">
        <EnvelopeOpenIcon className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-700" />
        <p className="mt-3 font-medium">No messages found</p>
        <p className="text-xs">Try another folder or adjust your filters.</p>
      </div>
    </div>
  );

  const groupedByDay = useMemo(() => {
    const groups = new Map<string, { label: string; items: MailMessage[] }>();
    messages.forEach((message) => {
      const date = new Date(message.timestamp);
      const key = date.toISOString().slice(0, 10);
      const label = new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
      if (!groups.has(key)) {
        groups.set(key, { label, items: [] });
      }
      groups.get(key)!.items.push(message);
    });
    return Array.from(groups.entries()).sort(([keyA], [keyB]) => (keyA < keyB ? 1 : -1));
  }, [messages]);

  if (!messages.length) {
    return emptyState;
  }

  return (
    <section className="flex w-[28rem] flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-xs font-medium uppercase tracking-[0.25em] text-slate-400 dark:border-slate-800 dark:text-slate-500">
        <span>Conversations</span>
        <span>{messages.length} total</span>
      </header>
      <div className="flex-1 overflow-y-auto">
        {groupedByDay.map(([key, dayGroup]) => (
          <Fragment key={key}>
            <div className="bg-slate-50/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:bg-slate-900/60 dark:text-slate-500">
              {dayGroup.label}
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {dayGroup.items.map((message) => {
                const isSelected = selectedMessageId === message.id;
                return (
                  <li
                    key={message.id}
                    className={`group relative border-l-4 ${
                      isSelected
                        ? "border-slate-900 bg-slate-900/5 dark:border-slate-200 dark:bg-slate-200/10"
                        : "border-transparent bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectMessage(message.id)}
                      className="flex w-full flex-col gap-2 px-4 py-3 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onToggleStar(message.id);
                            }}
                            className="text-slate-300 hover:text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:text-slate-600"
                          >
                            {message.starred ? (
                              <StarIconSolid className="h-4 w-4 text-amber-400" />
                            ) : (
                              <StarIconOutline className="h-4 w-4" />
                            )}
                          </button>
                          <p className={`text-sm font-semibold ${message.unread ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                            {message.senderName}
                          </p>
                        </div>
                        <p className="text-xs font-medium text-slate-400">{formatFriendlyTime(message.timestamp)}</p>
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${message.unread ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}>
                          {message.subject}
                        </p>
                        <p className="truncate text-xs text-slate-400 dark:text-slate-500">{message.preview}</p>
                      </div>
                      {message.tags.length ? (
                        <div className="flex flex-wrap gap-1">
                          {message.tags.map((tag) => (
                            <TagBadge key={tag} label={tag} />
                          ))}
                        </div>
                      ) : null}
                    </button>
                    <MessageActions
                      message={message}
                      onToggleRead={onToggleRead}
                      onMoveToFolder={onMoveToFolder}
                    />
                  </li>
                );
              })}
            </ul>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

type MessageActionsProps = {
  message: MailMessage;
  onToggleRead: (id: string) => void;
  onMoveToFolder: (id: string, target: MailFolder) => void;
};

function MessageActions({ message, onToggleRead, onMoveToFolder }: MessageActionsProps) {
  return (
    <div className="absolute inset-y-0 right-3 hidden items-center gap-2 group-hover:flex">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggleRead(message.id);
        }}
        className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        title={message.unread ? "Mark as read" : "Mark as unread"}
      >
        {message.unread ? <EnvelopeOpenIcon className="h-4 w-4" /> : <EnvelopeIcon className="h-4 w-4" />}
      </button>
      <Menu as="div" className="relative">
        <Menu.Button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          <EllipsisHorizontalIcon className="h-4 w-4" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 top-full z-10 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 ${active ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}
                  onClick={() => onToggleRead(message.id)}
                >
                  <span>{message.unread ? "Mark read" : "Mark unread"}</span>
                  {message.unread ? <EnvelopeOpenIcon className="h-4 w-4" /> : <EnvelopeIcon className="h-4 w-4" />}
                </button>
              )}
            </Menu.Item>
            {actionFolders.map((folder) => (
              <Menu.Item key={folder}>
                {({ active }) => (
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 ${active ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}
                    onClick={() => onMoveToFolder(message.id, folder)}
                  >
                    <span>Move to {folderLabels[folder]}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

function formatFriendlyTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = Date.now();
  const diff = now - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < hour) {
    const value = Math.round(diff / minute);
    return `${value || 1}m ago`;
  }
  if (diff < day) {
    const value = Math.round(diff / hour);
    return `${value}h ago`;
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}
