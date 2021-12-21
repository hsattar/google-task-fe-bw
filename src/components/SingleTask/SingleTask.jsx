import "./SingleTask.css";
import { BsCircle, BsCheckCircle } from "react-icons/bs";
import { useEffect, useState } from "react";

export const SingleTask = ({ task, id, setDone }) => {
  const [isChecked, setChecked] = useState(false);
  console.log({ task, id });

  // TODO: MANSI
  // PUT AND DELETE FOR TASKS IN HERE

  // END OF PUT AND DELETE

  useEffect(() => {
    if (isChecked) {
      //if the task has been marked as done
      setTimeout(() => {
        setDone(id);
      }, 500);
      console.log("isChecked");
    }
  }, [isChecked]);

  return (
    <div className="single__wrap">
      <div className="single__checkmark" onClick={() => setChecked((check) => !check)}>
        {!isChecked ? <BsCircle /> : <BsCheckCircle />}
      </div>
      <div className="single__content">{task}</div>
    </div>
  );
};
