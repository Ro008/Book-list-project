// UI DOM elements
const form = document.querySelector('#book-form');
const list = document.querySelector('#book-list');

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    
    addBookToList(book) {
        // create tr element
        const row = document.createElement('tr');

        // insert columns
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
    }

    showAlert(message, className) {
        // create a div
        const div = document.createElement('div');
        // add the classes
        div.className = `alert ${className}`;
        // add text
        div.appendChild(document.createTextNode(message));
        // get the parent
        const container = document.querySelector('.container');
        // insert alert
        container.insertBefore(div, form); 

        // timeout after 3 sec
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000)
    }

    deleteBook(target) {
        if(target.className === 'delete') {
            target.parentElement.parentElement.remove();
            // show message when clicked on delete
            this.showAlert('Book removed!', 'success');
        }
    }

    clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#ISBN').value = '';
    }

}

// local storage class
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

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(function(book) {
            const ui = new UI;
            // add book to UI
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach(function(book, index) {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }

}

// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event listener for add book
form.addEventListener('submit', function(e) {
    // get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#ISBN').value;
    
    // instantiate a book
    const book = new Book(title, author, isbn);

    // instantiate a UI object
    const ui = new UI();
    
    // validate
    if(title === '' || author === '' || isbn === '') {
        // error alert
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        
        // add book to list
        ui.addBookToList(book);

        // add lo local storage
        Store.addBook(book);

        // show message of book added
        ui.showAlert('Book added!', 'success');
        
        //clear fields
        ui.clearFields();
    }

    e.preventDefault();
});

// event listener for delete
list.addEventListener('click', function(e) {
    
    // instantiate a UI object
    const ui = new UI();
    
    // delete the book    
    ui.deleteBook(e.target);

    // remove from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    e.preventDefault();
});
