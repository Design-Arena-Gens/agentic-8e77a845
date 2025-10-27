"use client";

import { Fragment, FormEvent, useMemo, useState } from "react";
import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon, InboxArrowDownIcon } from "@heroicons/react/24/solid";

export type DraftMail = {
  to: string;
  subject: string;
  body: string;
  tags: string[];
  send: boolean;
};

type ComposeDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: DraftMail) => void;
};

export function ComposeDrawer({ open, onClose, onSubmit }: ComposeDrawerProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");

  const tags = useMemo(() => {
    return tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, [tagInput]);

  const resetForm = () => {
    setTo("");
    setSubject("");
    setBody("");
    setTagInput("");
  };

  const submitDraft = (send: boolean) => {
    if (!to && send) {
      return;
    }
    onSubmit({
      to: to || "draft@mailbox.app",
      subject,
      body,
      tags,
      send,
    });
    resetForm();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitDraft(true);
  };

  return (
    <Transition show={open} as={Fragment}>
      <div className="relative z-20">
        <Transition.Child
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
        </Transition.Child>
        <Transition.Child
          enter="transform transition duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition duration-250"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <aside className="fixed right-0 top-0 h-full w-full max-w-xl border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <form className="flex h-full flex-col" onSubmit={handleSubmit}>
              <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Compose message</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Draft your note and send when ready</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    resetForm();
                  }}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </header>
              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">To</label>
                  <input
                    type="email"
                    value={to}
                    required
                    onChange={(event) => setTo(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-800"
                    placeholder="recipient@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-800"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Body</label>
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    className="mt-2 h-48 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-800"
                    placeholder="Compose your message..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Tags</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-800"
                    placeholder="Separate tags with commas"
                  />
                </div>
              </div>
              <footer className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => submitDraft(false)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <InboxArrowDownIcon className="h-4 w-4" />
                  Save draft
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:scale-[0.99] dark:bg-slate-100 dark:text-slate-900"
                >
                  <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
                  Send now
                </button>
              </footer>
            </form>
          </aside>
        </Transition.Child>
      </div>
    </Transition>
  );
}
