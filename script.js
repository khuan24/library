const bookDisplay = document.querySelector(".display")

const myLibrary = []
let idCount = 0

function Book(author, title, numPages, isRead) {
    this.author = author
    this.title = title
    this.numPages = numPages
    this.isRead = isRead
    this.id = idCount
    idCount += 1

    this.toggleReadStatus = function() {
        const readBtn = document.querySelector("#read-" + this.id)
        if (this.isRead) {
            this.isRead = false
            readBtn.textContent = "Not Read"
        } else {
            this.isRead = true
            readBtn.textContent = "Read"
        }
    }
}

function addBookToLibrary(author, title, numPages, isRead) {
    const book = new Book(author, title, numPages, isRead)
    myLibrary.push(book)
    displayBooks()
}

function displayBooks() {
    removeChildren(bookDisplay)
    
    myLibrary.forEach((book) => {
        let content = document.createElement("div")
        content.classList.add("card")
        content.id = "book-" + book.id

        let title = document.createElement("p")
        title.classList.add("book-title")
        title.textContent = book.title
        content.appendChild(title)
        
        let author = document.createElement("p")
        author.classList.add("book-author")
        author.textContent = book.author
        content.appendChild(author)

        let pages = document.createElement("p")
        pages.classList.add("book-pages")
        pages.textContent = book.numPages
        content.appendChild(pages)

        let readStatus = document.createElement("button")
        if (book.isRead) {
            readStatus.textContent = "Read"
        } else {
            readStatus.textContent = "Not Read"
        }
        readStatus.classList.add("book-read-status")
        readStatus.id = "read-" + book.id
        content.appendChild(readStatus)

        let removeBtn = document.createElement("button")
        removeBtn.classList.add("remove-book")
        removeBtn.textContent = "Remove"
        content.appendChild(removeBtn)

        bookDisplay.appendChild(content)
    })

    const removeBtnList = document.querySelectorAll(".remove-book")
    removeBtnList.forEach((btn) => {
        btn.addEventListener("click", () => {
            const bookId = btn.parentElement.id.split("-")[1]
            removeBook(bookId)
        })
    })

    const readToggleList = document.querySelectorAll(".book-read-status")
    readToggleList.forEach((btn) => {
        btn.addEventListener("click", () => {
            const bookId = Number(btn.id.split("-")[1])
            const index = myLibrary.map(book => book.id).indexOf(bookId)
            myLibrary[index].toggleReadStatus()
        })

    })

}

function removeBook(id) {
    const index = myLibrary.map(book => book.id).indexOf(id)
    myLibrary.splice(index, 1)

    const book = document.querySelector("#book-" + id)
    bookDisplay.removeChild(book)
    displayBooks()
}

function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

