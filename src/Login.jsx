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
background:'#f5f5f5'

}}
>

<div
style={{

width:'350px',
padding:'30px',
background:'white',
borderRadius:'12px',
boxShadow:'0 0 15px rgba(0,0,0,.1)'

}}
>

<h1
style={{

textAlign:'center'

}}
>

Territorio Copo

</h1>

<input

placeholder='Correo'

value={email}

onChange={(e)=>
setEmail(
e.target.value
)
}

style={{

width:'100%',
padding:'10px',
marginBottom:'10px'

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
padding:'10px',
marginBottom:'10px'

}}

/>


<button

onClick={ingresar}

style={{

width:'100%',
padding:'12px',
background:'#2563eb',
color:'white',
border:'none',
borderRadius:'8px'

}}

>

Ingresar

</button>

</div>

</div>

)

}