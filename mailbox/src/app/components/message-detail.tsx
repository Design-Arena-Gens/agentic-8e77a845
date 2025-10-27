"use client";

import { format } from "date-fns";
import { ArrowUturnLeftIcon, ArrowUpTrayIcon, EllipsisHorizontalIcon, PaperAirplaneIcon, StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { MailFolder, MailMessage, folders as folderLabels } from "@/app/data/messages";
import { TagBadge } from "./tag-badge";

type MessageDetailProps = {
  message: MailMessage | null;
  onToggleStar: (id: string) => void;
  onToggleRead: (id: string) => void;
  onMoveToFolder: (id: string, target: MailFolder) => void;
};

export function MessageDetail({ message, onToggleStar, onToggleRead, onMoveToFolder }: MessageDetailProps) {
  if (!message) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-white text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        <PaperAirplaneIcon className="h-12 w-12 -rotate-45 text-slate-200 dark:text-slate-700" />
        <p className="mt-4 font-medium">Select a message to read</p>
        <p className="text-xs">Your conversations appear here.</p>
      </div>
    );
  }

  const formattedDate = format(new Date(message.timestamp), "MMMM d, yyyy 'at' h:mm a");

  return (
    <article className="flex flex-1 flex-col bg-white dark:bg-slate-950">
      <header className="border-b border-slate-200 px-8 py-6 dark:border-slate-800">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onToggleStar(message.id)}
                className="rounded-full bg-slate-100 p-2 text-slate-400 hover:text-amber-400 dark:bg-slate-900 dark:text-slate-500 dark:hover:text-amber-300"
                title={message.starred ? "Remove star" : "Add star"}
              >
                {message.starred ? (
                  <StarIconSolid className="h-4 w-4 text-amber-400" />
                ) : (
                  <StarIconOutline className="h-4 w-4" />
                )}
              </button>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{message.subject}</h1>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">{message.senderName}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{message.senderEmail}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">→</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{message.recipientEmail}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs font-medium">{formattedDate}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {folderLabels[message.folder]}
              </span>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleRead(message.id)}
              className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {message.unread ? "Mark as read" : "Mark as unread"}
            </button>
            <button
              type="button"
              onClick={() => onMoveToFolder(message.id, "archive")}
              className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Archive
            </button>
            <button
              type="button"
              className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <EllipsisHorizontalIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        {message.tags.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {message.tags.map((tag) => (
              <TagBadge key={tag} label={tag} />
            ))}
          </div>
        ) : null}
      </header>
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          {message.body.split("\n").map((paragraph, index) => (
            <p key={`${message.id}-p-${index}`} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
        {message.attachments?.length ? (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Attachments</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {message.attachments.map((attachment) => (
                <li
                  key={attachment.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  <span className="flex-1 truncate">{attachment.name}</span>
                  <span className="ml-3 text-xs text-slate-400">{attachment.size}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
      <footer className="border-t border-slate-200 px-8 py-4 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 active:scale-[0.99] dark:bg-slate-100 dark:text-slate-900">
            <ArrowUturnLeftIcon className="h-4 w-4" />
            Reply
          </button>
          <button className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            <PaperAirplaneIcon className="h-4 w-4" />
            Forward
          </button>
          <button className="ml-auto flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
            <ArrowUpTrayIcon className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </footer>
    </article>
  );
}
