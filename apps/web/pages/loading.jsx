import React from 'react'
import styles from '../styles/page.module.css'

function Loading() {
  return (
   
    <div className={`${styles.loader} ${styles.smallLoader}`}></div>

  )
}

export default Loading