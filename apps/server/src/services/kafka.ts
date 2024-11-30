import { PrismaClient } from '@prisma/client';
import { unsubscribe } from 'diagnostics_channel';
import {Kafka,Producer} from 'kafkajs'
import prisma from '../config/db.config';

// these credentials are only for 15 days after which i wouldn't be able to use cloud kafka services !!
const kafka = new Kafka({
    brokers:['ct4jcj91fcl81c9uvpeg.any.eu-central-1.mpx.prd.cloud.redpanda.com:9092'],
    ssl:true,
    sasl: {
        mechanism:'scram-sha-512',
        username:'adityalawania_redpanda_kafka_899',
        password:'nmUBLwwU0yyeeok9z7DYpI4h8UDwd8'
      } 
});

let producer : null | Producer = null;

export async function createProducer() {
    if(producer) return producer;

    const local_producer = kafka.producer();
    await local_producer.connect(); 
    producer = local_producer;
    return producer;
}

export async function produceMessage(message:string) {

    const producer = await createProducer();
    await producer.send({
        messages:[{key:`message-${Date.now()}`,value:message}],
        topic:"MESSAGES"
    });
    return true;
    
}

export async function startConsumer() {
    const consumer = kafka.consumer({groupId: "default"})
    await consumer.connect();
    await consumer.subscribe({topic:"MESSAGES",fromBeginning:true})

    await consumer.run({
        autoCommit:true,
        eachMessage:async({message,pause})=>{
            console.log("New Message recieved at kafka ...")
            let jsonString = message.value?.toString('utf-8');
           
            
            let inpObj =jsonString ? JSON.parse(jsonString) : {};

            console.log(inpObj)
       
            
            try{
                await prisma.group.update({
        
                    where:{
                      id:inpObj.id
                    },
                    data: {
                      messages: {
                        push: inpObj.msgobj
                      },
                    },
                    
                  })
            }

            catch(err){
                console.log("error "+err)
            }
        }
    })
    
}

export default kafka;