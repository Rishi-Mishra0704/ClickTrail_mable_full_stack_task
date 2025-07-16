(function () {
  const TRACKING_ENDPOINT = "http://localhost:8080/events/add"; // change to actual endpoint

  const sessionId = (() => {
    const key = "clicktrail_session_id";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(key, id);
    }
    return id;
  })();

  const sendEvent = async (eventType, data = {}) => {
    const payload = {
      eventType,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      sessionId,
      ...data,
    };

    try {
      await fetch(TRACKING_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // Optional: Log to console
      console.warn("Tracking failed:", err);
    }
  };

  const trackPageView = () => sendEvent("page_view");

  const trackAddToCart = (itemId, itemName, price) => {
    sendEvent("add_to_cart", { itemId, itemName, price });
  };

  const trackCheckout = (cartItems) => {
    sendEvent("checkout", { cartItems });
  };
  const trackRemoveFromCart = (itemId, itemName, price) => {
    sendEvent("remove_from_cart", { itemId, itemName, price });
  };

  const trackClick = (target) => {
    sendEvent("click", {
      tag: target.tagName,
      id: target.id,
      className: target.className,
    });
  };

  // Initial page load tracking
  window.addEventListener("DOMContentLoaded", () => {
    trackPageView();

    // Click tracking
    window.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      console.log("[TRACKING] Clicked:", target);

      // Detect add to cart
      if (target.matches("[data-track='add-to-cart']")) {
        const itemId = target.getAttribute("data-item-id");
        const itemName = target.getAttribute("data-item-name");
        const price = parseFloat(target.getAttribute("data-item-price"));
        trackAddToCart(itemId, itemName, price);
        return;
      }

      // Detect checkout
      if (target.matches("[data-track='checkout']")) {
        const cartData = window.localStorage.getItem("cart-store");
        try {
          const cartItems = JSON.parse(cartData || "[]");
          trackCheckout(cartItems);
        } catch {
          trackCheckout([]);
        }
        return;
      }

      // Detect remove from cart
      if (target.matches("[data-track='remove-from-cart']")) {
        const itemId = target.getAttribute("data-item-id");
        const itemName = target.getAttribute("data-item-name");
        const price = parseFloat(target.getAttribute("data-item-price"));
        trackRemoveFromCart(itemId, itemName, price);
        return;
      }

      // General click
      trackClick(target);
    });
  });

  window.__ClickTrail = {
    trackAddToCart,
    trackCheckout,
    trackClick,
    trackPageView,
    trackRemoveFromCart,
  };
})();
