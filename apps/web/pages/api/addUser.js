import prisma from "../../../server/src/config/db.config";

// Next.js API route
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { name, email, img } = req.body;
        
      
      await createNewUser(req.body)
  
      // Send a response back to the client
      res.status(201).json({ message: "User added successfully", user: { name, email, img } });
    } else {
      // Handle any other HTTP method
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  


const createNewUser=async(myUser)=>{
    console.log(myUser + " at backend")
    await prisma.user.create({
        data: {
          name: myUser.name,
          email: myUser.email,
          provider : 'Google',
          image: myUser.image,
          oauth_id : 'Google123'
        },
      
    })
}

