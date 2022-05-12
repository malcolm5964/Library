//Book class
class Book {
    constructor(title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
    }
}

//UI Class: Handle UI Task
class UI {
    static displayBooks() {
  
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector(".book-list");
        const row = document.createElement('tr')

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.pages}</td>
        <td><a class="delete-btn">X</a></td>
        `;

        list.appendChild(row)
    }
    
    static deleteBook(el) {
        el.parentElement.parentElement.remove();
    }

    static showAlert (message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.main');
        const form = document.querySelector('.book-form');
        container.insertBefore(div, form);
        //Vanish
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#pages').value = "";
    }
}



//Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(newBook) {
        const books = Store.getBooks();
        books.push(newBook);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(title) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.title === title) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}



//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

//Event: Add a Book
document.querySelector('.book-form').addEventListener('submit', e => {
    //Prevent form default actual submit
    e.preventDefault();
    
    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;

    //Validate
    if(title === "" || author === "" || pages === "") {
        UI.showAlert('Please fill in all fields', "red");

    } else {
            //instatitate new book
            let newBook = new Book(title, author, pages);
    
            //Add Book to UI
            UI.addBookToList(newBook);

            //Add book to storage
            Store.addBook(newBook);

            //Show success message
            UI.showAlert('Book Added!', "green");

            //Clear fields
            UI.clearFields();
    }


})

//Event: Remove a Book 
document.querySelector('.book-list').addEventListener('click', e => {
    if((e.target).classList.contains('delete-btn')) {

    //Remove book from UI 
    UI.deleteBook(e.target);

    //Remove book from storage
    Store.removeBook(e.target.parentElement.parentElement.firstElementChild.textContent);

    //Show book delete
    UI.showAlert('Book Deleted!', "green");
    } 

});