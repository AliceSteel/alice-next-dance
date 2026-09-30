import Sidebar from "./Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-container flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="page-container-sm">{children}</div>
    </div>
  );
}
