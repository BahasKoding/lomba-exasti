import Link from "next/link";
import { Package, LayoutDashboard, Settings, Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex h-screen">
        <aside className="hidden w-64 border-r bg-background md:block">
          <div className="flex h-14 items-center border-b px-4 text-lg font-bold">SmartCap Catalog</div>
          <nav className="flex flex-col gap-2 p-4">
            <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <LayoutDashboard className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
            <Link href="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <LayoutDashboard className="h-4 w-4" />
              Upload Massal
            </Link>
            <Link href="/admin/review" className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <Package className="h-4 w-4" />
              Review AI
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <Settings className="h-4 w-4" />
              Pengaturan
            </Link>
            <Link href="/login" className="flex items-center gap-2 rounded-lg px-3 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 mt-4">
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
            <Sheet>
              <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle className="text-left text-lg font-bold">SmartCap Catalog</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 flex flex-col gap-2">
                  <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                    <LayoutDashboard className="h-4 w-4" />
                    Kembali ke Beranda
                  </Link>
                  <Link href="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                    <LayoutDashboard className="h-4 w-4" />
                    Upload Massal
                  </Link>
                  <Link href="/admin/review" className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                    <Package className="h-4 w-4" />
                    Review AI
                  </Link>
                  <Link href="/admin/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                    <Settings className="h-4 w-4" />
                    Pengaturan
                  </Link>
                  <Link href="/login" className="flex items-center gap-2 rounded-lg px-3 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 mt-4">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <span className="text-lg font-bold">SmartCap Catalog</span>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}


