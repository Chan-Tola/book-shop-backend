import { AuthorModel, IAuthor } from "../../domain/v1/Author";

export class GetAllAuthors {
  async execute() {
    return await AuthorModel.find();
  }
}

export class GetAuthorById {
  async execute(id: string) {
    const author = await AuthorModel.findById(id);
    if (!author) throw new Error("Author not found");
    return author;
  }
}

export class CreateAuthor {
  async execute(data: Partial<IAuthor>) {
    const author = new AuthorModel(data);
    return await author.save();
  }
}

export class UpdateAuthor {
  async execute(id: string, data: Partial<IAuthor>) {
    const author = await AuthorModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    if (!author) throw new Error("Author not found");
    return author;
  }
}

export class DeleteAuthor {
  async execute(id: string) {
    const author = await AuthorModel.findByIdAndDelete(id);
    if (!author) throw new Error("Author not found");
    return { message: "Author deleted successfully" };
  }
}
