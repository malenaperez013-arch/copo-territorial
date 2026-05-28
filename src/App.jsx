import 'leaflet/dist/leaflet.css'

import { useState,useEffect } from 'react'

import {
MapContainer,
TileLayer,
Polygon,
Marker,
Popup,
Tooltip
} from 'react-leaflet'

import { territorios } from './data/territorios'
import { supabase } from './lib/supabase'
import Login from './Login'
import L from 'leaflet'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
iconRetinaUrl: markerIcon2x,
iconUrl: markerIcon,
shadowUrl: markerShadow,
})

export default function App(){

const [sesion,setSesion]=useState(undefined)

const [zonaSeleccionada,setZonaSeleccionada]=
useState('Monte Quemado')

const [territorioSeleccionado,
setTerritorioSeleccionado]=
useState('')

const [habitantes,setHabitantes]=
useState('')

const [referente,setReferente]=
useState('')

const [estadoPolitico,setEstadoPolitico]=
useState('')

const [salud,setSalud]=
useState('')

const [educacion,setEducacion]=
useState('')

const [calles,setCalles]=
useState('')

const [observaciones,setObservaciones]=
useState('')

const [necesidades,setNecesidades]=
useState('')

const [fortalezas,setFortalezas]=
useState('')

const [propuesta,setPropuesta]=
useState('')

const [imagenes,setImagenes]=
useState([])

const [relevamientos,setRelevamientos]=
useState([])
const [guardando,setGuardando]=
useState(false)
const relevamientosFiltrados=

relevamientos.filter(

r=>

r.territorio===
territorioSeleccionado

)

useEffect(()=>{

supabase.auth
.getSession()
.then(({data})=>{

setSesion(data.session)

})

const {data:listener}=
supabase.auth.onAuthStateChange(

(event,session)=>{

setSesion(session)

}

)

return()=>{

listener.subscription.unsubscribe()

}

},[])

async function cargarRelevamientos(){

const {data,error}

=

await supabase

.from(
'territorios_relevamiento'
)

.select('*')

.order(
'id',
{ascending:false}
)

if(!error){

setRelevamientos(data)

}

}

useEffect(()=>{

cargarRelevamientos()

},[])


if(sesion===undefined){

return(

<div
style={{
display:'flex',
justifyContent:'center',
alignItems:'center',
minHeight:'100vh'
}}
>

Cargando...

</div>

)

}


if(!sesion){

return <Login/>

}


const territorioActual=

territorios.find(
t=>t.nombre===territorioSeleccionado
)

const esParaje=
territorioActual?.tipo==='Paraje'

const esMovil=
window.innerWidth<768


const campo={

width:'100%',
padding:'10px',
marginBottom:'10px',
borderRadius:'8px',
border:'1px solid #ccc'

}


async function guardar(){

try{

await cargarRelevamientos()

setGuardando(false)

let urlsImagenes=[]

for(const imagen of imagenes){

const nombreLimpio=

imagen.name
.normalize('NFD')
.replace(/[\u0300-\u036f]/g,'')
.replace(/\s+/g,'-')
.replace(/[^a-zA-Z0-9.-]/g,'')

const nombreArchivo=

`${Date.now()}-${nombreLimpio}`


const {error:uploadError}

=

await supabase
.storage
.from('territorio-imagenes')
.upload(
nombreArchivo,
imagen
)

if(uploadError){

throw uploadError

}

const {data}

=

supabase
.storage
.from(
'territorio-imagenes'
)
.getPublicUrl(
nombreArchivo
)

urlsImagenes.push(
data.publicUrl
)

}


const datos={

territorio:
territorioSeleccionado,

tipo:
territorioActual?.tipo,

habitantes:
esParaje
?habitantes
:null,

referente,
estadoPolitico,
salud,
educacion,
calles,
observaciones,
necesidades,
fortalezas,
propuesta,

imagenes:
urlsImagenes.join(','),

fecha:
new Date()
.toLocaleDateString()

}


const {error}

=

await supabase

.from(
'territorios_relevamiento'
)

.insert([datos])


if(error){

throw error

}
setHabitantes('')
setReferente('')
setEstadoPolitico('')
setSalud('')
setEducacion('')
setCalles('')
setObservaciones('')
setNecesidades('')
setFortalezas('')
setPropuesta('')
setImagenes([])
setGuardando(false)
alert(
'Guardado correctamente ✅'
)

}
catch(error){
setGuardando(false)
alert(
error.message
)

}

}

return(

<div
style={{
display:'flex',
flexDirection:
esMovil
?'column'
:'row',
height:'100vh'
}}
>


<div
style={{
width:
esMovil
?'100%'
:'35%',
height:
esMovil
?'50vh'
:'100vh',
padding:'20px',
overflow:'auto'
}}
>

<div
style={{
display:'flex',
justifyContent:'space-between',
alignItems:'center',
marginBottom:'15px'
}}
>

<h1>
Relevamiento
</h1>

<button
onClick={async()=>{

await supabase.auth.signOut()

}}
style={{
background:'#dc2626',
color:'white',
border:'none',
padding:'10px',
borderRadius:'8px'
}}
>

Cerrar sesión

</button>

</div>

<select
style={campo}
value={zonaSeleccionada}
onChange={(e)=>setZonaSeleccionada(e.target.value)}
>

<option>Monte Quemado</option>
<option>Interior</option>

</select>


<select
style={campo}
value={territorioSeleccionado}
onChange={(e)=>setTerritorioSeleccionado(e.target.value)}
>

<option>
Seleccionar
</option>

{
territorios
.filter(t=>

zonaSeleccionada==='Interior'
?
t.tipo==='Paraje'
:
t.tipo!=='Paraje'

)

.map(t=>(

<option
key={t.id}
value={t.nombre}
>

{t.nombre}

</option>

))

}

</select>


{
esParaje&&(

<input
style={campo}
type='number'
placeholder='Habitantes'
value={habitantes}
onChange={(e)=>
setHabitantes(
e.target.value
)}
/>

)
}

<input
style={campo}
placeholder='Referente'
value={referente}
onChange={(e)=>setReferente(e.target.value)}
/>

<select
style={campo}
value={estadoPolitico}
onChange={(e)=>setEstadoPolitico(e.target.value)}
>
<option value=''>
 Presencia de la intendencia actual
</option>
<option>Alto</option>
<option>Medio</option>
<option>Bajo</option>
<option>Sin datos</option>
</select>


<select
style={campo}
value={salud}
onChange={(e)=>setSalud(e.target.value)}
>
<option value=''>🏥 Salud</option>
<option>Sala abandonada</option>
<option>Sin centro de salud</option>
<option>Falta medicamentos</option>
</select>


<select
style={campo}
value={educacion}
onChange={(e)=>setEducacion(e.target.value)}
>
<option value=''>🏫 Educación</option>
<option>Infante</option>
<option>Primaria</option>
<option>Secundaria</option>
</select>


<select
style={campo}
value={calles}
onChange={(e)=>setCalles(e.target.value)}
>
<option value=''>🛣️ Calles</option>
<option>Asfalto</option>
<option>Empedrado</option>
<option>Tierra</option>
</select>


<textarea
style={campo}
placeholder='⚠ Necesidades'
value={necesidades}
onChange={(e)=>setNecesidades(e.target.value)}
/>


<textarea
style={campo}
placeholder='💪 Fortalezas'
value={fortalezas}
onChange={(e)=>setFortalezas(e.target.value)}
/>


<textarea
style={campo}
placeholder='💡 Propuesta'
value={propuesta}
onChange={(e)=>setPropuesta(e.target.value)}
/>

<textarea
style={campo}
placeholder='📝 Observaciones'
value={observaciones}
onChange={(e)=>setObservaciones(e.target.value)}
/>

<input
type='file'
multiple
accept='image/*'
style={campo}
onChange={(e)=>{

setImagenes(
Array.from(
e.target.files
)
)

}}
/>

{
imagenes.length>0 && (

<div
style={{
marginBottom:'10px'
}}
>

<strong>
📷 Imágenes
</strong>

{

imagenes.map((img,index)=>(

<img
key={index}
src={URL.createObjectURL(img)}
style={{
width:'100%',
marginTop:'10px',
borderRadius:'8px'
}}
/>

))

}

</div>

)
}

<button
onClick={guardar}
style={{
width:'100%',
padding:'12px',
background:'#2563eb',
color:'white',
border:'none',
borderRadius:'10px'
}}
>

{
guardando
?
'Guardando...'
:
'Guardar relevamiento'
}

</button>
<hr style={{margin:'20px 0'}}/>

<h2>

Relevamientos de:

{territorioSeleccionado || 'Sin seleccionar'}

</h2>

<div
style={{
marginBottom:'15px',
fontWeight:'bold',
color:'#2563eb'
}}
>

Total:
{relevamientosFiltrados.length}

</div>

{
relevamientosFiltrados.map((r)=>(

<div
key={r.id}
style={{
border:'1px solid #ddd',
padding:'10px',
borderRadius:'10px',
marginBottom:'10px'
}}
>

<strong>
{r.territorio}
</strong>

<div>
📅 {r.fecha}
</div>

<div>
👤 {r.referente}
</div>

<div>
🏛️ {r.estadoPolitico}
</div>

<div>
📝 {r.observaciones}
</div>
{
r.imagenes && (

<div
style={{
marginTop:'10px'
}}
>

{

r.imagenes
.split(',')

.map((img,index)=>(

<img
key={index}
src={img}
alt=''

style={{
width:'100%',
marginTop:'5px',
borderRadius:'8px'
}}
/>

))

}

</div>

)
}
</div>

))
}
</div>

<div
style={{
flex:1,
height:
esMovil
?'50vh'
:'100vh'
}}
>

<MapContainer
center={[-25.805,-62.834]}
zoom={11}
style={{
height:'100%',
width:'100%'
}}
>

<TileLayer
url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
/>

{

territorios.map(t=>{

const datosTerritorio=

relevamientos.filter(

r=>r.territorio===t.nombre

)

const ultimoRelevamiento=

datosTerritorio[0]

if(t.visual==='marcador'){

return(

<Marker
opacity={0}
key={t.id}
position={t.coordenadas}

eventHandlers={{

click:()=>{

setTerritorioSeleccionado(
t.nombre
)

}

}}

>

<Tooltip permanent direction="top">

{t.nombre}

</Tooltip>

<Popup>

<div
style={{
maxWidth:'250px'
}}
>

<h3>
📍 {t.nombre}
</h3>

<div>
Total relevamientos:
{datosTerritorio.length}
</div>

{

ultimoRelevamiento && (

<div
style={{
marginTop:'10px'
}}
>

<div>
👤 {ultimoRelevamiento.referente}
</div>

<div>
🏛️ {ultimoRelevamiento.estadoPolitico}
</div>

<div>
📅 {ultimoRelevamiento.fecha}
</div>

<div>
📝 {ultimoRelevamiento.observaciones}
</div>

<div
style={{
marginTop:'10px',
fontWeight:'bold'
}}
>

📁 Historial:
{datosTerritorio.length}
relevamientos

</div>

{
ultimoRelevamiento.imagenes && (

<div
style={{
display:'flex',
gap:'5px',
overflowX:'auto',
marginTop:'10px'
}}
>

{

ultimoRelevamiento.imagenes
.split(',')

.map((img,index)=>(

<img
key={index}
src={img}
alt=''

style={{
width:'70px',
height:'70px',
objectFit:'cover',
borderRadius:'8px'
}}
/>

))

}

</div>

)
}

</div>

)
}

</div>

</Popup>

</Marker>
)

}

return(

<Polygon
key={t.id}
positions={t.coordenadas}

eventHandlers={{

click:()=>{

setTerritorioSeleccionado(
t.nombre
)

}

}}

/>

)

})

}

</MapContainer>

</div>

</div>

)

}