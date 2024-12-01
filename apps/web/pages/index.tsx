'use client'
import { useEffect, useState,useRef, lazy } from "react";
import { useSocket } from "../context/SocketProvider"
import styles from "../styles/page.module.css";

import { BrowserRouter, Link, Route ,Routes} from "react-router-dom";
import { useRouter } from "next/router";

import { useSession, signIn, signOut } from 'next-auth/react';

import prisma from "../../server/src/config/db.config";
import Loading from "./loading";


export default function Page({userData}:any) {
  
  const [ user,setUser]= useState('')
  const [ problem,setProblem]= useState(false)
  const [ loading,setLoading]= useState(true)

  

  let dbIssue=false;

  const pRef1= useRef(null);
  const pRef2= useRef(null); 
  
  const session = useSession();
  const router= useRouter()

  const signUP=async(provider:any)=>{
    
    signIn(provider,{callbackUrl:'https://localhost:3000'})
    signIn(provider)
    
    
  }

  

  const createUser=async(myUser:any)=>{

    let userFound=false;
    if(userData=="Problem"){
   
      dbIssue=true;
      setProblem(true);
      return;
     
    }


    if(userData)
    userData.map((ele:any)=>{
      if(ele.email==myUser.email){
        userFound=true;   
      }
 
    })

    if(userFound==false){

  try{
      
const response = await fetch('/api/addUser', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: myUser.name,
    email: myUser.email,
    img: myUser.image,
  }),
});
if (response.ok) {
  const data = await response.json();

} 
    
    }

    catch(err)
    {
     
    }


    }
    
    
   
  }

  

  useEffect(()=>{
    if(session.data)
    {


      createUser(session.data.user);
    
      if(dbIssue==false){

        router.push({ 
          pathname:'/chat',
          query:{
            slug:session.data.user?.email
          },
          
          
  
         })
      }
   
    }
    else{
      setTimeout(() => {
        
        setLoading(false);
      }, 2000);
    }
  })



//   function getdis(lat1 :any, lon1:any, lat2:any, lon2:any,) {
//     var R = 6371; // km
  
//     var dLat = toRad(lat2-lat1);
//     var dLon = toRad(lon2-lon1); 
//     var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//             Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//             Math.sin(dLon/2) * Math.sin(dLon/2);
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     var d = R * c;
//     console.log(d)
//     // return d;
//   }

//   function toRad(Value: number) {
//     /** Converts numeric degrees to radians */
//     return Value * Math.PI / 180;
// }

  

// const getloc=()=>{
//   let spl = user.split(" ");
//   if(spl.length>1){
//     pRef2.current.style.display="block";
//     setTimeout(() => {
//       pRef2.current.style.display="none";
        
//       }, 2500);
//     return;
//   }
//   if(user.length==0){
//     pRef1.current.style.display="block";
//     setTimeout(() => {
//     pRef1.current.style.display="none";
      
//     }, 2500);
//     return;
//   }
//   else{
//     console.log(spl)

//   }
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(success, error);
//   } else {
//     console.log("Geolocation not supported");
//   }
// }

// function success(position: any) {
//   const latitude = position.coords.latitude;
//   const longitude = position.coords.longitude;
//   console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
//   router.push(`/chat/${user}`)
// }

// function error() {
//   console.log("Unable to retrieve your location");
//   alert('Turn on location Permissions !')
// }

if(problem) return <h1 style={{fontFamily:'Montserrat'}}>Error while connecting to DB... Try with different wifi !</h1>

if(loading) return <Loading/>

 return(
  <div  className={styles.landing}>
    <h1>Welcome to the World of GC's</h1>
    <p>Continue to start your first GC</p>
  
    <form onSubmit={(e)=>e.preventDefault()}>

    <button onClick={()=>signUP('google')}><img src='/icons8-google-logo-96.png'/>Continue with Google</button>

    </form>
    
    {/* <button onClick={()=>getloc()}>Check Location</button>
    <input type="range" className={styles.range} min={1} max={21} step={1} />
    <button onClick={()=>getdis(27.69540874579064, 77.69540874579064,45.99640874579064, 79.99640874579064)}>Dis</button> */}


  </div>
 )
  
} 

export async function getServerSideProps(context:any) {
  

  try{
 
    let userData= await prisma.user.findMany();
 
    return {
     props: {userData:JSON.parse(JSON.stringify(userData))}, 
   
    }
  }
  catch(err){
     
     return{
      props: {userData:"Problem"}
     }
  }
  

}

