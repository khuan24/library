// const bookDisplay = document.querySelector(".display")

// const myLibrary = []
// let idCount = 0

// function Book(author, title, numPages, isRead) {
//     this.author = author
//     this.title = title
//     this.numPages = numPages
//     this.isRead = isRead
//     this.id = idCount
//     idCount += 1

//     this.toggleReadStatus = function() {
//         const readBtn = document.querySelector("#read-" + this.id)
//         if (this.isRead) {
//             this.isRead = false
//             readBtn.textContent = "Not Read"
//             readBtn.style.backgroundColor = "pink"
//         } else {
//             this.isRead = true
//             readBtn.textContent = "Read"
//             readBtn.style.backgroundColor = "lightgreen"
//         }
//     }
// }

// function addBookToLibrary(author, title, numPages, isRead) {
//     const book = new Book(author, title, numPages, isRead)
//     myLibrary.push(book)
//     displayBooks()
// }

// function displayBooks() {
//     removeChildren(bookDisplay)
    
//     myLibrary.forEach((book) => {
//         let content = document.createElement("div")
//         content.classList.add("card")
//         content.id = "book-" + book.id

//         let title = document.createElement("p")
//         title.classList.add("book-title")
//         title.textContent = "\"" + book.title + "\""
//         content.appendChild(title)
        
//         let author = document.createElement("p")
//         author.classList.add("book-author")
//         author.textContent = "by " + book.author
//         content.appendChild(author)

//         let pages = document.createElement("p")
//         pages.classList.add("book-pages")
//         pages.textContent = book.numPages + " Pages"
//         content.appendChild(pages)

//         let readStatus = document.createElement("button")
//         if (book.isRead) {
//             readStatus.textContent = "Read"
//             readStatus.style.backgroundColor = "lightgreen"
//         } else {
//             readStatus.textContent = "Not Read"
//             readStatus.style.backgroundColor = "pink"
//         }
//         readStatus.classList.add("book-read-status")
//         readStatus.id = "read-" + book.id
//         content.appendChild(readStatus)

//         let removeBtn = document.createElement("button")
//         removeBtn.classList.add("remove-book")
//         removeBtn.textContent = "Remove"
//         content.appendChild(removeBtn)

//         bookDisplay.appendChild(content)
//     })

//     const removeBtnList = document.querySelectorAll(".remove-book")
//     removeBtnList.forEach((btn) => {
//         btn.addEventListener("click", () => {
//             const bookId = btn.parentElement.id.split("-")[1]
//             removeBook(bookId)
//         })
//     })

//     const readToggleList = document.querySelectorAll(".book-read-status")
//     readToggleList.forEach((btn) => {
//         btn.addEventListener("click", () => {
//             const bookId = Number(btn.id.split("-")[1])
//             const index = myLibrary.map(book => book.id).indexOf(bookId)
//             myLibrary[index].toggleReadStatus()
//         })

//     })

// }

// function removeBook(id) {
//     const index = myLibrary.map(book => book.id).indexOf(id)
//     myLibrary.splice(index, 1)

//     const book = document.querySelector("#book-" + id)
//     bookDisplay.removeChild(book)
//     displayBooks()
// }

// function removeChildren(element) {
//     while (element.firstChild) {
//         element.removeChild(element.firstChild)
//     }
// }

// const addBookBtn = document.querySelector("#add-book")
// const modal = document.querySelector(".modal-form")
// const bookForm = document.querySelector("#book-form")
// const cancelBtn = document.querySelector(".cancel")

// addBookBtn.addEventListener("click", () => {
//     modal.showModal()
// })

// const titleInput = document.querySelector("input#book-title")
// const authorInput = document.querySelector("input#book-author")
// const pageInput = document.querySelector("input#book-pages")
// const readInput = document.querySelector("input#book-read")

// bookForm.addEventListener("submit", () => {
//     addBookToLibrary(authorInput.value, titleInput.value, pageInput.value, readInput.checked)
//     modal.close()
// })

// cancelBtn.addEventListener("click", () => {
//     modal.close()
// })

// modal.addEventListener("close", () => {
//     bookForm.reset()
// })


class Book {
    static idCount = 0

    constructor(author, title, numPages, isRead) {
        this.author = author
        this.title = title
        this.numPages = numPages
        this.isRead = isRead
        this.id = Book.idCount

        Book.idCount += 1
    }

    toggleReadStatus() {
        if (this.isRead) {
            this.isRead = false
        } else {
            this.isRead = true
        }
        pubSub.notify("read-status-changed", this.isRead)
    }
}

const libraryManager = (function() {
    const library = []

    const addBook = (author, title, numPages, isRead) => {
        const book = new Book(author, title, numPages, isRead)
        library.push(book)
        pubSub.notify("book-added", book)
        console.table(library) //
    }

    const removeBook = (id) => {
        const index = library.map(book => book.id).indexOf(id)
        library.splice(index, 1)
        pubSub.notify("book-removed", book.id)
        console.table(library) //
    }

    const findBook = (id) => {
        const index = library.map(book => book.id).indexOf(id)
        return library[index]
    }

    return {
        addBook,
        removeBook,
        findBook
    }
})()

const libraryDisplay = (function() {
    const displayDiv = document.querySelector(".display")

    const addBookBtn = document.querySelector("#add-book")
    const modal = document.querySelector(".modal-form")
    const bookForm = document.querySelector("#book-form")
    const cancelBtn = document.querySelector(".cancel")

    const updateDisplay = (book) => {

    }

    pubSub.subscribe("book-added", updateDisplay)

    const closeAndResetModal = () => {
        modal.close()
        bookForm.reset()
    }

    addBookBtn.addEventListener("click", () => {
        modal.showModal()
    })

    bookForm.addEventListener("submit", () => {
        const titleInput = document.querySelector("input#book-title").value
        const authorInput = document.querySelector("input#book-author").value
        const pageInput = document.querySelector("input#book-pages").value
        const readInput = document.querySelector("input#book-read").checked

        libraryManager.addBook(authorInput, titleInput, pageInput, readInput)
        closeAndResetModal()
    })

    cancelBtn.addEventListener("click", closeAndResetModal)
})()