import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { PropsWithChildren } from "react";

export const KanbanBoardContainer = ({ children }: PropsWithChildren) => {
  return (
    <div
      style={{
        width: "calc(100% + 64px)",
        height: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "column",
        margin: "-32px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          padding: "32px",
          overflow: "scroll",
        }}
      >
        {children}
      </div>
    </div>
  );
};

type Props = {
  onDragEnd: (e: DragEndEvent) => void;
};

export const KanbanBoard = ({
  children,
  onDragEnd,
}: PropsWithChildren<Props>) => {
  // mouse drag
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // this activate when the item is dragged 5px away. it will activate it draggable feature
    },
  });

  // for  mobile drag
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 5, // same for mouse sensors
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor); //useSensors

  return (
    <DndContext onDragEnd={onDragEnd} sensors={sensors}>
      {children}
    </DndContext>
  );
};
