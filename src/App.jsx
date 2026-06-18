import { useState, useEffect } from "react";
import "./App.css";
import { validateForm } from "./validators";
import { Toaster } from "./Toaster";
import UserCount from "./UserCount";
import { syncUser, loginAdmin, getUsers, deleteUser } from "./api";

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
  const [toaster, setToaster] = useState({ message: "", type: "" });
  
  // Login state
  const [loginForm, setLoginForm] = useState({ pseudo: "", password: "" });
  const [role, setRole] = useState(null); // 'casu' or 'admin'
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Users list state
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      try {
        await syncUser(values);
        setToaster({
          message: "Inscription enregistrée avec succès",
          type: "success",
        });
        setValues({
          firstName: "", lastName: "", email: "", birthdate: "", city: "", zipcode: "",
        });
        fetchUsers(); // Refresh list
      } catch (err) {
        setToaster({
          message: "Erreur lors de l'enregistrement en base de données",
          type: "error",
        });
      }
    } else {
      setToaster({
        message: "Veuillez corriger les erreurs du formulaire",
        type: "error",
      });
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await loginAdmin(loginForm.pseudo, loginForm.password);
      setRole(res.role);
      setIsLoginModalOpen(false);
      setToaster({ message: "Connexion réussie", type: "success" });
    } catch (err) {
      setToaster({ message: "Identifiants invalides", type: "error" });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setToaster({ message: "Utilisateur supprimé", type: "success" });
      fetchUsers();
    } catch (err) {
      setToaster({ message: "Erreur lors de la suppression", type: "error" });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <UserCount usersCount={users.length} />
        <div>
          {role ? (
            <span style={{ fontWeight: "bold" }}>Connecté en tant que: {role}</span>
          ) : (
            <button onClick={() => setIsLoginModalOpen(true)}>Se connecter</button>
          )}
        </div>
      </div>

      {isLoginModalOpen && (
        <div className="modal" style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
          <h3>Connexion</h3>
          <form onSubmit={handleLogin}>
            <input name="pseudo" placeholder="Email / Pseudo" value={loginForm.pseudo} onChange={handleLoginChange} required />
            <input name="password" type="password" placeholder="Mot de passe" value={loginForm.password} onChange={handleLoginChange} required />
            <button type="submit">Valider</button>
            <button type="button" onClick={() => setIsLoginModalOpen(false)}>Fermer</button>
          </form>
        </div>
      )}

      <h1>Formulaire d'inscription</h1>
      <form onSubmit={handleSubmit} data-testid="registration-form">
        <div>
          <label htmlFor="firstName">Prénom</label>
          <input id="firstName" name="firstName" value={values.firstName} onChange={handleChange} data-testid="firstName" />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>
        <div>
          <label htmlFor="lastName">Nom</label>
          <input id="lastName" name="lastName" value={values.lastName} onChange={handleChange} data-testid="lastName" />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={values.email} onChange={handleChange} data-testid="email" />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="birthdate">Date de naissance</label>
          <input id="birthdate" name="birthdate" type="date" value={values.birthdate} onChange={handleChange} data-testid="birthdate" />
          {errors.birthdate && <span className="error">{errors.birthdate}</span>}
        </div>
        <div>
          <label htmlFor="city">Ville</label>
          <input id="city" name="city" value={values.city} onChange={handleChange} data-testid="city" />
          {errors.city && <span className="error">{errors.city}</span>}
        </div>
        <div>
          <label htmlFor="zipcode">Code postal</label>
          <input id="zipcode" name="zipcode" value={values.zipcode} onChange={handleChange} data-testid="zipcode" />
          {errors.zipcode && <span className="error">{errors.zipcode}</span>}
        </div>
        <button type="submit" disabled={!isFormValid()} data-testid="submit-button" data-cy="btn-sync">
          Envoyer / Synchroniser
        </button>

        <Toaster message={toaster.message} type={toaster.type} onClose={closeToaster} />
      </form>

      <h2>Liste des utilisateurs</h2>
      <ul style={{ textAlign: "left" }}>
        {users.map(u => (
          <li key={u.id} style={{ marginBottom: "10px" }}>
            <strong>{u.prenom} {u.nom}</strong> 
            {role === "admin" && (
              <>
                <span> - {u.email} - {u.date_naissance} - {u.ville} ({u.code_postal})</span>
                <button onClick={() => handleDeleteUser(u.id)} style={{ marginLeft: "10px", color: "red" }}>Supprimer</button>
              </>
            )}
          </li>
        ))}
      </ul>
      
      {users.length === 0 && <p>Aucun utilisateur enregistré.</p>}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="https://github.com/SoulSkunk/kylian_package_clean#readme" target="_blank" rel="noreferrer" style={{ color: '#007BFF', textDecoration: 'none', fontSize: '14px' }}>
          Consulter la documentation (README)
        </a>
      </div>
    </div>
  );
}

export default App;
