document.addEventListener('DOMContentLoaded', () => {
    const addUserForm = document.getElementById('addUserForm');
  
    addUserForm.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevenir el comportamiento por defecto
  
      const name = document.getElementById('userName').value;
      const email = document.getElementById('userEmail').value;
      const phone = document.getElementById('userPhone').value;
      const address = document.getElementById('userAddress').value;
  
      const userData = { name, email, phone, address };
  
      try {
        const response = await fetch('/add-user', {  // Cambié la ruta a '/add-user'
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert('Usuario creado exitosamente: ' + result.message);
        } else {
          alert('Error al crear el usuario: ' + result.message);
        }
      } catch (err) {
        console.error('Error al crear el usuario:', err);
        alert('Hubo un error al crear el usuario.');
      }
    });
  });
  