export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
} from "./auth.schema";

export {
  createProductSchema,
  updateProductSchema,
} from "./product.schema";

export { checkoutSchema } from "./order.schema";

export {
  productImageSchema,
  saveProductImagesSchema,
} from "./upload.schema";

export function formatZodError(error) {
  return error.issues.map((e) => e.message).join(". ");
}
