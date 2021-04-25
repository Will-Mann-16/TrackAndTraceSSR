import slug from "slugify";

export default function slugify(str: string) {
  return slug(str, {
    lower: true,
    strict: true,
  });
}
