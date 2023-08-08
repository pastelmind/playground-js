import express from "express";

const router = express.Router();
const todoItems: string[] = [];

const getRenderOptions = () => {
  return { items: todoItems.map((text) => ({ text })) };
};

router.get("/", (req, res) => {
  res.render("todo", getRenderOptions());
});

router.post("/", (req, res) => {
  const { delete: itemToDeleteStr, todo_text: todoText } = req.body;

  if (itemToDeleteStr !== undefined) {
    const itemToDelete = Number(itemToDeleteStr);
    if (Number.isSafeInteger(itemToDelete)) {
      todoItems.splice(itemToDelete, 1);
    }
  }

  if (todoText) {
    todoItems.push(todoText);
  }

  res.redirect(303, req.baseUrl);
});

export default router;
