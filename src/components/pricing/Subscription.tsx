import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { User } from "firebase/auth";

export async function subscribe(user: User) {
  try {
    await user.getIdToken(true);

    const fn = httpsCallable(functions, "createSubscription");

    const res: any = await fn({
      firstname: user.displayName?.split(" ")[0] || "Test",
      lastname: user.displayName?.split(" ")[1] || "User",
      email: user.email || "test@example.com",
    });

    const form = document.createElement("form");
    form.method = "POST";
    form.action = res.data.payuUrl;

    Object.entries(res.data).forEach(([k, v]) => {
      if (k === "payuUrl") return;
      const input = document.createElement("input");
      input.name = k;
      input.value = String(v);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  } catch (error) {
    console.error("Subscription failed:", error);
  }
}
