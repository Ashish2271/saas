import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";

const handler = NextAuth(authOptions);
console.log(handler)

export { handler as GET, handler as POST };

// export { GET, POST } from "../../../../lib/auth";;