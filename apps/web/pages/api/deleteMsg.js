
import { console } from "inspector";
import prisma from "../../../server/src/config/db.config";

// Next.js API route
export default async function handler(req, res) {
    if (req.method === 'POST') {
     
      console.log(req.body)
      await leaveGroup(req.body)
  
      // Send a response back to the client
      res.status(201).json({ message: "Message deleted successfully"});
    } else {
      // Handle any other HTTP method
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  


const leaveGroup=async(details)=>{
  
    const {id,msgIdx} = details;
    console.log(details)
    let myGroup = await prisma.group.findUnique({
        where:{
            id:id
        }
    })

    console.log("from backend "+myGroup)

    await prisma.group.update({
        where:{
            id:id
        },
        data:{
            messages:{
                set: myGroup.messages.filter((msg,idx)=> idx!=msgIdx)
            }
        }
    })

    
    
}

