import { Request, Response } from "express";
import Stripe from "stripe";
import { formatErrorResponse } from "../utils/formatResponse";
import { ERROR_CODES } from "../constants/errorCode";
import db from "../config/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = "your-webhook-secret";

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { priceId, productId, planId } = req.body;
    const userId = req.user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { planId: true, nextPaymentDate: true, subscriptionStatus: true },
    });

    if (
      user.planId === planId &&
      user.nextPaymentDate > new Date() &&
      user.subscriptionStatus === "active"
    ) {
      return res
        .status(400)
        .json({ error: "User is already subscribed to this plan" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.origin}/subscription/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/products`,
      metadata: {
        productId: String(productId),
        userId: String(userId),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Error creating checkout session" });
  }
};

export const getCheckoutSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json(session);
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    res.status(500).json({ error: "Error retrieving checkout session" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res
      .status(400)
      .send(
        formatErrorResponse(
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          "An error occurred while processing the webhook"
        )
      );
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "invoice.payment_succeeded":
        try {
          const invoice = event.data.object as Stripe.Invoice;
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );
          const customerId = subscription.customer as string;
          const subscriptionId = subscription.id as string;
          const userId = parseInt(subscription.metadata.userId, 10);
          const productId = parseInt(subscription.metadata.productId, 10);

          await db.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: customerId,
              subscriptionId: subscriptionId,
              subscriptionStatus: "active",
              planId: productId,
              lastPaymentDate: new Date(invoice.created * 1000),
              nextPaymentDate: new Date(subscription.current_period_end * 1000),
            },
          });
        } catch (error) {
          console.error("Error processing payment succeeded webhook:", error);
        }
        break;

      case "invoice.payment_failed":
        try {
          const failedInvoice = event.data.object as Stripe.Invoice;
          const failedCustomerId = failedInvoice.customer as string;
          const failedUser = await db.user.findFirst({
            where: { stripeCustomerId: failedCustomerId },
            select: { id: true },
          });

          if (failedUser) {
            await db.user.update({
              where: { id: failedUser.id },
              data: {
                subscriptionStatus: "inactive",
              },
            });
          }
        } catch (error) {
          console.error("Error processing payment failed webhook:", error);
        }
        break;

      case "customer.subscription.updated":
        try {
          const updatedSubscription = event.data.object as Stripe.Subscription;
          const updatedCustomerId = updatedSubscription.customer as string;
          const updatedUserId = parseInt(
            updatedSubscription.metadata.userId,
            10
          );
          const updatedProductId = parseInt(
            updatedSubscription.metadata.productId,
            10
          );

          await db.user.update({
            where: { id: updatedUserId },
            data: {
              subscriptionId: updatedSubscription.id,
              subscriptionStatus: "active",
              planId: updatedProductId,
              nextPaymentDate: new Date(
                updatedSubscription.current_period_end * 1000
              ),
            },
          });
        } catch (error) {
          console.error(
            "Error processing subscription updated webhook:",
            error
          );
        }
        break;

      case "customer.subscription.deleted":
        try {
          const deletedSubscription = event.data.object as Stripe.Subscription;
          const deletedCustomerId = deletedSubscription.customer as string;
          const deletedUserId = parseInt(
            deletedSubscription.metadata.userId,
            10
          );

          await db.user.update({
            where: { id: deletedUserId },
            data: {
              subscriptionStatus: "canceled",
            },
          });
        } catch (error) {
          console.error(
            "Error processing subscription deleted webhook:",
            error
          );
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook event:", error);
    res
      .status(500)
      .send(
        formatErrorResponse(
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          "An error occurred while processing the webhook event"
        )
      );
  }
};
