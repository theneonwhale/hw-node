const fs = require('fs/promises');
const path = require('path');

const { customAlphabet } = require('nanoid');
const numbers = require('nanoid-dictionary/numbers');
const nanoid = customAlphabet(numbers, 5);

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function getContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf8');
    const contacts = JSON.parse(data);

    return contacts;
  } catch (error) {
    console.error(error.message);
  }
}

async function listContacts() {
  try {
    const contacts = await getContacts();

    console.log(`Contact list was found.`);
    console.table(contacts);

    return contacts;
  } catch (error) {
    console.error(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await getContacts();
    const contact = contacts.find(({ id }) => id === contactId);

    if (contact === undefined) {
      console.error(`There is no contact with ${contactId}.`);
      return;
    }

    console.log(`Contact with id ${contactId} was found.`);
    console.log(contact);

    return contact;
  } catch (error) {
    console.error(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await getContacts();
    const contactsNew = contacts.filter(({ id }) => id !== contactId);

    if (contacts.length === contactsNew.length) {
      console.error(`There is no contact with id ${contactId}.`);
      return;
    }

    await fs.writeFile(
      contactsPath,
      JSON.stringify(contactsNew, null, 2),
      'utf8',
    );

    console.log(`Contact with id ${contactId} was deleted.`);
    console.table(contactsNew);
  } catch (error) {
    console.error(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await getContacts();

    if (
      contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      console.log(`Contact with name ${name} already exists.`);
      return;
    }

    if (contacts.find(contact => contact.email === email)) {
      console.log(`Contact with email ${email} already exists.`);
      return;
    }

    if (contacts.find(contact => contact.phone === phone)) {
      console.log(`Contact with phone ${phone} already exists.`);
      return;
    }

    const contact = { id: nanoid(numbers, 2), name, email, phone };
    const contactsNew = [...contacts, contact];

    await fs.writeFile(
      contactsPath,
      JSON.stringify(contactsNew, null, 2),
      'utf8',
    );

    console.log('New contact was added.');
    console.table(contactsNew);
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
