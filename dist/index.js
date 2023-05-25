"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
function handleRoot(req, res) {
    return res.send("Hello World!");
}
const tasks = [
    {
        id: "1",
        description: "Drink water",
        completed: false,
    },
    {
        id: "2",
        description: "Eat food",
        completed: true,
    },
];
app.get("/", handleRoot);
app.get("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield prisma.task.findMany();
    res.send(tasks);
}));
app.patch("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;
    if (!(body.completed !== undefined &&
        typeof body.completed === "boolean")) {
        return res
            .status(400)
            .send("completed is required and should be a boolean");
    }
    const completed = body.completed;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].completed = completed;
            return res.send(tasks[i]);
        }
    }
    // handle unkonwn id
    return res
        .status(404)
        .send("No task with the given id was found");
});
app.post("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // extract the new task from the request body.
    const newTask = req.body;
    // first check if all the required properties are sent in the request body.
    if (!(newTask.id &&
        typeof newTask.id === "string")) {
        return res
            .status(400)
            .send("id is required and should be a string");
    }
    if (!(newTask.description &&
        typeof newTask.description === "string")) {
        return res
            .status(400)
            .send("description is required and should be a string");
    }
    if (!(newTask.completed !== undefined && typeof newTask.completed === "boolean")) {
        return res
            .status(400)
            .send("completed is required and should be a boolean");
    }
    for (const task of tasks) {
        if (task.id === newTask.id) {
            return res
                .status(400)
                .send("Another task with the same id already exists");
        }
    }
    // Another check could be that only these three properties are sent in the request body. Any other property should not be allowed.
    // extract the properties of the new task.
    const { id, description, completed, } = newTask;
    // add the new task to the tasks array.
    const t = yield prisma.task.create({
        data: {
            id,
            description,
            completed,
        }
    });
    tasks.push(t);
    console.log(newTask);
    res.send(t);
}));
app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});
