import React from 'react';
import styles from '../css/task.module.css';

const Task = ({ 
  task, 
  boardId, 
  index, 
  draggingTask, 
  dragTask, 
  handleTaskDragStart, 
  handleTaskDragEnd, 
  handleTaskDragEnter,
  getMemberById 
}) => {
  // Dynamically get task style based on dragging state
  const getTaskStyle = () => {
    if (draggingTask && 
        dragTask.current && 
        dragTask.current.boardId === boardId && 
        dragTask.current.taskIndex === index) {
      return styles.taskDragging;
    }
    return "";
  };

  // Priority badge styles
  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case 'High':
        return styles.priorityHigh;
      case 'Medium':
        return styles.priorityMedium;
      case 'Low':
        return styles.priorityLow;
      default:
        return styles.priorityDefault;
    }
  };

  return (
    <div
      className={`${styles.task} ${getTaskStyle()}`}
      draggable
      onDragStart={(e) => handleTaskDragStart(e, index, boardId)}
      onDragEnd={handleTaskDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => {
        e.preventDefault();
        handleTaskDragEnter(e, index, boardId);
      }}
    >
      <h4 className={styles.taskTitle}>{task.title}</h4>
      
      <p className={styles.taskDescription}>
        {task.description}
      </p>
      
      <div className={styles.taskMetadata}>
        <span className={`${styles.priorityBadge} ${getPriorityBadgeStyle(task.priority)}`}>
          {task.priority}
        </span>
        
        {task.dueDate && (
          <span className={styles.dueDate}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      
      {task.assignedTo && task.assignedTo.length > 0 && (
        <div className={styles.taskAssignees}>
          {task.assignedTo.map(userId => {
            const member = getMemberById(userId);
            return member ? (
              <img
                key={userId}
                src={member.avatar}
                alt={member.name}
                title={member.name}
                className={styles.assigneeAvatar}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default Task;