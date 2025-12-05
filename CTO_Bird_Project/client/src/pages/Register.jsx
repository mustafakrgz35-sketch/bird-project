// client/src/pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      // Backend'deki kayıt rotasına istek atıyoruz
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
      });
      // Kayıt başarılıysa giriş sayfasına yönlendir
      res.data && navigate("/login");
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Kayıt Ol</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Kullanıcı Adı</label>
        <input
          type="text"
          placeholder="Kullanıcı adınızı girin..."
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Şifre</label>
        <input
          type="password"
          placeholder="Şifrenizi girin..."
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="auth-button" type="submit">Kayıt Ol</button>
      </form>
      {error && <span style={{color:"red", marginTop:"10px"}}>Bir şeyler ters gitti! (Kullanıcı adı alınmış olabilir)</span>}
      <p>Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link></p>
    </div>
  );
}