import { PrismaClient } from "@prisma/client";
import db from "../config/db";
import { PRODUCTS } from "../constants/stripe";

export const getUserWithPlan = async (userId: number) => {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { planId: true, ownedServers: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // PRODUCTS 배열에서 해당 planId를 가진 프로덕트를 찾습니다.
    const product = PRODUCTS.find((product) => product.id === user.planId);

    if (!product) {
      throw new Error("Product not found for the given planId");
    }

    return { user, product };
  } catch (error) {
    console.error("Error fetching user plan:", error);
    throw error;
  }
};
