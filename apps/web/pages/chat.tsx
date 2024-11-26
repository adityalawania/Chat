'use client'

import { useEffect, useRef, useState } from "react";
import styles from "../styles/page.module.css";

import { useSocket } from "../context/SocketProvider";
import { useSession ,getSession } from "next-auth/react";
import Navbar from "./chatNav";
import prisma from "../../server/src/config/db.config";
import Loading from "./loading";
import Router from "next/router";

// import { useRouter, useSearchParams } from "next/navigation";



export default function Chat({ grpData, userData }:any)
{

  const [uname, setUname] = useState('');
  const [activeGrp, setActiveGrp] = useState({name:'',messages:[{
    "grp": null,
    "name": "",
    "time": "",
    "email": "",
    "message": ""
  }],
admin_id:null,
password:null,
private:false,
members:[null]}
);
  const [activeGrpIdx, setActiveGrpIdx] = useState(0);
  const [currGrpId, setCurrGrpId] = useState(0);
  const [myDetails,setMyDetails] = useState({email:'',name:''});
  const [myId,setMyId] = useState()


  const [groupData, setGroupData] = useState([]);
  const [myGroups, setMyGroups] = useState([]);


  const [problem, setProblem] = useState(false)
  const [loading, setLoading] = useState(true)


  const {data : session} = useSession();

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const grpBoxRef = useRef<HTMLDivElement | null>(null);




  const [active, setActive] = useState(false);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      let str = window.location.pathname.slice(6,);   // fetching name from url
      let capitalized = str.charAt(0).toUpperCase() + str.slice(1);
      setUname(capitalized);
    }

    let sessionDetails= session?.user;
    let user ={
              email:  sessionDetails?.email ? sessionDetails?.email : '' ,
              name:  sessionDetails?.name ? sessionDetails?.name : ''
            };
    
    setMyDetails(user);
    // console.log(myEmail)
    setTimeout(() => {
      setLoading(false); 
      getSessionDetails(user?.email);
    }, 2000);

   




  }, []); // No dependency on router.asPath

  const getSessionDetails=(myEmail:any)=>{
  
    userData.map((u:any)=>{
      if(u.email==myEmail){
        setMyId(u.id)
        addMyGroups(u.id);
        return;
      }
    
    })
  }

  const addMyGroups = (idd:string) =>{
     if (grpData == 'Problem') {
      setProblem(true);
    }
    else {
      setGroupData(grpData);
      let mygrps = grpData.filter((el:any)=>{
        let memFlag = false;
        el.members.map((mem:any)=>{
          if(mem==idd){
            memFlag=true;
            return;
          }
        })

        if(memFlag) return true;
      }) 

      setMyGroups(mygrps)
    }
  }


  const { sendMessage, messages } = useSocket();

  const [msg, setMsg] = useState('');
  let messag = {
    message: "",
    name: "",
  }


  const [data, setData] = useState([messag]);

  const sendIt = async() => 
{
    const d = new Date();
    let hrs:any = d.getHours();
    let mins:any = d.getMinutes();

    if(hrs==0){
      hrs='00';
    }

    if(mins>=0 && mins<=9){
      mins='0'+mins;
    }
    let obj = {
      message: msg,
      email: myDetails?.email,
      name:myDetails?.name,
      time: hrs + ":" + mins,
      grp:currGrpId
    }


    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });


    setMsg('')
    // console.log(activeGrp.name)
    // console.log(obj.time)
    try {
      sendMessage(obj);
      console.log("sending data...");
      const response = await fetch('/api/addMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currGrpId,
          msg: obj

        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Group create:", data);
      } else {
        console.error("Failed to create group:", response.statusText);
      }

    }



    catch (err) {
      console.log("errr hai nbhao9")
    }
}




const grpChanged = (i:any, grp:any) => {
  grpBoxRef.current?.children[activeGrpIdx]?.classList.remove('page-module__g8GY5a__activeGrp')
  grpBoxRef.current?.children[i]?.classList.add('page-module__g8GY5a__activeGrp')


  setActiveGrpIdx(i);
  setActiveGrp(grp)
  setCurrGrpId(grp.id);

  // console.log(activeGrp)
  console.log("exiitnig")
  
}


if (problem) return <h1 style={{ fontFamily: 'Montserrat' }}>Error while connecting to DB... Try with different wifi !</h1>

if(loading) return <Loading/>
return (
  <div>

    <Navbar data={userData} />
    <ul className={styles.grpNav}>
      <li className={active ? styles.active : ''} onClick={() => setActive(true)}>My Groups</li>
      <li className={!active ? styles.active : ''} onClick={() => setActive(false)}>All Groups</li>
    </ul>

    {!active ?
    
    <div className={styles.grpBoxCont} ref={grpBoxRef}>
      {grpData.map((grp:any, idx:any) => {
        return (
          <div className={styles.grpBox} key={idx} onClick={() => grpChanged(idx, grp)}>

            <p>{grp.name}</p>
            <div>

              <span>Rahul,</span>
              <span>Devesh,</span>
              <span>Shikha</span>
            </div>

          </div>
        )
      })}


    </div>
    
     :

     <div className={styles.grpBoxCont} ref={grpBoxRef}>
     {myGroups.map((grp:any, idx:any) => {
       return (
         <div className={styles.grpBox} onClick={() => grpChanged(idx, grp)} key={idx}>

           <p>{grp.name} {grp.admin_id==myId ?"(Admin)" :""}</p>

           <div>

             <span>Rahul,</span>
             <span>Devesh,</span>
             <span>Shikha</span>
           </div>

         </div>
       )
     })}


   </div>

  }



    {activeGrp.name=='' ? "" :
      <div className={styles.chatBox}>
        <article className={styles.msgBoxHead}>
          <h3>{activeGrp.name}</h3>

          <div>
            <span>Aditya,</span>
            <span>Rahul,</span>
            <span>Devesh,</span>
            <span>Shikha</span>
            <span>...and 50 more</span>
          </div>

          <button className={styles.btn}>Leave</button>

        </article>
        <div className={styles.msgBox}>
          {activeGrp.messages.map((el,id)=>{
           
              if (el.email == myDetails.email) {
                return (
                  <div key={id}>
                    <div className={styles.Outmsg} key={id}>
                      <span>{el.message}</span>
                      <span>{el.time}</span>
                    </div>
  
                  </div>
                )
              }
              else {
               let nameId = el.name.charAt(0).toUpperCase() + el.name.slice(1,);
              
                return (
                  <div key={id}>
                    <div className={styles.Inmsg} key={id}>
                      <span>{el.message}</span>
                      <span>{el.time}</span>
                    </div>
               
                    <p className={styles.Inid}>~{nameId.split(' ')[0]}</p>
  
                  </div>
                )
              }
            
         
          })}
        
         {messages.map((el:any, id) => {
         
          if(el!=undefined){
            if(el.grp != currGrpId) return;

            if (el.email == myDetails.email) {
              return (
                <div key={id}>
                  <div className={styles.Outmsg} key={id}>
                    <span>{el.message}</span>
                    <span>{el.time}</span>
                  </div>

                </div>
              )
            }
            else {
              return (
                <div key={id}>
                  <div className={styles.Inmsg} key={id}>
                    <span>{el.message}</span>
                    <span>{el.time}</span>
                  </div>
               
                  <p className={styles.Inid}>~{el.name}</p>

                </div>
              )
            }
          }


          })
        }
          <div ref={messageEndRef} className={styles.messageEnd} />
        </div>
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              onChange={(e) => setMsg(e.target.value)}
              className={styles.inp}
              placeholder="Please Enter"
              value={msg} />

            <button
              onClick={sendIt}
              className={styles.btn}>Send</button>
          </form>
        </div>
        <div>

        </div>
      </div>
    }
  </div>
 )
}

export async function getServerSideProps(context:any) {

  try {
    console.log("ok");
    let userData = await prisma.user.findMany();

    let grpData = await prisma.group.findMany();
    console.log("no problem")
    return {
      props: { grpData: JSON.parse(JSON.stringify(grpData)), userData: JSON.parse(JSON.stringify(userData)),session:await getSession(context) }, // will be passed to the page component as props

    }
  }
  catch (err) {
    console.log("nok")

    return {
      props: { grpData: "Problem" }
    }
  }


}