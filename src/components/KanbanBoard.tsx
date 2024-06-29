import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

// Componente principal del tablero Kanban
function KanbanBoard() {
  // Estado para almacenar las columnas
  const [columns, setColumns] = useState<Column[]>([]);
  // Utiliza useMemo para memorizar el array de ids de las columnas, evitando cálculos innecesarios
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  //Estado para almacenar las tareas
  //const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Estado para la columna activa
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  // Utiliza useSensors para obtener los sensores necesarios para el arrastre de elementos
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Configuración para la activación del sensor
      activationConstraint: {
        distance: 2,
      },
    })
  );

  // Devuelve el JSX que representa el componente KanbanBoard
  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {/* Mapea cada columna en el estado de columnas y renderiza un componente ColumnContainer para cada una */}
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id} // La clave única para cada componente es el ID de la columna
                  column={col} // Pasa la columna actual como prop al componente ColumnContainer
                  deleteColumn={deleteColumn} // Pasa la función deleteColumn como prop al componente ColumnContainer
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          {/* Botón para agregar una nueva lista */}
          <button
            onClick={() => {
              createNewColumn(); // Llama a la función createNewColumn cuando se hace clic en el botón
            }}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
          >
            <PlusIcon />
            Agregar Lista
          </button>
        </div>

        {/* Renderiza un componente DragOverlay para el arrastre de elementos */}
        {createPortal(
          <DragOverlay>
            {/* Si hay una columna activa, muestra el componente ColumnContainer */}
            {activeColumn && (
              <ColumnContainer
                column={activeColumn} // Datos de la columna activa
                deleteColumn={deleteColumn} // Función para eliminar columnas
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )} // Filtra y proporciona solo las tareas de la columna activa
              />
            )}
          </DragOverlay>,
          document.body // Renderiza el componente DragOverlay en el cuerpo del documento HTML
        )}
      </DndContext>
    </div>
  );

  function createNewColumn() {
    const columnToAdd: Column = {
      // ID único para la nueva columna
      id: generateId(),
      // Asigna un título a la nueva columna (ejemplo: Columna 1, Columna 2, etc.)
      title: `Columna ${columns.length + 1}`,
    };
    // Agrega la nueva columna al estado de columnas
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    // Filtra las columnas para excluir la columna con el ID proporcionado
    const filteredColumns = columns.filter((col) => col.id !== id);
    // Actualiza el estado de columnas con las columnas filtradas
    setColumns(filteredColumns);
  }

  // Actualiza el título de una columna
  function updateColumn(id: Id, title: string) {
    // Mapea sobre las columnas y actualiza el título de la columna con el ID correspondiente
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    // Actualizar el estado de las columnas con las columnas actualizadas
    setColumns(newColumns);
  }

  // Crea una nueva tarea y agregar al estado de tareas
  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(), // Genera un ID único para la tarea
      columnId, // Asigna el ID de la columna a la que pertenece la tarea
      content: ``, // Genera un contenido predeterminado para la tarea
    };

    // Actualiza el estado de tareas agregando la nueva tarea al final del array existente
    setTasks([...tasks, newTask]);
  }

  // Función para eliminar una tarea dado su ID
  function deleteTask(id: Id) {
    // Filtrar las tareas para obtener un nuevo array sin la tarea que se va a eliminar
    const newTasks = tasks.filter((task) => task.id !== id);
    // Actualizar el estado de las tareas con el nuevo array de tareas
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  // Función para manejar el inicio de un arrastre
  function onDragStart(event: DragStartEvent) {
    // Verifica si el tipo de dato arrastrado es una columna
    if (event.active.data.current?.type === "Column") {
      // Establece la columna activa en el estado
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    //setActiveColumn(null);
    //setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    /*const isActiveAColumn = active.data.current?.type === "Column";
        if (!isActiveAColumn) return;*/

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }
}

function generateId() {
  /* Genera un número aleatorio entre 0 y 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
