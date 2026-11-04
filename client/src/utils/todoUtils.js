export const getPriorityClass = (priority) => {
  switch (priority) {
    case "high":
      return "priority-high";
    case "medium":
      return "priority-medium";
    case "low":
      return "priority-low";
    default:
      return "";
  }
};

export const getUserInitial = (name) => {
  if (!name) {
    return "U";
  }

  return name.charAt(0).toUpperCase();
};