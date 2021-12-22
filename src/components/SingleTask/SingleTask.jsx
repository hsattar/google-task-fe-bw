import "./SingleTask.css";
import { BsCircle, BsCheckCircle, BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

export const SingleTask = ({ task, id, setDone, handleChanges, history, taskPlanner, plannerID }) => {
  const { URL } = process.env
  const [isChecked, setChecked] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [taskName, setTaskName] = useState(task)
  const [plannerColors, setPlannerColors] = useState([])
  const [randomColor, setRandomColor] = useState('')

  const randomColourGenerator = () => {
    const randomColorRed = Math.floor(Math.random() * 255)
    const randomColorBlue = Math.floor(Math.random() * 255)
    const randomColorGreen = Math.floor(Math.random() * 255)
    setRandomColor(`(${randomColorRed},${randomColorGreen},${randomColorBlue})`)
  }


  useEffect(() => {
    randomColourGenerator()
  }, [])

  const handleEdit = async e => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ task: taskName}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error('Edit Failed')
      handleChanges()
      handleClose()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeletePermanent = async () => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}/delete`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Delete Failed')
      handleChanges()
    } catch (error) {
      console.log(error)
    }
  } 

  useEffect(() => {
    if (isChecked) {
      //if the task has been marked as done
      // setTimeout(() => {
      setDone(id);
      // }, 500);
      console.log("isChecked");
      // setChecked(!isChecked)
    }
  }, [isChecked]);

  return (
    <>
    {
      history ? 
      <div className="single__wrap" style={taskPlanner === plannerID[0] ? { backgroundColor: `rgb${randomColor}` } : {backgroundColor: '#b2f7b9'}}>
      
        <div className="single__content">{task}</div>
        <div className="single__checkmark" onClick={handleDeletePermanent}>
          <BsFillTrashFill />
        </div>
    </div> :
    <div className="single__wrap" style={taskPlanner === plannerID[0] ? { backgroundColor: `rgb${randomColor}` } : {backgroundColor: '#b2f7b9'}}>
      <div className="single__checkmark" onClick={() => setChecked((check) => !check)}>
        {!isChecked ? <BsCircle /> : <BsCheckCircle />}
      </div>
      <div className="single__content">{task}</div>
      <div className="single__checkmark" onClick={handleShow}>
        <BsFillPencilFill />
      </div>
    </div>
    }

    <Modal show={show} onHide={handleClose}>
    <Modal.Body>
      <form onSubmit={handleEdit}>
        <input type="text" value={taskName} onChange={e => setTaskName(e.target.value)}/>
        <Button type="submit" variant="primary" style={{display: "none"}}>
          Submit
        </Button>
      </form>
    </Modal.Body>
    </Modal>
    </>
  );
};
