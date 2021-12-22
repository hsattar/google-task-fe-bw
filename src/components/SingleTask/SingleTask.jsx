import "./SingleTask.css";
import { BsCircle, BsCheckCircle, BsFillPencilFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

export const SingleTask = ({ task, id, setDone, handleChanges }) => {
  console.log({ task, id });
  const [isChecked, setChecked] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [taskName, setTaskName] = useState(task)

  const handleEdit = async e => {
    e.preventDefault()
    try {
      const response = await fetch(`https://m6b1tasks-planner-api.herokuapp.com/tasks/${id}`, {
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
    <div className="single__wrap">
      <div className="single__checkmark" onClick={() => setChecked((check) => !check)}>
        {!isChecked ? <BsCircle /> : <BsCheckCircle />}
      </div>
      <div className="single__content">{task}</div>
      <div className="single__checkmark" onClick={handleShow}>
        <BsFillPencilFill />
      </div>
    </div>

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
