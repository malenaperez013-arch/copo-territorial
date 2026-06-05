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
const [vista,setVista]=
useState('mapa')
const relevamientosFiltrados=

relevamientos.filter(

r=>

r.territorio===
territorioSeleccionado

)
const totalRelevamientos =
relevamientos.length

const totalBarrios =
territorios.filter(
t=>t.tipo==='Barrio'
).length

const totalParajes =
territorios.filter(
t=>t.tipo==='Paraje'
).length

const cobertura =
Math.round(
(totalRelevamientos /
(totalBarrios + totalParajes))
* 100
) || 0

const presenciaAlta =
relevamientos.filter(
r=>r.estadoPolitico==='Alto'
).length

const presenciaMedia =
relevamientos.filter(
r=>r.estadoPolitico==='Medio'
).length

const presenciaBaja =
relevamientos.filter(
r=>r.estadoPolitico==='Bajo'
).length

const sinDatos =
relevamientos.filter(
r=>r.estadoPolitico==='Sin datos'
).length

const totalTerritorios =
territorios.length

const relevados =
new Set(
relevamientos.map(r => r.territorio)
).size

const sinRelevamiento =
totalTerritorios - relevados

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
padding:'12px',
marginBottom:'10px',
borderRadius:'10px',
border:'1px solid #374151',
background:'#1F2937',
color:'white'

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
overflow:'auto',
background:'#111827',
color:'white'
}}
>
{
vista==='estadisticas' && (

<div>

<h2
style={{
textAlign:'center',
marginBottom:'20px',
color:'#8B5CF6'
}}
>
📊 Estadísticas Generales
</h2>

<div
style={{
display:'grid',
gridTemplateColumns:'1fr 1fr',
gap:'10px',
marginBottom:'20px'
}}
>

<div
style={{
background:'#111827',
color:'white',
padding:'15px',
borderRadius:'12px',
textAlign:'center',
border:'1px solid #374151'
}}
>
<div style={{fontSize:'28px',fontWeight:'bold'}}>
{totalRelevamientos}
</div>
<div>📝 Relevamientos</div>
</div>

<div
style={{
background:'#111827',
color:'white',
padding:'15px',
borderRadius:'12px',
textAlign:'center',
border:'1px solid #374151'
}}
>
<div style={{fontSize:'28px',fontWeight:'bold'}}>
{totalBarrios}
</div>
<div>🏘️ Barrios</div>
</div>

<div
style={{
background:'#111827',
color:'white',
padding:'15px',
borderRadius:'12px',
textAlign:'center',
border:'1px solid #374151'
}}
>
<div style={{fontSize:'28px',fontWeight:'bold'}}>
{totalParajes}
</div>
<div>🌳 Parajes</div>
</div>

<div
style={{
background:'#6D28D9',
color:'white',
padding:'15px',
borderRadius:'12px',
textAlign:'center'
}}
>
<div style={{fontSize:'28px',fontWeight:'bold'}}>
{Math.round(
(totalRelevamientos /
territorios.length) * 100
) || 0}%
</div>
<div>📈 Cobertura</div>
</div>

</div>

<hr />

<h3>🚦 Semáforo Territorial</h3>

<div
style={{
background:'#7F1D1D',
padding:'10px',
borderRadius:'8px',
marginBottom:'8px'
}}
>
🔴 Alta presencia: {presenciaAlta}
</div>

<div
style={{
background:'#854D0E',
padding:'10px',
borderRadius:'8px',
marginBottom:'8px'
}}
>
🟡 Presencia media: {presenciaMedia}
</div>

<div
style={{
background:'#166534',
padding:'10px',
borderRadius:'8px',
marginBottom:'8px'
}}
>
🟢 Baja presencia: {presenciaBaja}
</div>

<div
style={{
background:'#374151',
padding:'10px',
borderRadius:'8px',
marginBottom:'8px'
}}
>
⚪ Sin datos: {sinDatos}
</div>
<hr style={{margin:'20px 0'}} />

<h3
style={{
textAlign:'center',
color:'#8B5CF6'
}}
>
📍 Territorios pendientes
</h3>

<div
style={{
background:'#111827',
padding:'15px',
borderRadius:'12px',
border:'1px solid #374151'
}}
>

{
territorios
.filter(t=>

!relevamientos.some(
r=>r.territorio===t.nombre
)

)
.slice(0,10)
.map(t=>(

<div
key={t.id}
style={{
padding:'5px 0'
}}
>
⚪ {t.nombre}
</div>

))
}

</div>
<hr />

<h3>{cobertura}%</h3>
<h3>⚠️ Territorios pendientes</h3>

{
territorios
.filter(
t => !relevamientos.some(
r => r.territorio === t.nombre
)
)
.slice(0,10)
.map(t => (

<div
key={t.id}
style={{
background:'#1F2937',
padding:'8px',
borderRadius:'8px',
marginBottom:'5px'
}}
>
📍 {t.nombre}
</div>

))
}
<div>
Territorios totales: {totalTerritorios}
</div>

<div>
Relevados: {relevados}
</div>

<div>
Pendientes: {sinRelevamiento}
</div>

</div>

)
}
<div
style={{
display:'flex',
justifyContent:'space-between',
alignItems:'center',
marginBottom:'15px'
}}
>

<div
style={{
textAlign:'center',
width:'100%'
}}
>

<h1
style={{
margin:'0',
fontSize:'28px',
fontWeight:'bold',
color:'#8B5CF6',
letterSpacing:'2px'
}}
>
ZONA TERRITORIAL
</h1>

<h2
style={{
margin:'5px 0',
fontSize:'20px',
color:'white'
}}
>
MONTE QUEMADO
</h2>

<div
style={{
fontWeight:'bold',
fontSize:'18px',
color:'#C4B5FD',
marginTop:'5px'
}}
>
La Libertad Avanza
</div>

<div
style={{
display:'flex',
gap:'10px',
marginTop:'15px'
}}
>

<button
onClick={()=>setVista('mapa')}
style={{
flex:1,
padding:'10px',
background:
vista==='mapa'
?'#6D28D9'
:'#333',
color:'white',
border:'none',
borderRadius:'8px'
}}
>
🗺️ Mapa
</button>

<button
onClick={()=>setVista('estadisticas')}
style={{
flex:1,
padding:'10px',
background:
vista==='estadisticas'
?'#6D28D9'
:'#333',
color:'white',
border:'none',
borderRadius:'8px'
}}
>
📊 Estadísticas
</button>

</div>

</div>

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
{
vista==='mapa' && (
<>
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
background:'#6D28D9',
color:'white',
border:'none',
borderRadius:'10px',
fontWeight:'bold',
fontSize:'16px'
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
background:'#1F2937',
border:'1px solid #374151',
color:'white',
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

</>

)
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

let colorPoligono = '#9CA3AF'

if(ultimoRelevamiento){

if(ultimoRelevamiento.estadoPolitico === 'Alto'){
colorPoligono = '#DC2626'
}

else if(ultimoRelevamiento.estadoPolitico === 'Medio'){
colorPoligono = '#F59E0B'
}

else if(ultimoRelevamiento.estadoPolitico === 'Bajo'){
colorPoligono = '#16A34A'
}

}

if(t.visual==='marcador'){

return(

<Marker
opacity={0}
key={t.id}
position={t.coordenadas}
eventHandlers={{
click:()=>{
setTerritorioSeleccionado(t.nombre)
}
}}
>

<Tooltip permanent direction="top">
{t.nombre}
</Tooltip>

<Popup>

<div style={{maxWidth:'250px'}}>

<h3>📍 {t.nombre}</h3>

<div>
Total relevamientos: {datosTerritorio.length}
</div>

{
ultimoRelevamiento && (

<div style={{marginTop:'10px'}}>

<div>👤 {ultimoRelevamiento.referente}</div>
<div>🏛️ {ultimoRelevamiento.estadoPolitico}</div>
<div>📅 {ultimoRelevamiento.fecha}</div>
<div>🏥 {ultimoRelevamiento.salud}</div>
<div>🏫 {ultimoRelevamiento.educacion}</div>
<div>🛣️ {ultimoRelevamiento.calles}</div>
<div>⚠️ {ultimoRelevamiento.necesidades}</div>
<div>💪 {ultimoRelevamiento.fortalezas}</div>
<div>💡 {ultimoRelevamiento.propuesta}</div>
<div>📝 {ultimoRelevamiento.observaciones}</div>

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
.filter(img => img.trim() !== '')
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

<div
style={{
marginTop:'10px',
fontWeight:'bold'
}}
>
📁 Historial: {datosTerritorio.length} relevamientos
</div>

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
pathOptions={{
color:colorPoligono,
fillColor:colorPoligono,
fillOpacity:0.45,
weight:2
}}
eventHandlers={{
click:()=>{
setTerritorioSeleccionado(t.nombre)
}
}}
>

<Popup>

<div style={{maxWidth:'250px'}}>

<h3>📍 {t.nombre}</h3>

<div>
Total relevamientos: {datosTerritorio.length}
</div>

{
ultimoRelevamiento && (

<div style={{marginTop:'10px'}}>

<div>👤 {ultimoRelevamiento.referente}</div>
<div>🏛️ {ultimoRelevamiento.estadoPolitico}</div>
<div>📅 {ultimoRelevamiento.fecha}</div>
<div>🏥 {ultimoRelevamiento.salud}</div>
<div>🏫 {ultimoRelevamiento.educacion}</div>
<div>🛣️ {ultimoRelevamiento.calles}</div>
<div>⚠️ {ultimoRelevamiento.necesidades}</div>
<div>💪 {ultimoRelevamiento.fortalezas}</div>
<div>💡 {ultimoRelevamiento.propuesta}</div>
<div>📝 {ultimoRelevamiento.observaciones}</div>

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
.filter(img => img.trim() !== '')
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

<div
style={{
marginTop:'10px',
fontWeight:'bold'
}}
>
📁 Historial: {datosTerritorio.length} relevamientos
</div>

</div>

)
}

</div>

</Popup>

</Polygon>

)

})
}

</MapContainer>

</div>

</div>

)

}