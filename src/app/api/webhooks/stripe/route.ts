import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Normalizes user subscription tier for `api_keys.tier` ('free' | 'developer' | 'enterprise')
 * and `users.subscription_tier` / `subscriptions.plan`.
 */
function normalizeTier(tierRaw?: string | null): {
  apiKeyTier: "free" | "developer" | "enterprise";
  userTier: string;
} {
  const normalized = (tierRaw || "").toLowerCase();
  if (normalized === "enterprise") {
    return { apiKeyTier: "enterprise", userTier: "enterprise" };
  }
  if (normalized === "pro" || normalized === "developer" || normalized === "pilot") {
    return { apiKeyTier: "developer", userTier: normalized };
  }
  return { apiKeyTier: "free", userTier: "free" };
}

export async function POST(request: Request) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2026-07-29.dahlia" });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error(
      "Stripe webhook signature verification failed",
      undefined,
      err instanceof Error ? err : undefined,
    );
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const rawTier = session.metadata?.tier || "pro";
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      const { apiKeyTier, userTier } = normalizeTier(rawTier);

      if (userId && customerId) {
        await admin.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan: userTier,
            status: "active",
          },
          { onConflict: "user_id" },
        );

        await admin.from("api_keys").update({ tier: apiKeyTier }).eq("provider", userId);
        await admin
          .from("users")
          .update({
            subscription_tier: userTier,
            stripe_customer_id: customerId,
          })
          .eq("id", userId);

        logger.info("Stripe checkout completed and tier updated", {
          userId,
          customerId,
          tier: userTier,
          apiKeyTier,
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const isActive = subscription.status === "active" || subscription.status === "trialing";
      const periodEnd = subscription.items.data[0]?.current_period_end;
      const rawTier = subscription.metadata?.tier || "pro";
      const { apiKeyTier, userTier } = normalizeTier(rawTier);

      await admin
        .from("subscriptions")
        .update({
          status: subscription.status,
          plan: isActive ? userTier : "free",
          current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        })
        .eq("stripe_subscription_id", subscription.id);

      let userId = subscription.metadata?.user_id;
      if (!userId) {
        const { data: subData } = await admin
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();
        userId = subData?.user_id;
      }

      if (userId) {
        if (isActive) {
          await admin.from("api_keys").update({ tier: apiKeyTier }).eq("provider", userId);
          await admin.from("users").update({ subscription_tier: userTier }).eq("id", userId);
          logger.info("Stripe subscription updated (active)", {
            userId,
            subscriptionId: subscription.id,
            userTier,
            apiKeyTier,
          });
        } else {
          await admin.from("api_keys").update({ tier: "free" }).eq("provider", userId);
          await admin.from("users").update({ subscription_tier: "free" }).eq("id", userId);
          logger.info("Stripe subscription updated (inactive)", {
            userId,
            subscriptionId: subscription.id,
          });
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      let userId = subscription.metadata?.user_id;

      if (!userId) {
        const { data: subData } = await admin
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();
        userId = subData?.user_id;
      }

      await admin
        .from("subscriptions")
        .update({ status: "canceled", plan: "free" })
        .eq("stripe_subscription_id", subscription.id);

      if (userId) {
        await admin.from("api_keys").update({ tier: "free" }).eq("provider", userId);
        await admin.from("users").update({ subscription_tier: "free" }).eq("id", userId);
      }

      logger.info("Stripe subscription canceled", { subscriptionId: subscription.id, userId });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
