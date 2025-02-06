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
    }
}

const libraryManager = (function() {
    const library = []

    const addBook = (author, title, numPages, isRead) => {
        const book = new Book(author, title, numPages, isRead)
        library.push(book)
        pubSub.notify("book-added", book)
        // console.table(library) 
    }

    const removeBook = (id) => {
        const index = library.map(book => book.id).indexOf(id)
        library.splice(index, 1)
        // console.table(library) 
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
        // Create div
        const cardDiv = document.createElement("div")
        cardDiv.classList.add("card")
        // Render title
        const title = document.createElement("p")
        title.classList.add("book-title")
        title.textContent = `"${book.title}"`
        cardDiv.appendChild(title)
        // Render author
        const author = document.createElement("p")
        author.classList.add("book-author")
        author.textContent = "by " + book.author
        cardDiv.appendChild(author)
        // Render number of pages
        const pages = document.createElement("p")
        pages.classList.add("book-pages")
        pages.textContent = book.numPages + " Pages"
        cardDiv.appendChild(pages)
        // Render the read status
        const readStatus = document.createElement("button")
        readStatus.classList.add("book-read-status")
        readStatus.dataset.read = book.isRead // allows css to control styling 
        // text content need to change dynamically
        const setReadStatusText = (isRead) => {
            if (isRead) {
                readStatus.textContent = "Read"
            } 
            else {
                readStatus.textContent = "Not Read"
            }
        }
        setReadStatusText(book.isRead)
        // add click event
        readStatus.addEventListener("click", () => {
            const target = libraryManager.findBook(book.id)
            target.toggleReadStatus()
            readStatus.dataset.read = target.isRead
            setReadStatusText(target.isRead)
        })
        // Render the remove button
        const removeBtn = document.createElement("button")
        removeBtn.classList.add("remove-book")
        removeBtn.textContent = "Remove"
        // add click event
        removeBtn.addEventListener("click", () => {
            libraryManager.removeBook(book.id)
            displayDiv.removeChild(cardDiv)
        })
        // Add buttons to group
        const btnGroup = document.createElement("div")
        btnGroup.classList.add("button-group")
        btnGroup.appendChild(readStatus)
        btnGroup.appendChild(removeBtn)
        cardDiv.appendChild(btnGroup)
        // Render the card
        displayDiv.appendChild(cardDiv)
    }
    // be notified when the display needs to be updated
    pubSub.subscribe("book-added", updateDisplay)

    // Form/Modal control

    // Show
    addBookBtn.addEventListener("click", () => {
        modal.showModal()
    })

    // Submit and Close
    const closeAndResetModal = () => {
        modal.close()
        bookForm.reset()
    }

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

const initLibrary = (function (){
    // Add some books to be displayed
    libraryManager.addBook("George Orwell", "1984", 328, true)
    libraryManager.addBook("Harper Lee", "To Kill a Mockingbird", 281, false)
    libraryManager.addBook("J.R.R. Tolkien", "The Hobbit", 310, true)
    libraryManager.addBook("Suzanne Collins", "The Hunger Games", 374, false)
    libraryManager.addBook("Yuval Noah Harari", "Sapiens: A Brief History of Humankind", 443, true)
})()