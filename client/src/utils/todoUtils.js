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
    if (typeof name !== "string" || !name.trim()) {
        return "U";
    }

    return name.trim().charAt(0).toUpperCase();
};