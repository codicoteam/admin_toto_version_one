import { notification } from "antd";

export const showMessage = (type, content) => {
  if (["success", "info", "warning", "error"].includes(type)) {
    notification[type]({
      message: type === "success" ? "Success" : "Error",
      description: content,
      placement: "topRight",
    });
  } else {
    console.error("Invalid notification type:", type);
  }
};
