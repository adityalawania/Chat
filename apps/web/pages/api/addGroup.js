
import prisma from "../../../server/src/config/db.config";

// Next.js API route
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { grpName, adminId,privacy } = req.body;
        console.log(grpName,adminId,privacy)
      
      await createNewGroup(req.body)
  
      // Send a response back to the client
      res.status(201).json({ message: "Group created successfully", group: {grpName, adminId,privacy } });
    } else {
      // Handle any other HTTP method
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  


const createNewGroup=async(grpDetails)=>{
    console.log(grpDetails + " at backend")
    const { grpName, adminId,privacy ,password} = grpDetails 
    await prisma.group.create({
        data: {
            name: grpName,
            admin_id: `${adminId}`,
            members: [adminId],
            messages:[],
            private:privacy,
            password:password
        },
      
    })
}

