import React, {useEffect, useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {AiOutlineDown} from 'react-icons/ai';
import { Button, Dialog } from '@mui/material';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const DeleteDialog = ({open,handleClose,handleDelete,selectedNoted}) => {
  return (<Dialog open={open} onClose={handleClose}>
    <DialogTitle>DELETE</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Do You Want To Delete This Note?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={()=> handleDelete(selectedNoted.note_id)}>Delete</Button>
      <Button onClick={handleClose}>Cancel</Button>
    </DialogActions>
  </Dialog>)
}
export const AddDialog = ({open,handleClose,handleAdd,appointmentID}) => {
  const [note,setNote] = useState("")
  const handleNoteChange = (event) => {
    setNote(event.target.value)
  }
  useEffect(() =>{
    if(open){
      setNote("")
    }
  },[open])
  const addNote = () =>{
    if(note.trim()){
      handleAdd(appointmentID,note)
    }
    else{
      alert("Note cannot be empty");
    }
  }
  return (
  <Dialog open={open} onClose={handleClose} PaperProps={{style:{minWidth: "500px",minHeight:"300px"}}}>
    <DialogTitle>Add Note</DialogTitle>
    <DialogContent>
    <TextField
          id="outlined-multiline-static"
          label="New Note"
          multiline
          rows={4}
          defaultValue=""
          style={{width:'100%',marginTop:'20px'}}
          onChange={handleNoteChange}
        />
    </DialogContent>
    <DialogActions>
      <Button onClick={addNote}>Add</Button>
      <Button onClick={handleClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
  )
}

export const EditDialog = ({open,handleClose,handleEdit,selectedNoted}) => {
  const [note,setNote] = useState('')
  const handleNoteChange = (event) => {
    setNote(event.target.value)
  }
  useEffect(() =>{
    if(open && selectedNoted){
      setNote(selectedNoted.note)
    }

  },[open])
  const editNote = () =>{
    if(note.trim()){
      handleEdit(selectedNoted.app_id,selectedNoted.note_id,note)
    }
    else{
      alert("Note cannot be empty");
    }
  }
  return (
  <Dialog open={open} onClose={handleClose} PaperProps={{style:{minWidth: "500px",minHeight:"300px"}}}>
    <DialogTitle>Edit Note</DialogTitle>
    <DialogContent>
    <TextField
          id="outlined-multiline-static"
          label="New Note"
          multiline
          rows={4}
          value={note}
          style={{width:'100%',marginTop:'20px'}}
          onChange={handleNoteChange}
        />
    </DialogContent>
    <DialogActions>
      <Button onClick={editNote}>Edit</Button>
      <Button onClick={handleClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
  )
}
function fetNote (id) {
  return fetch(`http://127.0.0.1:5000/test/view_note?id=${id}`).then((res)=>{
    if(!res.ok){
        throw new Error('Network response was not ok');
    }
    return res.json()
})      
}

export default function BasicAccordion({appointmentID}) {
  const [notes,setNotes] = useState([])
  const [deleteDia,setDeleteDia] = useState(false)
  const [selectedNoted,setSelectedNoted] = useState(null)
  const [addDia,setAddDia] = useState(false)
  const [editDia,setEditDia] = useState(false)
  const handleDelectOpen = () =>{
    setDeleteDia(true)
  }
  const handleAddOpen = () => {
    setAddDia(true)

  }
  const handleEditOpen = () =>{
    setEditDia(true)
  }
  const handleAddClose = () => {
    setAddDia(false)
  }
  const handleDeleteClose = () =>{
    setDeleteDia(false)
  }
  const handleEditClose = () =>{
    setEditDia(false)
  }
  const handleAdd = async (id,note) => {
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/test/add_note?id=${id}&data_string=${encodeURIComponent(note)}`);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetNote(id)   
    .then((data) =>{
      setNotes(data)
  
    })
      handleAddClose()
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/test/delete_note?id=${id}`);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetNote(appointmentID)   
    .then((data) =>{
      console.log(data)
      setNotes(data)
  
    })
      handleDeleteClose()
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }
  const handleEdit = async (appointmentID,id,note) =>{
    try {
      const response = await fetch(`http://127.0.0.1:5000/test/update_note?id=${appointmentID}&data_string=${encodeURIComponent(note)}&note_id=${id}`);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetNote(appointmentID)   
    .then((data) =>{
      setNotes(data)
  
    })
      handleEditClose()
    } catch (error) {
      console.error("Error update note data", error);
    }
  }
  useEffect(() =>{
    fetNote(appointmentID)
  .then((data) =>{
    setNotes(data)

  })      
  .catch((error) => {
    console.error("Error fetching data", error);
})  
  },[])
  return (
    <div>
        <div className='addNoteButton'>
        <Button onClick={()=>{handleAddOpen()}}>Add Note</Button>
        <AddDialog open={addDia} handleClose={handleAddClose} handleAdd={handleAdd} appointmentID={appointmentID}/>
        </div>
      {notes.map((note,index) => (
        <Accordion key={index}>
        <AccordionSummary
          expandIcon={<AiOutlineDown />}
          aria-controls={`panel${index+1}a-content`}
          id={`panel${index+1}a-header`}
        >
          <Typography>{`Note ${index+1}`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {note.note}
          </Typography>
          <Button size='small' onClick={()=>{handleEditOpen();setSelectedNoted(note)}}>
              EDIT
            </Button>
            <EditDialog open={editDia} handleClose={handleEditClose} handleEdit={handleEdit} selectedNoted={selectedNoted}/>
            <Button size='small' onClick={()=>{handleDelectOpen();setSelectedNoted(note);}}>
              DELETE
            </Button>
            <DeleteDialog open={deleteDia} handleClose={handleDeleteClose} handleDelete={handleDelete} selectedNoted={selectedNoted}/>
        </AccordionDetails>
      </Accordion>
      ))}
    
      
    
    </div>
  );
}