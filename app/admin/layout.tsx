import Link from "next/link";
import { Package, LayoutDashboard, Settings, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-background hidden md:block">
          <div className="flex h-14 items-center border-b px-4 font-bold text-lg">
            SmartCap Catalog
          </div>
          <nav className="flex flex-col gap-2 p-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Upload Massal
            </Link>
            <Link
              href="/admin/review"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Package className="h-4 w-4" />
              Review AI
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="h-4 w-4" />
              Pengaturan
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Mobile Header */}
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
            <Sheet>
              <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle className="text-left font-bold text-lg">SmartCap Catalog</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-4">
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Upload Massal
                  </Link>
                  <Link
                    href="/admin/review"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Package className="h-4 w-4" />
                    Review AI
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    Pengaturan
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <span className="font-bold text-lg">SmartCap Catalog</span>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
