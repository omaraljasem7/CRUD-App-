const titleInput= document.getElementById('title');
const authorInput= document.getElementById('author');
const pagesInput=document.getElementById('pages');
const priceInput=document.getElementById('price');
const saveBtn= document.getElementById('save-btn');
const cancelBtn=document.getElementById('cancel-btn');
const errorDiv = document.getElementById("error-message");

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
}

cancelBtn.addEventListener('click',()=>{
    window.location.href='index.html';
});
function addBook(){
    errorDiv.style.display = "none";
    const title=titleInput.value;
    const author=authorInput.value;
    const pages=parseInt(pagesInput.value);
    const price = parseFloat(priceInput.value);
    if (!title || !author || !pagesInput.value || !priceInput.value) {
        showError("Please fill in all fields");
        return;
    }
    if(pages <=0 || price <= 0){
        showError("price field or pages filed can not be <=0 ");
        return;
    }
    fetch("http://localhost:3000/books",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({title,author,pages,price})
    })
        .then((response) => {
            if(!response.ok){
                return response.json().then((err) => {
                    throw new Error(err.error);
                })
            }
            return  response.json();
        })

        .then((data)=>{
            window.location.href="index.html"
        })
        .catch(error => {
            showError(error.message);
        })
}
saveBtn.addEventListener('click',()=>{
    addBook();
})
