import React from 'react';
import Task from './task';
import styles from '../css/kanban.module.css';

const KanbanBoard = ({ 
  board, 
  boardIndex, 
  draggingTask,
  draggingBoard,
  dragTask,
  dragBoard,
  handleTaskDragStart,
  handleTaskDragEnd,
  handleTaskDragEnter,
  handleBoardDragStart,
  handleBoardDragEnd,
  handleBoardDragEnter,
  onAddTask,
  getMemberById
}) => {
  // Dynamically get board style based on dragging state
  const getBoardStyle = () => {
    if (draggingBoard && 
        dragBoard.current && 
        dragBoard.current.boardIndex === boardIndex) {
      return styles.boardDragging;
    }
    return "";
  };

  return (
    <div
      className={`${styles.boardContainer} ${getBoardStyle()}`}
      draggable
      onDragStart={(e) => handleBoardDragStart(e, boardIndex)}
      onDragEnd={handleBoardDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => {
        e.preventDefault();
        handleBoardDragEnter(e, boardIndex);
      }}
    >
      {/* Board Header */}
      <div className={styles.boardHeader}>
        <h3 className={styles.boardTitle}>{board.title}</h3>
        <span className={styles.taskCount}>
          {board.tasks.length}
        </span>
      </div>
      
      {/* Tasks Container */}
      <div 
        className={styles.tasksContainer}
        onDragOver={(e) => e.preventDefault()}
      >
        {board.tasks.map((task, taskIndex) => (
          <Task
            key={task.id}
            task={task}
            boardId={board.id}
            index={taskIndex}
            draggingTask={draggingTask}
            dragTask={dragTask}
            handleTaskDragStart={handleTaskDragStart}
            handleTaskDragEnd={handleTaskDragEnd}
            handleTaskDragEnter={handleTaskDragEnter}
            getMemberById={getMemberById}
          />
        ))}
        
        {/* Add Task Button */}
        <button
          onClick={() => onAddTask(board.id)}
          className={styles.addTaskBtn}
        >
          <span className={styles.plusIcon}>+</span> Add Task
        </button>
      </div>
    </div>
  );
};

export default KanbanBoard;