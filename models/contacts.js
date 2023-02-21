const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "/contacts.json");

const listContacts = async () => {
  try {
    const contactsData = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(contactsData);
  } catch (error) {
    return { error };
  }
};

const getContactById = async (contactId) => {
  const contactsList = await listContacts();

  const contact = contactsList.find(
    (contact) => contact.id === contactId.toString()
  );
  return contact;
};

const addContact = async ({ name, email, phone }) => {
  const contactList = await listContacts();
  const newContact = {
    id: (contactList.length + 1).toString(),
    name,
    email,
    phone,
  };
  contactList.push(newContact);
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contactList), "utf8");
    return newContact;
  } catch (error) {
    return { error };
  }
};

const removeContact = async (contactId) => {
  const contactList = await listContacts();
  const idx = contactList.findIndex(
    (contact) => contact.id === contactId.toString()
  );

  if (idx === -1) {
    return null;
  }

  contactList.splice(idx, 1);

  try {
    await fs.writeFile(contactsPath, JSON.stringify(contactList), "utf8");
    return { message: "contact deleted" };
  } catch (error) {
    return { error };
  }
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex(
    (contact) => contact.id === contactId.toString()
  );

  if (idx === -1) {
    return null;
  }
  const prevContact = await getContactById(contactId);
  const updatedContact = { ...prevContact, ...body };

  contacts.splice(idx, 1, updatedContact);

  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts), "utf8");
    return updatedContact;
  } catch (error) {
    return { error };
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
