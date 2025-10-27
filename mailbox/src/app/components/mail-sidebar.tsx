"use client";

import { ChangeEvent } from "react";
import { MagnifyingGlassIcon, InboxArrowDownIcon, ArchiveBoxIcon, PaperAirplaneIcon, StarIcon, ExclamationTriangleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { MailFolder, MailMessage } from "@/app/data/messages";

type MailSidebarProps = {
  folders: Record<MailFolder, string>;
  folderCounts: Record<MailFolder, number>;
  selectedFolder: MailFolder;
  selectedMessage: MailMessage | null;
  searchTerm: string;
  onSearch: (value: string) => void;
  onSelectFolder: (folder: MailFolder) => void;
  onCompose: () => void;
};

export function MailSidebar({
  folders,
  folderCounts,
  selectedFolder,
  selectedMessage,
  searchTerm,
  onSearch,
  onSelectFolder,
  onCompose,
}: MailSidebarProps) {
  const items = [
    { folder: "inbox" as MailFolder, icon: InboxArrowDownIcon },
    { folder: "starred" as MailFolder, icon: StarIcon },
    { folder: "sent" as MailFolder, icon: PaperAirplaneIcon },
    { folder: "drafts" as MailFolder, icon: PencilSquareIcon },
    { folder: "archive" as MailFolder, icon: ArchiveBoxIcon },
    { folder: "spam" as MailFolder, icon: ExclamationTriangleIcon },
    { folder: "trash" as MailFolder, icon: TrashIcon },
  ];

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <aside className="flex w-72 flex-col border-r border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={onCompose}
        className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow hover:bg-slate-800 active:scale-[0.99]"
      >
        <PencilSquareIcon className="h-5 w-5" />
        Compose
      </button>
      <div className="relative mb-6">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchInput}
          placeholder="Search mail"
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
        />
        <MagnifyingGlassIcon className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
      </div>
      <nav className="space-y-1">
        {items.map(({ folder, icon: Icon }) => {
          const active = selectedFolder === folder;
          return (
            <button
              key={folder}
              type="button"
              onClick={() => onSelectFolder(folder)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {folders[folder]}
              </span>
              <span className={`rounded-full px-2 text-xs ${active ? "bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                {folderCounts[folder] ?? 0}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="mt-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Now showing</p>
        <p className="mt-2 text-sm font-semibold leading-tight">{selectedMessage?.subject ?? "Pick a message"}</p>
        <p className="mt-1 truncate text-xs text-slate-300">{selectedMessage?.senderName ?? "Select an email to view details"}</p>
      </div>
    </aside>
  );
}
