import { AppHeader } from "@/_components/app-header";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="flex-1">{children}</main>
    </>
  );
}
