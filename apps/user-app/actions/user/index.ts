// import prisma from "@repo/db/client";




// export const getUser = async () => {
//     // const session = await getServerSession(authOptions); // Get session
  
//     // if (!session || !session.user) {
//     //   return { error: "Unauthorized or insufficient permissions" };
//     // }
  
//     try {
//       const posts = await prisma.user.findUnique({
//          where : {
//             id : UserId;
//          }
      
//       });
  
//       return { data: posts };
//     } catch (error: any) {
//       return { error: error.message || "Failed to retrieve posts." };
//     }
//   };
  