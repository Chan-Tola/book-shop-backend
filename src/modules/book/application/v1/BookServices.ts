import { BookModel, IBook } from "../../domain/v1/Book";

export class GetAllBooks {
  async execute() {
    return await BookModel.find().populate("author category");
  }
}

export class GetBookById {
  async execute(id: string) {
    const book = await BookModel.findById(id).populate("author category");
    if (!book) throw new Error("Book not found");
    return book;
  }
}

export class CreateBook {
  async execute(data: Partial<IBook>) {
    const book = new BookModel(data);
    return await book.save();
  }
}

export class UpdateBook {
  async execute(id: string, data: Partial<IBook>) {
    const book = await BookModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    if (!book) throw new Error("Book not found");
    return book;
  }
}

export class DeleteBook {
  async execute(id: string) {
    const book = await BookModel.findByIdAndDelete(id);
    if (!book) throw new Error("Book not found");
    return book;
  }
}
