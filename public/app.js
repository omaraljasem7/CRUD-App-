const bookList=document.getElementById("book-list");
const prevBtn=document.getElementById('prev-btn');
const nextBtn=document.getElementById('next-btn');
const pageInfo= document.getElementById('page-info');
const addBtn= document.getElementById('add-btn');

//logout Button

const logoutBtn=document.getElementById('logout-btn');
const token = localStorage.getItem('token');
if(!token){
    window.location.href='login.html';
}

let currentPage=1;
let limit = 2;

//console.log(bookList);
// without pagination
/*
function getAllBooks(){
    fetch('http://localhost:3000/books')
        .then((response) => {
            return response.json();
        })
        .then((books) => {
            bookList.innerHTML="";
            books.forEach(book => {
                const li=document.createElement("li");
                li.textContent=`Title: ${book.title}  - Author: ${book.author} - Price: ${book.price}  `;
                bookList.appendChild(li);
            })
        })
}

*/

function getAllBooks(){
    fetch(`http://localhost:3000/pagination?page=${currentPage}&limit=${limit}`)
        .then ((response)=>{
        return response.json();
    })
        .then((data) =>{
            bookList.innerHTML ="";
            data.books.forEach((book)=>{
                const li=document.createElement("li");
                li.textContent=`Title: ${book.title}  - Author: ${book.author} - Price: ${book.price} -Pages:${book.pages} `;

                // delete Button
                const deleteBtn=document.createElement("button");
                deleteBtn.textContent='Delete';
                deleteBtn.dataset.id=book._id;
                deleteBtn.dataset.action="delete";
                deleteBtn.className="delete-btn";

                const editBtn=document.createElement("button");
                editBtn.textContent='Edit';
                editBtn.dataset.id=book._id;
                editBtn.dataset.action="edit";
                editBtn.className="edit-btn";
                const btnContainer=document.createElement("div");
                btnContainer.appendChild(deleteBtn);
                btnContainer.appendChild(editBtn);

                li.appendChild(btnContainer);
                bookList.appendChild(li);
            });
            pageInfo.textContent=`Page ${currentPage}`;
            prevBtn.disabled= currentPage===1;
            nextBtn.disabled=data.books.length <limit;

        })
}
function deleteBook(id){
    fetch(`http://localhost:3000/books/${id}`,{
        method:'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(response => {
            return response.json();
        })
        .then((data)=>{
            if(currentPage > 1 ){
                const remainingBooks = document.querySelectorAll('#book-list li').length - 1;
                if(remainingBooks===0){
                    currentPage = currentPage -1;
                }
            }
            getAllBooks();
        })
}
bookList.addEventListener('click',(event)=>{

    /*
    if(event.target.dataset.id){
        const id = event.target.dataset.id;
        deleteBook(id);
    }
    */
    const id=event.target.dataset.id;
    const action=event.target.dataset.action;
    if(action==="delete"){
        deleteBook(id);
    }
    if(action==="edit"){
        window.location.href=`edit.html?id=${id}`;
    }
})
nextBtn.addEventListener('click',()=> {
    currentPage=currentPage+1;
    getAllBooks();
})
prevBtn.addEventListener('click',()=> {
    if(currentPage > 1 ){
        currentPage=currentPage-1;
        getAllBooks();
    }
});

// Event on Btn to redirect to a new Page
addBtn.addEventListener('click' , () => {
    window.location.href="add.html";
})
// when you logout delete token from localstorage
logoutBtn.addEventListener('click',() => {
    localStorage.removeItem('token');
    window.location.href='login.html';
})
getAllBooks();
