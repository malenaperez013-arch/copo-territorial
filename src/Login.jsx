import { useState } from 'react'
import { supabase } from './lib/supabase'

export default function Login(){

const [email,setEmail]=useState('')
const [password,setPassword]=useState('')

async function ingresar(){

const {error}=await supabase.auth.signInWithPassword({

email,
password

})

if(error){

alert(
'Usuario o contraseña incorrectos'
)

return

}

}

return(

<div
style={{
display:'flex',
justifyContent:'center',
alignItems:'center',
height:'100vh',
background:'linear-gradient(135deg,#111827,#1F2937)',
padding:'20px'
}}
>

<div
style={{
width:'400px',
padding:'35px',
background:'#111827',
border:'1px solid #374151',
borderRadius:'20px',
boxShadow:'0 0 30px rgba(109,40,217,.35)',
color:'white'
}}
>

<div
style={{
textAlign:'center',
marginBottom:'30px'
}}
>

<h1
style={{
margin:'0',
fontSize:'32px',
color:'#8B5CF6',
letterSpacing:'2px'
}}
>
ZONA TERRITORIAL
</h1>

<h2
style={{
margin:'10px 0 5px 0',
fontSize:'22px',
color:'white'
}}
>
MONTE QUEMADO
</h2>

<div
style={{
color:'#C4B5FD',
fontWeight:'bold',
fontSize:'16px'
}}
>
La Libertad Avanza
</div>

</div>

<input
placeholder='Correo electrónico'
value={email}
onChange={(e)=>
setEmail(
e.target.value
)
}
style={{
width:'100%',
padding:'12px',
marginBottom:'12px',
borderRadius:'10px',
border:'1px solid #374151',
background:'#1F2937',
color:'white',
boxSizing:'border-box'
}}
/>

<input
type='password'
placeholder='Contraseña'
value={password}
onChange={(e)=>
setPassword(
e.target.value
)
}
style={{
width:'100%',
padding:'12px',
marginBottom:'20px',
borderRadius:'10px',
border:'1px solid #374151',
background:'#1F2937',
color:'white',
boxSizing:'border-box'
}}
/>

<button
onClick={ingresar}
style={{
width:'100%',
padding:'14px',
background:'#6D28D9',
color:'white',
border:'none',
borderRadius:'10px',
fontWeight:'bold',
fontSize:'16px',
cursor:'pointer'
}}
>
INGRESAR AL SISTEMA
</button>

<div
style={{
marginTop:'20px',
textAlign:'center',
fontSize:'12px',
color:'#9CA3AF'
}}
>
Sistema de Relevamiento Territorial
</div>

</div>

</div>

)

}