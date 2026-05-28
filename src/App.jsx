import { useState } from "react";
import "./App.css";
import { validateForm } from "./validators";
import { Toaster } from "./Toaster";

function App() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    city: "",
    zipcode: "",
  });
  const [errors, setErrors] = useState({});
  const [toaster, setToaster] = useState({
    message: "",
    type: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const closeToaster = () => {
    setToaster({ message: "", type: "" });
  };

  const isFormValid = () => {
    return (
      values.firstName.trim() &&
      values.lastName.trim() &&
      values.email.trim() &&
      values.birthdate.trim() &&
      values.city.trim() &&
      values.zipcode.trim()
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      localStorage.setItem("registration", JSON.stringify(values));
      setToaster({
        message: "Inscription enregistrée avec succès",
        type: "success",
      });
      setValues({
        firstName: "",
        lastName: "",
        email: "",
        birthdate: "",
        city: "",
        zipcode: "",
      });
    } else {
      setToaster({
        message: "Veuillez corriger les erreurs du formulaire",
        type: "error",
      });
    }
  };

  return (
    <div>
      <h1>Formulaire d'inscription</h1>
      <form onSubmit={handleSubmit} data-testid="registration-form">
        <div>
          <label htmlFor="firstName">Prénom</label>
          <input
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            data-testid="firstName"
          />
          {errors.firstName && (
            <span className="error">{errors.firstName}</span>
          )}
        </div>

        <div>
          <label htmlFor="lastName">Nom</label>
          <input
            id="lastName"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            data-testid="lastName"
          />
          {errors.lastName && (
            <span className="error">{errors.lastName}</span>
          )}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            data-testid="email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div>
          <label htmlFor="birthdate">Date de naissance</label>
          <input
            id="birthdate"
            name="birthdate"
            type="date"
            value={values.birthdate}
            onChange={handleChange}
            data-testid="birthdate"
          />
          {errors.birthdate && (
            <span className="error">{errors.birthdate}</span>
          )}
        </div>

        <div>
          <label htmlFor="city">Ville</label>
          <input
            id="city"
            name="city"
            value={values.city}
            onChange={handleChange}
            data-testid="city"
          />
          {errors.city && <span className="error">{errors.city}</span>}
        </div>

        <div>
          <label htmlFor="zipcode">Code postal</label>
          <input
            id="zipcode"
            name="zipcode"
            value={values.zipcode}
            onChange={handleChange}
            data-testid="zipcode"
          />
          {errors.zipcode && (
            <span className="error">{errors.zipcode}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid()}
          data-testid="submit-button"
        >
          Envoyer
        </button>

        <Toaster
          message={toaster.message}
          type={toaster.type}
          onClose={closeToaster}
        />
      </form>
    </div>
  );
}

export default App;
