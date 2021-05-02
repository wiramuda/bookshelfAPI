/* eslint-disable no-restricted-globals */
const { nanoid } = require('nanoid');
const books = require('./book');
// ------------------------fungsi handler Post Book---------------
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = Boolean(pageCount === readPage ? 1 : 0);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const addBook = {
    // eslint-disable-next-line max-len
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };
  // mengembalikan nilai true jika name kosong;
  const nameEmpty = Boolean(addBook.name ? 1 : 0);
  // mengembalaikan nilai true jika readPage > pageCount;
  const pageCountFalse = Boolean(readPage > pageCount ? 1 : 0);
  if (!nameEmpty) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (pageCountFalse) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } if (nameEmpty && !pageCountFalse) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    books.push(addBook);
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// ---------------fungsi handler get all book-------------------;
const getBooksHandler = (request, h) => {
  const hasil = books.map((item) => ({ id: item.id, name: item.name, publisher: item.publisher }));
  const { name, reading, finished } = request.query;

  if (name) {
    const filterName = books.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
    const bookName = filterName.map((item) => (
      { id: item.id, name: item.name, publisher: item.publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: bookName,
      },
    });
    response.code(200);
    return response;
  } if (reading !== undefined) {
    // eslint-disable-next-line radix
    const filterBook = books.filter((item) => item.reading === Boolean(parseInt(reading)));
    const readingBook = filterBook.map((item) => (
      { id: item.id, name: item.name, publisher: item.publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: readingBook,
      },
    });
    response.code(200);
    return response;
  } if (finished !== undefined) {
    // eslint-disable-next-line radix
    const filterFinished = books.filter((item) => item.finished === Boolean(parseInt(finished)));
    const finishedBook = filterFinished.map((item) => (
      { id: item.id, name: item.name, publisher: item.publisher }));
    const response = h.response({
      status: 'success',
      message: `${Boolean(finished)} ${finished}`,
      data: {
        books: finishedBook,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books: hasil,
    },
  });
  response.code(200);
  return response;
};

// --------------------fungsi handler get book from id------------------
const getBookById = (request, h) => {
  const { bookId } = request.params;
  // mengembalikan nilai undefined jika book []
  const book = books.filter((item) => item.id === bookId)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
// ---------------fungsi handler update data existing book---------------
const putBookHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const finished = Boolean(readPage === pageCount ? 1 : 0);
  const updatedAt = new Date().toISOString();
  // mengembalikan nilai 0 jika name kosong;
  const nameEmpty = Boolean(name ? 1 : 0);
  // mengembalaikan nilai true jika readPage > pageCount;
  const pageCountFalse = Boolean(readPage > pageCount ? 1 : 0);
  const index = books.findIndex((item) => item.id === bookId);
  if (!nameEmpty) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (pageCountFalse) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  } // if (nameEmpty && !pageCountFalse && index !== -1) {
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    updatedAt,
  };
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
  // }
};
// function handler delete book by id
const deleteByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const findBook = books.filter((item) => item.id === bookId)[0];
  if (findBook) {
  // menghapus item mulai dari index sebanyak 0 element
    books.splice(0, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  addBookHandler,
  getBooksHandler,
  getBookById,
  putBookHandler,
  deleteByIdHandler,
};
