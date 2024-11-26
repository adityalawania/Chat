import React, { useEffect, useRef, useState } from 'react'
import styles from "../styles/page.module.css"
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import prisma from '../../server/src/config/db.config';
import  Loading from './loading'
import Router from 'next/router';

export default function Navbar({data}:any) {
    const session = useSession();
    const createGrpRef = useRef<HTMLDivElement | null>(null);
    const JoinGrpRef = useRef<HTMLDivElement | null>(null);

    const [grpName, setGrpName] = useState('')
    const [grpKey, setGrpKey] = useState('')

    const [privacy, setprivate] = useState(false)
    const [adminId, setadminId] = useState(0);
    const [adminName, setadminName] = useState('');


    // let max=0;
    useEffect(()=>{
        // console.log(data)
        setTimeout(() => {
            data.map((ele:any)=>{
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
        console.log(random);
        
        console.log(adminId+" "+adminName)
   
        if(grpName=='') return;

     
        createGrpRef?.current?.children[0]?.children[4]?.children[0]?.classList.add('page-module__g8GY5a__show')
        createGrpRef?.current?.children[0]?.children[4]?.children[1]?.classList.add('page-module__g8GY5a__hide')

        
        
        setTimeout(() => {
            createGrpRef?.current?.children[0]?.children[4]?.children[0]?.classList.remove('page-module__g8GY5a__show')
            createGrpRef?.current?.classList.add('page-module__g8GY5a__hide')
            
        }, 2300);
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
            } else {
                console.error("Failed to create group:", response);
            }

        }

        catch (err) {
            console.log("errr hai nbhao9")
        }

Router.reload();
        

    }

    const joinGroup = () => {
        JoinGrpRef?.current?.children[0]?.children[3]?.children[0]?.classList.add('page-module__g8GY5a__show')
        JoinGrpRef?.current?.children[0]?.children[3]?.children[1]?.classList.add('page-module__g8GY5a__hide')

        setTimeout(() => {
            createGrpRef?.current?.children[0]?.children[3]?.children[0]?.classList.remove('page-module__g8GY5a__show')
            createGrpRef?.current?.classList.add('page-module__g8GY5a__hide')
            
        }, 2300);



    }
    return (
        <div className={styles.chatNav}>
            <div className={styles.navBar}>
                <div className={styles.navBtn}>
            
                    <button onClick={()=>createGrpRef?.current?.classList.add('page-module__g8GY5a__show')}>Create</button>
                    <button onClick={()=>JoinGrpRef?.current?.classList.add('page-module__g8GY5a__show')}>Join</button>
                </div>
                <div className={styles.navInfo}>
                    <span>{session.data?.user?.name}</span>
                    <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000' })}>Logout</button>
                </div>
            </div>

            <div className={styles.createGroupCont} ref={createGrpRef}>
                <div className={styles.createGroup}>
                    <h2>Create Group</h2>
                    <input type="text" placeholder='Enter Name' value={grpName} onChange={(e) => setGrpName(e.target.value)} />
                    <p>Private</p>
                    <label className={styles.switch} >
                        <input type="checkbox" onClick={() => { setprivate(!privacy); console.log(privacy) }} />
                        <span className={styles.slider}></span>
                    </label>
                    <button onClick={createGroup}>
                        
                        <Loading/>
                        <span>Create</span>
                        </button>
                </div>
            </div>

            <div className={styles.createGroupCont} ref={JoinGrpRef}>
                <div className={styles.createGroup}>
                    <h2>Join Group</h2>
                    <input type="text" placeholder='Enter Group Id' value={grpName} onChange={(e) => setGrpName(e.target.value)} />
                    <input type="text" placeholder='Enter Group Password' value={grpKey} onChange={(e) => setGrpKey(e.target.value)} />

        
                    <button onClick={joinGroup}>
                        
                        <Loading/>
                        <span>Join</span>
                        </button>
                </div>
            </div>

        </div>
    )

  
    
}

