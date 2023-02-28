const express = require("express");
const controllers = require("../../controllers/contactsControllers");

const { validateBody, isValidId } = require("../../middlewares");

const { schemas } = require("../../models/contact");
const router = express.Router();

// GET all contacts
router.get("/", controllers.getAll);

// GET contact byID
router.get("/:contactId", isValidId, controllers.getById);

// Add contact
router.post("/", validateBody(schemas.addSchema), controllers.add);

// Delete contact
router.delete("/:contactId", isValidId, controllers.deleteById);

// Update contact

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.addSchema),
  controllers.updateById
);

// Update favorite

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  controllers.updateFavorite
);

module.exports = router;
