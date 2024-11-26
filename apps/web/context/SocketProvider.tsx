'use client'

import React, { useCallback, useContext, useEffect, useState } from "react"
import {io,Socket} from 'socket.io-client'

interface SocketProviderProps{
    children?:React.ReactNode
}

interface ISocketContext{
    sendMessage :(obj: object)=>any;
    messages: object [];
}
const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket=()=>{

    const state = useContext(SocketContext);

    if(!state) throw new Error('State is undefined problem')

    return state;
}

export const SocketProvider : React.FC<SocketProviderProps> = ({children}) =>{
    const [socket,setSocket]= useState<Socket>();

    const [messages,setMessages] = useState<object []>([]);

    const sendMessage : ISocketContext["sendMessage"] = useCallback((obj)=>{
        // console.log("Send Message",obj);
        if(socket){
            console.log("ok")
            socket.emit('event:message',{ message:obj })
        }
        else{
            console.log("not om")
        }
    },[socket]);

    const onMessageRecieved = useCallback((obj: string)=>{
        console.log("From Server msg rec. ",obj);
        // const message =JSON.parse(obj);
        const msg = JSON.parse(obj)
        // messages.push(msg)
        // // console.log(messages);
        // setMessages(messages);
        setMessages((prev) => [...prev , msg]);
    },[])

    useEffect(()=>{ 
        const _socket = io('http://localhost:8000')
        _socket.on('message',onMessageRecieved)
        setSocket(_socket);
        return () =>{
            _socket.disconnect();
            _socket.off('message',onMessageRecieved)
            setSocket(undefined)
        }
    },[messages])

    return(
        <SocketContext.Provider value={{sendMessage,messages}} >
            {children}
        </SocketContext.Provider>
    )
}