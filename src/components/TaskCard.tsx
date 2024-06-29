import TrashIcon from "../icons/TrashIcon";
import { Task, Id } from "../types";
import { useState } from "react";


interface Props {
  task: Task;
  deleteTask:(id:Id) => void;
  updateTask: (id: Id, content: string) => void;
}

// Componente para representar una tarjeta de tarea
function TaskCard({ task, deleteTask, updateTask }: Props) {
  // Estado para rastrear si el mouse está sobre la tarjeta
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if(editMode) {
    return (
    <div className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative">
    <textarea
          className="
        h-[90%]
        w-full resize-none border-none rounded bg-transparent text-black focus:outline-none
        "
          value={task.content}
          autoFocus
          placeholder="Descripción de la tarjeta"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
  </div>
  );
}

  return (
    <div
      onClick = {toggleEditMode}
      className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      // Manejadores de eventos para el mouse
      onMouseEnter={() => {
        setMouseIsOver(true); // Establece el estado como verdadero cuando el mouse entra en la tarjeta
      }}
      onMouseLeave={() => {
        setMouseIsOver(false); // Establece el estado como falso cuando el mouse sale de la tarjeta
      }}
    >

<p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>

      {/* Botón de eliminación de la tarjeta */}
      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id); // cuando se haga click, llama a la función deleteTask
          }}
          className="stroke-gray-700 hover:stroke-black hover:bg-mainBackgroundColor absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded"
          style={{ backgroundColor: "bg-mainBackgroundColor" }}
        >
          <TrashIcon /> 
        </button>
      )}
    </div>
  );
}

export default TaskCard;

