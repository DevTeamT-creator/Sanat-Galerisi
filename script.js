let isAdmin = false;

function showAdminLogin() {
    document.getElementById('admin-login').style.display = 'block';
}

function loginAdmin(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    if (password === 'admin123') {
        isAdmin = true;
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('upload-section').style.display = 'block';
    } else {
        alert('Yanlış şifre!');
    }
}

document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const container = document.getElementById('images-container');
            const frame = document.createElement('div');
            frame.className = 'image-frame';

            const img = document.createElement('img');
            img.src = e.target.result;
            frame.appendChild(img);

            const downloadLink = document.createElement('a');
            downloadLink.href = e.target.result;
            downloadLink.download = file.name;
            downloadLink.innerText = 'İndir';
            frame.appendChild(downloadLink);

            if (isAdmin) {
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Sil';
                deleteButton.onclick = () => confirmDelete(frame, file.name);
                frame.appendChild(deleteButton);
            }

            container.appendChild(frame);
            saveImage(file.name, e.target.result);
        };
        reader.readAsDataURL(file);

        document.getElementById('upload-response').innerText = 'Dosya başarıyla yüklendi!';
    } else {
        document.getElementById('upload-response').innerText = 'Lütfen bir dosya seçin.';
    }
});

function saveImage(name, data) {
    let images = JSON.parse(localStorage.getItem('images')) || [];
    images.push({ name: name, data: data });
    localStorage.setItem('images', JSON.stringify(images));
}

function loadImages() {
    const images = JSON.parse(localStorage.getItem('images')) || [];
    const container = document.getElementById('images-container');
    container.innerHTML = '';

    images.forEach(image => {
        const frame = document.createElement('div');
        frame.className = 'image-frame';

        const img = document.createElement('img');
        img.src = image.data;
        frame.appendChild(img);

        const downloadLink = document.createElement('a');
        downloadLink.href = image.data;
        downloadLink.download = image.name;
        downloadLink.innerText = 'İndir';
        frame.appendChild(downloadLink);

        if (isAdmin) {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Sil';
            deleteButton.onclick = () => confirmDelete(frame, image.name);
            frame.appendChild(deleteButton);
        }

        container.appendChild(frame);
    });
}

function confirmDelete(frame, name) {
    if (confirm('Silmek istediğinizden emin misiniz?')) {
        frame.remove();
        deleteImage(name);
    }
}

function deleteImage(name) {
    let images = JSON.parse(localStorage.getItem('images')) || [];
    images = images.filter(image => image.name !== name);
    localStorage.setItem('images', JSON.stringify(images));
}

window.onload = loadImages;