import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />

      <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=''/>

{/* ************************* Montserrat   ********************* */}
<link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@300&family=Montserrat:wght@300&family=Playfair+Display&family=Poppins:wght@200&family=Rajdhani:wght@500&display=swap" rel="stylesheet"></link>



{/********************* Anuphan ********************************* */ }
<link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@300&family=Playfair+Display&family=Poppins:wght@200&family=Rajdhani:wght@500&display=swap" rel="stylesheet"></link>



{/* **************** Rajdhani ******************************* */}
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display&family=Poppins:wght@200&family=Rajdhani:wght@500&display=swap" rel="stylesheet"></link>
      
      
      {/* ***************  Poppins  *********** */}
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display&family=Poppins:wght@200&display=swap" rel="stylesheet"></link>
    
      <body style={{backgroundColor:'black',margin:'0px',padding:'0px',color:'white',overflowX:'hidden',width:'100vw'}}>
        
        <Main />
        <NextScript/>
      </body>
    </Html>
  
  )
}
