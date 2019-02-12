const moment = require("moment");

const db = require("./data/db.js");

const express = require("express");

const server = express();

// middleware
server.use(express.json());
// tells express how to parse json into a javascript object

server.listen(4000, () => {
  console.log("\n Running on port 4000\n");
});

server.get("/", (req, res) => {
  res.send(moment().format("MMMM Do YYYY, h:mm:ss a"));
});

server.get("/hubs", (req, res) => {
  db.hubs
    .find()
    .then(hubs => {
      res.status(200).json({ success: true, hubs });
    })
    .catch(err => {
      res.status(err.code).json({ success: false, message: err.message });
    });
});

server.post("/hubs", (req, res) => {
  const hub = req.body;
  db.hubs
    .add(hub)
    .then(hub => {
      res.status(201).json({ success: true, hub });
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
});

server.delete("/hubs/:id", (req, res) => {
  const hubId = req.params.id;
  db.hubs
    .remove(hubId)
    .then(deleted => {
      res.status(204).end();
    })
    .catch(({ code, message }) => {
        res.status(code).json({ success: false, message });
      })
    );
});

server.put("/hubs/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  db.hubs
    .update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res
          .status(404)
          .json({
            success: false,
            message: "I cannot find the Hub you are looking to update."
          });
      }
    })
    .catch(({ code, message }) => {
      res.status(code).json({ success: false, message });
    });
});
