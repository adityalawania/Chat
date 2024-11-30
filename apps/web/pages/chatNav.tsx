import React, { useEffect, useRef, useState } from 'react'
import styles from "../styles/page.module.css"
import { getSession, useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import prisma from '../../server/src/config/db.config';
import  Loading from './loading'
import Router from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Navbar({grpData , userData}:any) {
    const session = useSession();
    
    const createGrpRef = useRef<HTMLDivElement | null>(null);
    const JoinGrpRef = useRef<HTMLDivElement | null>(null);
    const small_LoadingRef = useRef<HTMLDivElement | null>(null);

    const [grpName, setGrpName] = useState('')
    const [grpId, setGrpId] = useState()
    const [grpPasword, setGrpPassword] = useState('')


    const [privacy, setprivate] = useState(false)
    const [adminId, setadminId] = useState(0);
    const [adminName, setadminName] = useState('');
  

    // let max=0;
    useEffect(()=>{

        setTimeout(() => {
            userData.map((ele:any)=>{
                if(ele.email==session.data?.user?.email){
                    setadminId(ele.id)
                    setadminName(ele.name)
                    return;
                }
       
            })

        }, 2000);


    },[])

    const createGroup = async() => 
    {
        
        let random = Math.floor(Math.random()*1000000)+"";
        
        if(grpName=='') {
            toast.error('Please Enter some name',{
                autoClose:1500
            })

            return;
        };

     
        try {
            console.log("sending data...");
            const response = await fetch('/api/addGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    grpName: grpName,
                    adminId: adminId,
                    messages:[],
                    privacy:privacy,
                    password:random
                  

                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Group create:", data);
                Router.reload();
            } else {
                console.error("Failed to create group:", response);
            }

        }

        catch (err) {
            console.log("errr hai nbhao9")
        }
   
        
        
        
    }
    
    const joinGroup = async() => {


        
        let flag =false;
        grpData.map((el:any)=>{
            if(el.id==grpId){
                if(el.password == grpPasword){
                    flag=true;
  
                }
                else{
                    flag=false;
                }
                return ;
            }
       })

       if(!flag){

           toast.error("Invalid Credentials",{autoClose:1600})
       }
       else{

        try {
            console.log("sending data...");
            const response = await fetch('/api/addMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gId: Number(grpId),
                    memberId: adminId,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Group Joined:", data);
                toast.success("Group Joined",{
                    autoClose:1600
                })

                Router.reload();
                
            } else {
                console.error("Failed to join group:", response);
            }
            
        }
        
        catch (err) {
            console.log("errr hai nbhao9")
        }
        
        
    }
 

    }

    return (
        <div className={styles.chatNav}>
            <ToastContainer />
            <div className={styles.navBar}>
                <div className={styles.navBtn}>
                
                    <button onClick={()=>createGrpRef?.current?.classList.add('page-module__g8GY5a__show')}>Create</button>
                    <button onClick={()=>JoinGrpRef?.current?.classList.add('page-module__g8GY5a__show')}>Join</button>
                </div>
                <div className={styles.navInfo}>
                    <span>{session.data?.user?.email}</span>
                    <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000' })}>Logout</button>
                </div>
            </div>

            <div className={styles.modalCont} ref={createGrpRef}>
                <div className={styles.modal}>
                    <img src='/cross.png' onClick={()=>createGrpRef?.current?.classList.remove('page-module__g8GY5a__show')}/>
                    <h2>Create Group</h2>
                    <input type="text" placeholder='Enter Name' value={grpName} onKeyDown={(event)=>event.key === 'Enter' ? createGroup() :""} onChange={(e) => setGrpName(e.target.value)} />
                    <p>Private</p>
                    <label className={styles.switch} >
                        <input type="checkbox" onClick={() => { setprivate(!privacy)}} />
                        <span className={styles.slider}></span>
                    </label>
                    <button onClick={createGroup}>
                        
                        
           
                        <span>Create</span>
                        </button>
                </div>
            </div>

            <div className={styles.modalCont} ref={JoinGrpRef}>
                <div className={styles.modal}>
                    <img src='/cross.png' onClick={()=>JoinGrpRef?.current?.classList.remove('page-module__g8GY5a__show')}/>
                    <h2>Join Group</h2>
                    <input type="number" placeholder='Enter Group Id' value={grpId} onChange={(e) => setGrpId(e.target.value)} />
                    <input type="number" placeholder='Enter Group Password' value={grpPasword} onChange={(e) => setGrpPassword(e.target.value)} />

        
                    <button onClick={joinGroup}>
                        
                  
                        <span>Join</span>
                        </button>
                </div>
            </div>

        </div>
    )

  
    
}

