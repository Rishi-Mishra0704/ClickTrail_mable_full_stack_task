import { Link, useNavigate } from "@remix-run/react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge"; // ✅ shadcn badge
import { FC, ReactNode } from "react";
import { PAGE_ROUTES } from "@/lib/constants";
import { FaCartPlus } from "react-icons/fa";
import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { MdLogout } from "react-icons/md";

type PageLayoutProps = {
  children: ReactNode;
};

const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  const totalItems = useCartStore((state) => state.getTotalCount());
  const logout = useUserStore((store) => store.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate(PAGE_ROUTES.auth.login);
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 lg:px-4 py-3 w-full">
          <Link
            to={PAGE_ROUTES.base}
            className="text-xl font-bold tracking-tight"
          >
            ClickTrail
          </Link>

          <nav className="flex items-center justify-between gap-8">
            <Link
              to={PAGE_ROUTES.cart.base}
              className="relative text-lg font-medium hover:text-blue-600 flex items-center gap-2"
            >
              <FaCartPlus size={24} />
              <Badge
                className="absolute -top-2 -right-4 text-[10px] h-4 w-4 rounded-full p-0 flex items-center justify-center"
                variant="destructive"
              >
                {totalItems}
              </Badge>
            </Link>
            <button onClick={() => handleLogout()} className="mx-2">
              <MdLogout size={24} />
            </button>
          </nav>
        </div>
        <Separator />
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

      <footer className="bg-white border-t mt-10">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MyStore. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
