import { Types } from "mongoose";
import { AuthorModel } from "../../../author/domain/v1/Author";
import { CategoryModel } from "../../../category/domain/v1/Category";
import { BookModel, IBook } from "../../domain/v1/Book";

type BookFilters = {
  title?: string;
  author?: string;
  category?: string;
};

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class GetAllBooks {
  async execute(filters: BookFilters = {}) {
    const query: Record<string, unknown> = {};

    if (filters.title) {
      query.title = {
        $regex: escapeRegex(filters.title),
        $options: "i",
      };
    }

    if (filters.author) {
      if (Types.ObjectId.isValid(filters.author)) {
        query.author = filters.author;
      } else {
        const authors = await AuthorModel.find(
          { name: { $regex: escapeRegex(filters.author), $options: "i" } },
          { _id: 1 },
        );
        if (authors.length === 0) return [];
        query.author = { $in: authors.map((author) => author._id) };
      }
    }

    if (filters.category) {
      if (Types.ObjectId.isValid(filters.category)) {
        query.category = filters.category;
      } else {
        const categories = await CategoryModel.find(
          {
            $or: [
              { name: { $regex: escapeRegex(filters.category), $options: "i" } },
              { slug: { $regex: escapeRegex(filters.category), $options: "i" } },
            ],
          },
          { _id: 1 },
        );
        if (categories.length === 0) return [];
        query.category = { $in: categories.map((category) => category._id) };
      }
    }

    return await BookModel.find(query).populate("author category");
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
