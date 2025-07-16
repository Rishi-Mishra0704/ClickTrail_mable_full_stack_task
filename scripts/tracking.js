
(function () {
  const TRACKING_ENDPOINT = "https://clicktrail-mable-full-stack-task.onrender.com/events/add";

  const sessionId = (() => {
    const key = "clicktrail_session_id";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(key, id);
    }
    return id;
  })();

  const getUserData = () => {
    try {
      return JSON.parse(localStorage.getItem("user-store") || "{}");
    } catch {
      return {};
    }
  };

  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          resolve({ latitude, longitude });
        },
        () => resolve(null),
        { timeout: 3000 }
      );
    });
  };

  const sendEvent = async (eventType, data = {}) => {
    const basePayload = {
      eventType,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      sessionId,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      user: getUserData(), // pulled from localStorage or empty
    };

    const location = await getLocation();
    if (location) basePayload.location = location;

    const payload = { ...basePayload, ...data };

    try {
      await fetch(TRACKING_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Tracking failed:", err);
    }
  };

  const trackPageView = () => sendEvent("page_view");

  const trackAddToCart = (itemId, itemName, price) => {
    sendEvent("add_to_cart", { itemId, itemName, price });
  };

  const trackRemoveFromCart = (itemId, itemName, price) => {
    sendEvent("remove_from_cart", { itemId, itemName, price });
  };

  const trackCheckout = (cartItems) => {
    sendEvent("checkout", { cartItems });
  };

  const trackClick = (target) => {
    sendEvent("click", {
      tag: target.tagName,
      id: target.id,
      className: target.className,
      text: target.innerText?.slice(0, 100), // for context
    });
  };

  window.addEventListener("DOMContentLoaded", () => {
    trackPageView();

    window.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      console.log("[TARGET] clicked", target);
      
      // Add to Cart
      if (target.matches("[data-track='add-to-cart']")) {
        const itemId = target.getAttribute("data-item-id");
        const itemName = target.getAttribute("data-item-name");
        const price = parseFloat(target.getAttribute("data-item-price"));
        trackAddToCart(itemId, itemName, price);
        return;
      }

      // Checkout
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

      // Remove from cart
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
    trackPageView,
    trackAddToCart,
    trackRemoveFromCart,
    trackCheckout,
    trackClick,
  };
})();
