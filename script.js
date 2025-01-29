const API_URL = 'https://catscrudrender.onrender.com';

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = false; // Set this to false since we're making cross-origin requests
// Fetch all cats
async function fetchCats() {
    try {
        const response = await axios.get('/cats/');
        displayCats(response.data);
    } catch (error) {
        console.error('Error fetching cats:', error);
        alert('Error fetching cats: ' + (error.response?.data?.detail || error.message));
    }
}

axios.interceptors.response.use(
    response => response,
    error => {
        console.error('Request Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Display cats in table
function displayCats(cats) {
    const tableBody = document.getElementById('catsTableBody');
    tableBody.innerHTML = '';

    cats.forEach(cat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cat.id}</td>
            <td>${cat.name}</td>
            <td>${cat.breed}</td>
            <td>${cat.age}</td>
            <td>${cat.weight}</td>
            <td>
                <button onclick="openEditModal(${JSON.stringify(cat).replace(/"/g, '&quot;')})"
                    class="btn-edit">Edit</button>
                <button onclick="deleteCat(${cat.id})"
                    class="btn-delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Add new cat
document.getElementById('addCatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const catData = {
        name: formData.get('name'),
        breed: formData.get('breed'),
        age: parseFloat(formData.get('age')),
        weight: parseFloat(formData.get('weight'))
    };

    try {
        await axios.post('/cats/', catData);
        e.target.reset();
        fetchCats();
    } catch (error) {
        console.error('Error adding cat:', error);
        alert('Error adding cat: ' + (error.response?.data?.detail || error.message));
    }
});

// Delete cat
async function deleteCat(id) {
    if (confirm('Are you sure you want to delete this cat?')) {
        try {
            await axios.delete(`/cats/${id}`);
            fetchCats();
        } catch (error) {
            console.error('Error deleting cat:', error);
            alert('Error deleting cat: ' + (error.response?.data?.detail || error.message));
        }
    }
}

// Edit cat modal functions
function openEditModal(cat) {
    const modal = document.getElementById('editModal');
    modal.style.display = 'block';  // Use style.display instead of classList
    
    // Fill in the form fields
    document.getElementById('editCatId').value = cat.id;
    document.getElementById('editName').value = cat.name;
    document.getElementById('editBreed').value = cat.breed;
    document.getElementById('editAge').value = cat.age;
    document.getElementById('editWeight').value = cat.weight;
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';  // Use style.display instead of classList
}

// Add click outside modal to close
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
}

// Edit cat form submission
document.getElementById('editCatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editCatId').value;
    const catData = {
        name: document.getElementById('editName').value,
        breed: document.getElementById('editBreed').value,
        age: parseFloat(document.getElementById('editAge').value),
        weight: parseFloat(document.getElementById('editWeight').value)
    };

    try {
        await axios.put(`/cats/${id}`, catData);
        closeEditModal();
        fetchCats();
    } catch (error) {
        console.error('Error updating cat:', error);
        alert('Error updating cat: ' + (error.response?.data?.detail || error.message));
    }
});

// Initial load
fetchCats();