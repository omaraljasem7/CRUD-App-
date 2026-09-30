const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const pagesInput = document.getElementById("pages");
const priceInput = document.getElementById("price");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const errorDiv = document.getElementById("error-message");

// Auth Guard
const token = localStorage.getItem('token');
if(!token){
    window.location.href='login.html';
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
}
if(!id) {
    showError("Please enter a valid id");
    saveBtn.disabled=true;
}
else{
    loadBook();
}
function loadBook() {
    fetch(`http://localhost:3000/books/${id}`)
        .then((response) => {
            if(!response.ok){
                throw new Error("Book not found");
            }
            return response.json();
        })
        .then((book) => {
            //console.log(book);
            //console.log(("book " +book.title+book.author+book.pages));
            titleInput.value = book.title ;
            authorInput.value = book.author ;
            pagesInput.value = book.pages ;
            priceInput.value = book.price ;
        })
        .catch((error) => {
            showError(error.message);
            saveBtn.disabled=true;
        })
}

function updateBook() {
    errorDiv.style.display = "none";
    const title = titleInput.value;
    const author = authorInput.value;
    const pages = parseInt(pagesInput.value);
    const price = parseFloat(priceInput.value);
    if (!title || !author || !pagesInput.value || !priceInput.value) {
        showError("Please fill in all fields");
        return;
    }
    fetch(`http://localhost:3000/books/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, author, pages, price })
    })
        .then((response) => {
            if(!response.ok){
                return response.json().then((err) => {
                    throw new Error(err.error);
                })
            }
            return response.json();
        })
        .then((data) => {
            window.location.href = "index.html";
        })
        .catch(error => {
            showError(error.message);
        })
}

saveBtn.addEventListener("click", () => {
    updateBook();
})
cancelBtn.addEventListener("click", () => {
    window.location.href="index.html";
})


