'use client'

import { useEffect, useRef, useState } from "react"
import styles from "../styles/page.module.css";

import { useSocket } from "../context/SocketProvider";
import { useSession, getSession } from "next-auth/react";
import Navbar from "./chatNav";
import prisma from "../../server/src/config/db.config";
import Loading from "./loading";
import Router from "next/router";
import { toast, ToastContainer } from "react-toastify";


export default function Chat({ grpData, userData }: any) {


const emojis = [
    // Smileys
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', 
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    
    // Animals
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', 
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦉',
    
    // Food
    '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', 
    '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥕', '🌽', '🥔', '🥒',
    
    // Activities
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓', 
    '🏸', '🥊', '🥋', '⛳', '🎣', '🧗', '🏇', '⛷️', '🏂', '🏄',
    
    // Travel
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', 
    '🚜', '✈️', '🚀', '🛸', '🚢', '🛳️', '⛴️', '🚤', '🛥️', '⛵',
    
    // Miscellaneous
    '💡', '🔑', '📱', '💻', '🖥️', '🖨️', '📷', '📺', '🔋', '🔌', 
    '📖', '✏️', '🎵', '🎧', '🎷', '🎸', '🎹', '🥁', '🎮', '🧸'
];

  const [activeGrp, setActiveGrp] = useState({
    name: '', messages: [{
      "grp": null,
      "name": "",
      "time": "",
      "email": "",
      "message": ""
    }],
    admin_id: null,
    password: null,
    private: false,
    members: [null]
  }
  );
  const [activeGrpIdx, setActiveGrpIdx] = useState(0);
  const [currGrpId, setCurrGrpId] = useState(0);

  const [currGrpAdmin, setCurrGrpAdmin] = useState(false);
  const [currGrpMember, setCurrGrpMember] = useState(false);

  const [toggleEmoji, setEmojiCont] = useState(false);



  const [infoMsg,setInfoMsg] = useState('')

  const [myDetails, setMyDetails] = useState({ email: '', name: '' });
  const [myId, setMyId] = useState()


  const [lastGrp, setLastGrp] = useState('')
  const [lastGrpIdx, setLastGrpIdx] = useState()

  const [grpPasword, setGrpPassword] = useState('')


  const [groupData, setGroupData] = useState([]);
  const [myGroups, setMyGroups] = useState([]);


  const [problem, setProblem] = useState(false)
  const [loading, setLoading] = useState(true);

  const [render, setRender] = useState(false);


  const { data: session } = useSession();

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const grpBoxRef = useRef<HTMLDivElement | null>(null);
  const emojiRef = useRef<HTMLDivElement | null>(null);

  const chatboxRef = useRef<HTMLDivElement | null>(null);
  const JoinGrpRef = useRef<HTMLDivElement | null>(null);
  const InfoGrpRef = useRef<HTMLDivElement | null>(null);

  const [active, setActive] = useState(false);

  useEffect(() => {
    
    let sessionDetails = session?.user;
    let user = {
      email: sessionDetails?.email ? sessionDetails?.email : '',
      name: sessionDetails?.name ? sessionDetails?.name : ''
    };

    setMyDetails(user);
    setTimeout(() => {
      setLoading(false);
      getSessionDetails(user?.email);
    }, 2000);






  }, []); // No dependency on router.asPath

  const getSessionDetails = (myEmail: any) => {

    userData.map((u: any) => {
      if (u.email == myEmail) {
        setMyId(u.id)
        addMyGroups(u.id);
        return;
      }

    })
  }

  const addMyGroups = (idd: string) => {
    if (grpData == 'Problem') {
      setProblem(true);
    }
    else {
      setGroupData(grpData);
      let mygrps = grpData.filter((el: any) => {
        let memFlag = false;
        el.members.map((mem: any) => {
          if (mem == idd) {
            memFlag = true;
            return;
          }
        })

        if (memFlag) return true;
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

  const sendIt = async () => {
    const d = new Date();
    let hrs: any = d.getHours();
    let mins: any = d.getMinutes();

    if (hrs == 0) {
      hrs = '00';
    }

    if (mins >= 0 && mins <= 9) {
      mins = '0' + mins;
    }

    // This obj will continues after kafka server will get ended !
    // let obj = {
    //   message: msg,
    //   email: myDetails?.email,
    //   name: myDetails?.name,
    //   time: hrs + ":" + mins,
    //   grp: currGrpId
    // }

    let newObj = {
      id:currGrpId,
      msgobj:{
      message: msg,
      email: myDetails?.email,
      name: myDetails?.name,
      time: hrs + ":" + mins,
      grp: currGrpId
      }
    }


    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

    
    setMsg('')
    
    try {
      // sendMessage(obj)
      
      sendMessage(newObj);

      // This post request will continues after kafka server will get ended :
      // console.log("sending data...");
      // const response = await fetch('/api/addMessage', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     id: currGrpId,
      //     msg: obj

      //   }),
      // });
      // if (response.ok) {
      //   const data = await response.json();
      //   console.log("Group create:", data);
      // } else {
      //   console.error("Failed to create group:", response.statusText);
      // }

    }



    catch (err) {
      console.log("errr hai nbhao9")
    }
  }

  useEffect(() => {
    if (chatboxRef.current) {
   
      chatboxRef.current.scrollTop = chatboxRef.current?.scrollHeight - 600;
    }


  }, [render])




  const grpChanged = (i: any, grp: any, count: number) => {
    let you_are_member = false;
    let you_are_admin = false;

    if (grp.admin_id == myId) {
      you_are_admin=true;
      you_are_member = true;
    }

    else {
      grp.members.map((mem: number) => {
        if (mem == myId) {
          you_are_member = true;
          return;
        }
      })
    }

    if (grp.private && count == 0 && !you_are_member) {
      JoinGrpRef?.current?.classList.add('page-module__g8GY5a__show');
      setLastGrp(grp);
      setLastGrpIdx(i);
      return;
    }

    if(you_are_admin){
      setCurrGrpAdmin(true);
    }
    else{
      setCurrGrpAdmin(false);
      
    }
    if(you_are_member){
      setCurrGrpMember(true);
    }

    JoinGrpRef?.current?.classList.remove('page-module__g8GY5a__show');
    setRender(!render)

    grpBoxRef.current?.children[activeGrpIdx]?.classList.remove('page-module__g8GY5a__activeGrp')
    grpBoxRef.current?.children[i]?.classList.add('page-module__g8GY5a__activeGrp')

    setActiveGrpIdx(i);
    setActiveGrp(grp)
    setCurrGrpId(grp.id);

  }

  const joinGroup = async (grp: any) => {

    let flag = false;
    grpData.map((el: any) => {
      if (el.id == grp.id) {
        if (el.password == grpPasword) {
          flag = true;

        }
        else {
          flag = false;
        }
        return;
      }
    })

    
    
  

    setGrpPassword('')
    if (!flag) {

      toast.error("Invalid Credentials", { autoClose: 1600 });

    }
    else {
      
      try {
        console.log("sending data...");
        const response = await fetch('/api/addMember', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gId: Number(grp.id),
            memberId: myId,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Group Joined:", data);
        } else {
          console.error("Failed to add member:", response);
        }

      }

      catch (err) {
        console.log("errr hai nbhao9")
      }

      toast.success("Group Joined", { autoClose: 1600 })
      grpChanged(lastGrpIdx, lastGrp, 1);
      Router.reload()
    }

  }

  const deleteGrp = async(is:number) => {

    if(is==2){
      setInfoMsg('Do you really want to delete ' + activeGrp.name + " ?");
      if(InfoGrpRef.current){
        InfoGrpRef.current.classList.add('page-module__g8GY5a__show');
      }

    }

    else if(is==1){

      try {
        
        const response = await fetch('/api/deleteGroup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gId: Number(currGrpId),
            
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Group deleted:", data);
        } else {
          console.error("Failed to delete group:", response);
        }
        Router.reload();

      }

      catch (err) {
        console.log("errr hai nbhao9")
      }

     
    }

    else{
    toast.error('Deletion Aborted !')
    }

  }

  const leaveGrp = async() => {
    try {
      console.log("sending data...");
      const response = await fetch('/api/leaveGroup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              id: Number(currGrpId),
              memberId: myId,
          }),
      });
      if (response.ok) {
          const data = await response.json();
          console.log("Group Leaved:", data);
          toast.success("Group Leaved Successfully !",{
            autoClose:1600
          })
      } else {
          console.error("Failed to leave group:", response);
          toast.error("Failed to leave group !",{
            autoClose:1600
          })
      }

      Router.reload()

      

  }

  catch (err) {
      console.log("errr hai nbhao9")
  }
  }

  const openEmojis=()=>{
    if(toggleEmoji){
      emojiRef?.current?.classList.remove('page-module__g8GY5a__show');
    }
    else{
      emojiRef?.current?.classList.add('page-module__g8GY5a__show');

    }

    setEmojiCont(!toggleEmoji)
  }
  
  const toggleDelete=async(i:number,j:number)=>{
    if(j==1){
      messages.splice(i,1);
      i=i+activeGrp.messages.length;
    }
    else{
      activeGrp.messages.splice(i,1);
    }

    console.log(i)
      try {
        console.log("sending data...");
        const response = await fetch('/api/deleteMsg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: Number(currGrpId),
                msgIdx: i,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            // console.log("Group Leaved:", data);
           
        } else {
            // console.error("Failed to leave group:", response);
           
        }
    }
    catch(err){}
  
  setRender(!render)
  
 }

  if (problem) return <h1 style={{ fontFamily: 'Montserrat' }}>Error while connecting to DB... Try with different wifi !</h1>

  if (loading) return <Loading />
  
  return (
    <div className={styles.chatPageMain}>
      <ToastContainer limit={1}/>
      <Navbar grpData={grpData} userData={userData} />
      <ul className={styles.grpNav}>
        <li className={active ? styles.active : ''} onClick={() => setActive(true)}>My Groups</li>
        <li className={!active ? styles.active : ''} onClick={() => setActive(false)}>All Groups</li>
      </ul>
   
      {!active ?

        <div className={styles.grpBoxCont} ref={grpBoxRef}>
          {grpData.map((grp: any, idx: any) => {
            return (
              <div className={styles.grpBox} key={idx} onClick={() => grpChanged(idx, grp, 0)}>

                <p>{grp.name}</p>
                <div>
                  <span>Rahul,</span>
                  <span>Devesh,</span>
                  <span>Shikha</span>
                </div>
                {grp.private ? <img src="/lock.png" /> : ""}
              </div>
            )
          })}


        </div>

        :

        <div className={styles.grpBoxCont} ref={grpBoxRef}>
          {myGroups.map((grp: any, idx: any) => {
            return (
              <div className={styles.grpBox} onClick={() => grpChanged(idx, grp, 0)} key={idx}>

                <p>{grp.name} {grp.admin_id == myId ? <p>(Admin) &nbsp; [ Id &nbsp;:&nbsp;{grp.id}, Pass &nbsp;:&nbsp;{grp.password} ] </p>  : ""} </p>
           

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

      <div className={styles.modalCont} ref={JoinGrpRef}>
        <div className={styles.modal}>
          <img src='/cross.png' onClick={()=>JoinGrpRef?.current?.classList.remove('page-module__g8GY5a__show')}/>
          <h2>Join Group</h2>

          <input type="number" placeholder='Enter Group Password' value={grpPasword} onKeyDown={(event)=>event.key === 'Enter' ? joinGroup(lastGrp) :""} onChange={(e) =>setGrpPassword(e.target.value)} />
          <button onClick={() => joinGroup(lastGrp)}>
                 

            <span>Join</span>
          </button>
        </div>
      </div>

      <div className={styles.modalCont} ref={InfoGrpRef}>
        <div className={styles.modal}>
        <img src='/cross.png' onClick={()=>InfoGrpRef?.current?.classList.remove('page-module__g8GY5a__show')}/>
          <h2>{infoMsg}</h2>

          <button onClick={() => deleteGrp(1)}>
            <span>Yes</span>
          </button>

   
        </div>
      </div>



      {activeGrp.name == '' ? "" :
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
            {
              currGrpAdmin ? <button className={styles.btn} onClick={()=>deleteGrp(2)}>Delete</button> : currGrpMember ? <button className={styles.btn} onClick={leaveGrp}>Leave</button> : ""
            }


          </article>

          <div className={styles.msgBox} ref={chatboxRef}>
            {activeGrp.messages.map((el, id) => {

              if (el.email == myDetails.email) {
                return (
                  <div key={id}>
                    <div className={styles.Outmsg} key={id}>
                     
                    <img onClick={()=>toggleDelete(id,0)} src="delete.png"/>
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

            {messages.map((element: any, id) => {
              
              if (element.msgobj != undefined) {
               
                if (element.msgobj.grp != currGrpId) return;

                if (element.msgobj.email == myDetails.email) {
                  return (
                    <div key={id}>
                      
                      <div className={styles.Outmsg} key={id}>
                   
                      <img onClick={()=>toggleDelete(id,1)} src="delete.png"/>
                        <span>{element.msgobj.message}</span>
                        <span>{element.msgobj.time}</span>
                      </div>

                    </div>
                  )
                }
                else {
                  return (
                    <div key={id}>
                      <div className={styles.Inmsg} key={id}>
                        <span>{element.msgobj.message}</span>
                        <span>{element.msgobj.time}</span>
                      </div>

                      <p className={styles.Inid}>~{element.msgobj.name}</p>

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
              <div className={styles.emojiCont} ref={emojiRef}>
                {emojis.map((em)=>{
                  return(
                    <span onClick={()=>setMsg((prev)=>prev + em)}>{em}</span>
                  )
                })}
              </div>
              <img className={styles.emoji} onClick={()=>openEmojis()} src="happiness.png"/>
              <input
                onChange={(e) => setMsg(e.target.value)}
                className={styles.inp}
                placeholder="Please Enter Your Message ..."
                value={msg} /> 

              <button
                onClick={sendIt}
                className={styles.btn}>Send
                </button>
            </form>
          </div>
          <div>

          </div>
        </div>
      }
    </div>
  )
}

export async function getServerSideProps(context: any) {

  try {

    let userData = await prisma.user.findMany();

    let grpData = await prisma.group.findMany();
    
    return {
      props: { grpData: JSON.parse(JSON.stringify(grpData)), userData: JSON.parse(JSON.stringify(userData)), session: await getSession(context) }, // will be passed to the page component as props

    }
  }
  catch (err) {
    console.log("nok")

    return {
      props: { grpData: "Problem" }
    }
  }


}