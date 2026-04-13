import { createRoot } from 'react-dom/client';
import './index.css';

const root = document.getElementById('root');
if (root) {
  root.innerHTML = '<div style="background:red;color:white;padding:24px;font-size:24px">React montou</div>';
  createRoot(root).render(
    <div style={{ background: '#111', color: 'white', padding: 24, minHeight: '100vh' }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>✓ React funcionando</h1>
      <p>Se você está vendo isso, o JS carregou.</p>
    </div>
  );
} else {
  document.body.innerHTML = '<div style="background:red;color:white;padding:24px">ERRO: #root não encontrado</div>';
}
