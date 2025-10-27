import { MailClient } from "./components/mail-client";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10 font-sans dark:bg-slate-950 sm:px-12">
      <MailClient />
    </main>
  );
}
