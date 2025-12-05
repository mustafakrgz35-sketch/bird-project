// client/src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend'deki giriş rotasına istek atıyoruz
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      // Giriş başarılıysa konsola yaz ve ana sayfaya yönlendir
      console.log("Giriş Başarılı:", res.data);
      navigate("/"); 
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="auth-container">
      <h2>Giriş Yap</h2>
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
        <button className="auth-button" type="submit">Giriş Yap</button>
      </form>
      {error && <span style={{color:"red", marginTop:"10px"}}>Giriş başarısız! Kullanıcı adı veya şifre yanlış.</span>}
      <p>Hesabın yok mu? <Link to="/register">Kayıt Ol</Link></p>
    </div>
  );
}