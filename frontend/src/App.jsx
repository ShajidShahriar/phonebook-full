import { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";
import Notification from "./components/Notification";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");

  const [newNumber, setNewnumber] = useState("");

  const [search, setSearch] = useState("");
  // Rename this from successMessage to just 'message' so it's less confusing
  const [message, setMessage] = useState(null);
  // New state to track if it's 'success' or 'error'
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);
  console.log("render", persons.length, "persons");

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((p) => p.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        const changedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(existingPerson.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson,
              ),
            );
          })
          .catch((error) => {
            setMessageType('error')
            setMessage(
              `${newName} was already removed from server`,
            );
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          });
      }
      return; // Stop the create function
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewnumber("");
        setMessageType('success')
        setMessage(`added ${returnedPerson.name} successfully`);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      })
      .catch((error) => {
        alert("server exploded ! try again later ");
      });
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((n) => n.id !== id));
        })
        .catch((error) => {
          alert(`The person '${person.name}' was already deleted from server`);
          // Optional: clear them from UI anyway since they are gone
          setPersons(persons.filter((n) => n.id !== id));
        });
    }
  };

  const personsToShow =
    search === ""
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        );
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewnumber(event.target.value);
  };

  return (
    <div>
      <h2>Search person</h2>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      Search: <input value={search} onChange={handleSearchChange} />
    </div>
  );
};

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  handleNumberChange,
  newNumber,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <ul>
      {personsToShow.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </p>
      ))}
    </ul>
  );
};
export default App;
