
import prisma from "../../../server/src/config/db.config";

// Next.js API route
export default async function handler(req, res) {
    if (req.method === 'POST') {
     
      console.log(req.body)
      await createNewMessage(req.body)
  
      // Send a response back to the client
      res.status(201).json({ message: "Message added successfully"});
    } else {
      // Handle any other HTTP method
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  


const createNewMessage=async(msgObj)=>{
    console.log(msgObj + " at backend")
    const {id,msg} = msgObj;
    await prisma.group.update({
        
      where:{
        id:id
      },
      data: {
        messages: {
          push: msg,
        },
      },
      
    })
}

