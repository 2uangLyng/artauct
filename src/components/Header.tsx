"use client";
import { ClerkLoaded, UserButton, useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import SearchForm from "./SearchForm";

function Header() {
  const { user } = useUser();

  const createClerkPassKey = async () => {
    try {
      await user?.createPasskey();
    } catch (err) {
      console.error(">>> Error: ", JSON.stringify(err, null, 2));
    }
  };
  return (
    <header className="flex flex-wrap justify-between items-center py-2 px-4">
      {/* Top row */}
      <div className="flex w-full flex-wrap items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold
                    text-blue-500 hover:opacity-50
                    cursor-pointer mx-0 lg:mx-auto"
        >
          Artauct Store
        </Link>

        <SearchForm />

        <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none">
          <Link
            href="/basket"
            className="flex-1 relative flex justify-center
                          sm:justify-start sm:flex-none items-center space-x-2
                          bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <TrolleyIcon className="w-6 h-6" />
            <span>My Basket</span>
          </Link>
          {/*User area*/}
          <ClerkLoaded>
            {user && (
              <Link
                href="/orders"
                className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2
                                 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                <PackageIcon className="w-6 h-6" />
                <span>My Orders</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-2">
                <UserButton />
                <div className="hidden sm:block text-xs">
                  <p className="text-gray-400">Welcome Back!</p>
                  <p className="font-bold">{user.fullName}!</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal" />
            )}

            {user?.passkeys.length === 0 && (
              <button
                onClick={createClerkPassKey}
                className="bg-white hover:bg-blue-700 hover:text-white
                                     animate-pulse text-blue-500 font-bold py-2 px-4 rounded
                                      border-blue-300 border"
              >
                Create passkey
              </button>
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}
export default Header;
