import { useState } from 'react'
import { supabase } from './lib/supabase'

export default function Login(){

const [email,setEmail]=useState('')
const [password,setPassword]=useState('')
const [mostrarPassword,setMostrarPassword]=useState(false)
const [mostrarRegistro,setMostrarRegistro] = useState(false)

const [nombre,setNombre]=useState('')
const [registroEmail,setRegistroEmail]=useState('')
const [registroPassword,setRegistroPassword]=useState('')
const [codigoInvitacion,setCodigoInvitacion]=useState('')
const [mostrarRegistroPassword,setMostrarRegistroPassword]=useState(false)

const CODIGO_INVITACION = 'LLA2026'

async function ingresar(){

const {error}=await supabase.auth.signInWithPassword({
email,
password
})

if(error){
alert('Usuario o contraseña incorrectos')
return
}

}

async function registrar(){

if(codigoInvitacion !== CODIGO_INVITACION){
alert('Código de invitación incorrecto')
return
}

const { error } = await supabase.auth.signUp({
email: registroEmail,
password: registroPassword
})

if(error){
alert(error.message)
return
}

alert('Cuenta creada correctamente. Ya puedes iniciar sesión.')

setNombre('')
setRegistroEmail('')
setRegistroPassword('')
setCodigoInvitacion('')
setMostrarRegistro(false)

}

const inputStyle={
width:'100%',
padding:'12px',
marginBottom:'10px',
borderRadius:'10px',
border:'1px solid #374151',
background:'#1F2937',
color:'white',
boxSizing:'border-box'
}

const passwordInputStyle={
...inputStyle,
paddingRight:'45px',
marginBottom:0
}

const eyeButtonStyle={
position:'absolute',
right:'8px',
top:'50%',
transform:'translateY(-50%)',
background:'transparent',
border:'none',
color:'white',
cursor:'pointer',
fontSize:'18px'
}

return(

<div
style={{
display:'flex',
justifyContent:'center',
alignItems:'center',
minHeight:'100vh',
background:'linear-gradient(135deg,#111827,#1F2937)',
padding:'20px'
}}
>

<div
style={{
width:'420px',
padding:'35px',
background:'#111827',
border:'1px solid #374151',
borderRadius:'20px',
boxShadow:'0 0 30px rgba(109,40,217,.35)',
color:'white'
}}
>

<div style={{textAlign:'center',marginBottom:'25px'}}>

<h1
style={{
margin:'0',
fontSize:'30px',
color:'#8B5CF6',
letterSpacing:'2px'
}}
>
ZONA TERRITORIAL
</h1>

<h2 style={{margin:'5px 0',fontSize:'22px'}}>
MONTE QUEMADO
</h2>

<div style={{color:'#C4B5FD',fontWeight:'bold'}}>
La Libertad Avanza
</div>

</div>

<h3 style={{textAlign:'center',marginBottom:'15px'}}>
Ingresar
</h3>

<input
placeholder='Correo electrónico'
value={email}
onChange={(e)=>setEmail(e.target.value)}
style={inputStyle}
/>

<div style={{position:'relative',marginBottom:'10px'}}>

<input
type={mostrarPassword ? 'text' : 'password'}
placeholder='Contraseña'
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={passwordInputStyle}
/>

<button
type='button'
onClick={()=>setMostrarPassword(!mostrarPassword)}
style={eyeButtonStyle}
>
{mostrarPassword ? '🙈' : '👁️'}
</button>

</div>

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

<hr style={{margin:'25px 0',border:'1px solid #374151'}}/>

<div
onClick={()=>setMostrarRegistro(!mostrarRegistro)}
style={{
cursor:'pointer',
textAlign:'center',
color:'#C4B5FD',
fontWeight:'bold',
marginBottom:'15px'
}}
>
{mostrarRegistro
? '▼ Ocultar registro'
: '▶ Crear cuenta'}
</div>

{
mostrarRegistro && (
<>

<input
placeholder='Nombre completo'
value={nombre}
onChange={(e)=>setNombre(e.target.value)}
style={inputStyle}
/>

<input
placeholder='Correo electrónico'
value={registroEmail}
onChange={(e)=>setRegistroEmail(e.target.value)}
style={inputStyle}
/>

<div style={{position:'relative',marginBottom:'10px'}}>

<input
type={mostrarRegistroPassword ? 'text' : 'password'}
placeholder='Contraseña'
value={registroPassword}
onChange={(e)=>setRegistroPassword(e.target.value)}
style={passwordInputStyle}
/>

<button
type='button'
onClick={()=>setMostrarRegistroPassword(!mostrarRegistroPassword)}
style={eyeButtonStyle}
>
{mostrarRegistroPassword ? '🙈' : '👁️'}
</button>

</div>

<input
placeholder='Código de invitación'
value={codigoInvitacion}
onChange={(e)=>setCodigoInvitacion(e.target.value)}
style={{
...inputStyle,
marginBottom:'15px'
}}
/>

<button
onClick={registrar}
style={{
width:'100%',
padding:'14px',
background:'#059669',
color:'white',
border:'none',
borderRadius:'10px',
fontWeight:'bold',
cursor:'pointer'
}}
>
CREAR CUENTA
</button>

</>
)
}

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