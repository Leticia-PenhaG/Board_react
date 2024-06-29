import { Column, Id, Task } from "../types";
import TrashIcon from "../icons/TrashIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

// Interfaz de props que define la estructura de datos esperada por el componente ColumnContainer
interface Props {
  column: Column; // Datos de la columna actual
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void; // Función para actualizar una columna

  createTask: (columnId: Id) => void; // Función para crear una nueva tarea en la columna actual
  updateTask: (id: Id, content:string) => void;
  deleteTask: (id:Id) => void;
  tasks: Task[]; // Lista de tareas asociadas a la columna actual

}

// Define el componente ColumnContainer que renderiza una columna
function ColumnContainer(props: Props) {
  // Extrae las propiedades column y deleteColumn de los props
  const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask} = props; //funciones del interface

  const [editMode, setEditMode] = useState(false); // estado para controlar el modo de edición

  // Uso del hook useSortable para hacer que el contenedor de la columna sea sortable
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    // Configuración del id y los datos relacionados con la columna para el sortable
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  // Estilo para el componente de la columna
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  // Devuelve el JSX que representa el componente ColumnContainer
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor border-2 border-rose-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      {/* Título de la columna */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          {/* Indicador de cantidad de tareas en la columna */}
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          {/* Renderizar el título de la columna si no está en modo de edición */}
          {!editMode && column.title}
          {/* Renderizar un input para editar el título de la columna si está en modo de edición */}
          {editMode && (
            <input
              className="bg-mainBackgroundColor focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>

        {/* Botón para eliminar la columna */}
        <button
          onClick={() => {
            deleteColumn(column.id); // Llama a la función deleteColumn con el ID de la columna
          }}
          className="stroke-gray-700 hover:stroke-black hover:bg-mainBackgroundColor rounded px-1 py-2"
        >
          <TrashIcon />
        </button>
      </div>

      {/* Columna contenedor de tareas */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        {/* Mapear sobre las tareas y renderizar una tarjeta de tarea para cada una */}
        {tasks.map((task) => (
          <TaskCard 
          key={task.id} 
          task={task} 
          deleteTask={deleteTask}
          updateTask={updateTask}
          />
        ))}
      </div>

      {/* Columna footer */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 
        rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor
        hover:text-rose-500"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon />
        Agregar tarjeta
      </button>
    </div>
  );
}

export default ColumnContainer; // Exporta el componente ColumnContainer
