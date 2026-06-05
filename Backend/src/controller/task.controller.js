import { Task } from "../model/task.model.js";
import { isValidObjectId } from "mongoose";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const allowedStatuses = ["pending", "completed"];

const getTaskForUser = async (taskId, userId) => {
  if (!isValidObjectId(taskId)) {
    throw new ApiError(400, "Invalid task id...");
  }

  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) {
    throw new ApiError(404, "Task not found...");
  }

  return task;
};

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;

  if (!title?.trim()) {
    throw new ApiError(400, "Task title is required...");
  }

  if (status && !allowedStatuses.includes(status)) {
    throw new ApiError(400, "Task status must be pending or completed...");
  }

  const task = await Task.create({
    title: title.trim(),
    description: description?.trim() || "",
    status: status || "pending",
    userId: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { task }, "Task created successfully..."));
});

const getTasks = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { userId: req.user._id };

  if (status) {
    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, "Task status must be pending or completed...");
    }

    filter.status = status;
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { tasks }, "Tasks fetched successfully..."));
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await getTaskForUser(req.params.taskId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, { task }, "Task fetched successfully..."));
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const task = await getTaskForUser(req.params.taskId, req.user._id);

  if (title !== undefined) {
    if (!title.trim()) {
      throw new ApiError(400, "Task title cannot be empty...");
    }

    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description = description.trim();
  }

  if (status !== undefined) {
    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, "Task status must be pending or completed...");
    }

    task.status = status;
  }

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { task }, "Task updated successfully..."));
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await getTaskForUser(req.params.taskId, req.user._id);
  await task.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully..."));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Task status must be pending or completed...");
  }

  const task = await getTaskForUser(req.params.taskId, req.user._id);
  task.status = status;
  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { task }, "Task status updated successfully..."));
});

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
