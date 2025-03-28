import {
  DragOverlay,
  useDraggable,
  UseDraggableArguments,
} from "@dnd-kit/core";
import { PropsWithChildren } from "react";

interface Props {
  id: string;
  data?: UseDraggableArguments["data"];
}

// DRAGGABLE ITEM
const KanbanItem = ({ children, id, data }: PropsWithChildren<Props>) => {
  // attribute= obj containing everything that is use to spread on the item to make it draggable
  // listener = obj containing event handlers to apply to this element
  // setNodeRef= reference to the node
  // active = contain the info of item been dragged
  const { attributes, listeners, setNodeRef, active } = useDraggable({
    id,
    data,
  });

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          opacity: active ? (active.id === id ? 1 : 0.5) : 1,
          borderRadius: "8px",
          position: "relative",
          cursor: "grab",
        }}
      >
        {active?.id === id && (
          <DragOverlay zIndex={1000}>
            <div
              style={{
                borderRadius: "8px",
                boxShadow: "rgba(149, 157, 105, 0.2) 0px 8px 24px",
                cursor: "grabbing",
              }}
            >
              {children}
            </div>
          </DragOverlay>
        )}
        {children}
      </div>
    </div>
  );
};
export default KanbanItem;
