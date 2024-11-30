
import prisma from "../../../server/src/config/db.config";

// Next.js API route
export default async function handler(req, res) {
    if (req.method === 'POST') {
 
      await delGrp(req.body.gId)
  
      // Send a response back to the client
      res.status(201).json({ message: "Message added successfully"});
    } else {
      // Handle any other HTTP method
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  


const delGrp=async(grpId)=>{

    
    await prisma.group.delete({
        
      where:{
        id:grpId
      }
    })
}

