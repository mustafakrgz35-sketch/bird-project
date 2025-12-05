// client/src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Centrala Kuş Gözlem Ağına Hoşgeldiniz (CTO)</h1>
      <p>Doğayı keşfedin ve gözlemlerinizi paylaşın.</p>
      
      <div style={{ marginTop: "20px" }}>
        <Link to="/register" style={{ marginRight: "20px" }}>
          <button>Kayıt Ol</button>
        </Link>
        <Link to="/login">
          <button>Giriş Yap</button>
        </Link>
      </div>
    </div>
  );
}