import { CategoryModel, ICategory } from "../../domain/v1/Category";

export class GetAllCategories {
  async execute() {
    return await CategoryModel.find({ isActive: true });
  }
}

export class GetCategoryById {
  async execute(id: string) {
    const category = await CategoryModel.findById(id);
    if (!category) throw new Error("Category not found");
    return category;
  }
}
export class CreateCategory {
  async execute(data: Partial<ICategory>) {
    // Auto-generate slug if not provided (e.g., "Horror Books" -> "horror-books")
    if (data.name && !data.slug) {
      data.slug = data.name.toLowerCase().trim().replace(/\s+/g, "-");
    }

    const category = new CategoryModel(data);
    return await category.save();
  }
}
export class UpdateCategory {
  async execute(id: string, updateData: Partial<ICategory>) {
    // If name is updated, we might want to update the slug too
    if (updateData.name) {
      updateData.slug = updateData.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
    }

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!category) throw new Error("Category not found");
    return category;
  }
}
export class DeleteCategory {
  // Option A: Hard Delete
  async execute(id: string) {
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) throw new Error("Category not found");
    return { message: "Category deleted from database" };
  }

  /* // Option B: Soft Delete (Recommended for E-commerce)
  async softDelete(id: string) {
    return await CategoryModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
  */
}
