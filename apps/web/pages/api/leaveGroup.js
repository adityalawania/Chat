
import prisma from "../../../server/src/config/db.config";

// Next.js API route
export default async function handler(req, res) {
    if (req.method === 'POST') {
     
      console.log(req.body)
      await leaveGroup(req.body)
  
      // Send a response back to the client
      res.status(201).json({ message: "Member added successfully"});
    } else {
      // Handle any other HTTP method
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  


const leaveGroup=async(details)=>{
  
    const {id,memberId} = details;
    let myGroup = await prisma.group.findUnique({
        where:{
            id:id
        }
    })

    await prisma.group.update({
        where:{
            id:id
        },
        data:{
            members:{
                set: myGroup.members.filter((mem)=> mem!=memberId)
            }
        }
    })

    
    
}

