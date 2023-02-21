const express = require("express");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

// GET all contacts
router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  if (contacts.error) {
    res.status(500).json(contacts);
    return;
  }
  res.status(200).json(contacts);
});

// GET contact byID
router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.status(200).json({ contact });
});

// Add contact
router.post("/", async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    phone: Joi.string().min(7).max(20).required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    if (error.details[0].type === "any.required") {
      res.status(400).json({ message: "missing required name field" });
      return;
    }

    res.status(400).json({ error: error.details });
    return;
  }

  const newContact = await addContact(req.body);
  if (newContact.error) {
    res.status(500).json(newContact);
    return;
  }
  res.status(201).json(newContact);
});

// Delete contact
router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const response = await removeContact(contactId);
  if (!response) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  if (response.error) {
    res.status(500).json(response);
    return;
  }

  res.status(200).json(response);
});

// Update contact

router.put("/:contactId", async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .optional(),
    phone: Joi.string().min(7).max(20).optional(),
  });
  const { error, value } = schema.validate(req.body);

  if (error) {
    res.status(400).json({ error: error.details });
    return;
  }
  if (Object.keys(value).length === 0) {
    res.status(400).json({ message: "missing fields" });
    return;
  }

  const { contactId } = req.params;
  const response = await updateContact(contactId, value);

  if (!response) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.status(200).json(response);
});

module.exports = router;
