import { KanbanColumnSkeleton, ProjectCardSkeleton } from "@/components";
import { KanbanAddCardButton } from "@/components/tasks/Kanban/AddCardButton";
import {
  KanbanBoardContainer,
  KanbanBoard,
} from "@/components/tasks/Kanban/Board";
import { ProjectCardMemo } from "@/components/tasks/Kanban/Card";
import KanbanColumn from "@/components/tasks/Kanban/Column";
import KanbanItem from "@/components/tasks/Kanban/Item";
import { UPDATE_TASK_STAGE_MUTATION } from "@/graphql/mutations";
import { TASK_STAGES_QUERY, TASKS_QUERY } from "@/graphql/queries";
import { TaskStage } from "@/graphql/schema.types";
import { TasksQuery } from "@/graphql/types";
import { DragEndEvent } from "@dnd-kit/core";
import { useList, useNavigation, useUpdate } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import { PropsWithChildren, useMemo } from "react";

const TaskList = ({ children }: PropsWithChildren) => {
  const { replace } = useNavigation();

  // Fetch Tasks stages
  const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
    resource: "taskStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"],
      },
    ],
    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],
    meta: {
      gqlQuery: TASK_STAGES_QUERY,
    },
  });
  // console.log(stages);

  // Fetch Tasks
  const { data: tasks, isLoading: isLoadingTask } = useList<
    GetFieldsFromList<TasksQuery>
  >({
    resource: "tasks",
    sorters: [
      {
        field: "dueDate",
        order: "asc",
      },
    ],
    queryOptions: {
      enabled: !!stages, // only fetch tasks when stages are fetched
    },
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: TASKS_QUERY,
    },
  });

  // console.log(tasks);

  // use to mutate and move the task for drag and drop
  const { mutate: updateTask } = useUpdate();

  // group tasks by stages
  const taskStages = useMemo(() => {
    if (!tasks?.data || !stages?.data) {
      return {
        unassignedStage: [],
        stages: [],
      };
    }

    // if no stageId assign to unassignedStage
    const unassignedStage = tasks.data.filter((task) => task.stageId === null);

    const grouped: TaskStage[] = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id),
    }));

    return {
      unassignedStage,
      column: grouped,
    };
  }, [stages, tasks]);

  // console.log(tasks);

  const handleAddCard = (args: { stageId: string }) => {
    const path =
      args.stageId === "unassigned"
        ? `/tasks/new`
        : `/tasks/new?stageId=${args.stageId}`;

    replace(path);
  };

  // update task stage when the task is drag and drop
  const handleOnDragEnd = (e: DragEndEvent) => {
    let stageId = e.over?.id as undefined | string | null;

    const taskId = e.active.id as string;

    const taskStageId = e.active.data.current?.stageId;

    if (taskStageId === stageId) return;

    if (stageId === "unassigned") {
      stageId = null;
    }

    updateTask({
      resource: "tasks",
      id: taskId, // task we are updating
      values: {
        stageId: stageId, // value to be updated i.e changing the id of task we are moving to stageId
      },
      successNotification: false,
      mutationMode: "optimistic", // moving it before it updates the database to enhance UI experience. we assume the database update will happen else the changes will revert
      meta: {
        gqlMutation: UPDATE_TASK_STAGE_MUTATION,
      },
    });
  };

  const isLoading = isLoadingStages || isLoadingTask;
  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          <KanbanColumn
            id="unassigned"
            title={"unassigned"}
            count={taskStages.unassignedStage.length || 0}
            onAddClick={() => handleAddCard({ stageId: "unassigned" })}
          >
            {taskStages.unassignedStage.map((task) => (
              <KanbanItem
                key={task.id}
                id={task.id}
                data={{ ...task, stageId: "unassigned" }}
              >
                <ProjectCardMemo
                  {...task}
                  dueDate={task.dueDate || undefined}
                />
              </KanbanItem>
            ))}
            {!taskStages.unassignedStage.length && (
              <KanbanAddCardButton
                onClick={() => handleAddCard({ stageId: "unassigned" })}
              />
            )}
          </KanbanColumn>

          {taskStages.column?.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={column.tasks.length}
              onAddClick={() => handleAddCard({ stageId: column.id })}
            >
              {!isLoading &&
                column.tasks.map((task) => (
                  <KanbanItem key={task.id} id={task.id} data={task}>
                    <ProjectCardMemo
                      {...task}
                      dueDate={task.dueDate || undefined}
                    />
                  </KanbanItem>
                ))}
              {!column.tasks.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: column.id })}
                />
              )}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>

      {/* to display modal */}
      {children}
    </>
  );
};
export default TaskList;

///////// Skeleton ////////
const PageSkeleton = () => {
  const columnCount = 6;
  const itemCount = 4;

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, i) => (
        <KanbanColumnSkeleton key={i}>
          {Array.from({ length: itemCount }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </KanbanColumnSkeleton>
      ))}
    </KanbanBoardContainer>
  );
};
