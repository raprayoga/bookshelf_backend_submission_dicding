const { nanoid } = require('nanoid')
const bukus = require('./bukus')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    })
    response.code(400)
    return response
  }

  const id = nanoid(16)
  const finished = pageCount === readPage ? true : false
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  }
  bukus.push(newBooks)

  const isSuccess = bukus.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
    response.code(201)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku  gagal ditambahkan',
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query
  let books = JSON.parse(JSON.stringify(bukus))

  if (reading === '1') {
    books = books.filter((book) => book.reading === true)
  } else if (reading === '0') {
    books = books.filter((book) => book.reading === false)
  }

  if (finished === '1') {
    books = books.filter((book) => book.finished === true)
  } else if (finished === '0') {
    books = books.filter((book) => book.finished === false)
  }

  if (name) books = books.filter((book) => book.name == `${name}`)

  books.map((book) => {
    delete book['year']
    delete book['author']
    delete book['summary']
    delete book['pageCount']
    delete book['readPage']
    delete book['finished']
    delete book['reading']
    delete book['insertedAt']
    delete book['updatedAt']
  })

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  })
  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = bukus.filter((book) => book.id === bookId)[0]

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    })
    response.code(400)
    return response
  }

  const updatedAt = new Date().toISOString()

  const index = bukus.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    bukus[index] = {
      ...bukus[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = bukus.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    bukus.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
}
