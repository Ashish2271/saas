// components/Navbar.js
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Button from "@mui/material/Button";

export default function Navbar() {
//   const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
      <Link href="/" passHref>
        <div className="text-xl font-bold">EsportsHub</div>
      </Link>
      <div>
        {true ? (
          <Button variant="contained" color="primary" >
            Account
          </Button>
        ) : (
          <Button variant="contained" color="primary" >
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
}
