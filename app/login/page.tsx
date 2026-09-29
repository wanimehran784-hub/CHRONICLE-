async function submit(e: React.FormEvent) {
  e.preventDefault();
  setBusy(true);
  setError("");

  if (mode === "signup") {
    const code = inviteCode.trim().toUpperCase();

    const { data: valid, error: checkError } = await supabase.rpc(
      "check_invite",
      { p_code: code }
    );

    if (checkError || !valid) {
      setBusy(false);
      setError("That invite code is invalid or already used.");
      return;
    }

    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName.trim(),
            handle: handle
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, ""),
          },
        },
      });

    if (signUpError) {
      setBusy(false);
      setError(signUpError.message);
      return;
    }

    if (signUpData.session) {
      await supabase.rpc("redeem_invite", { p_code: code });
    } else {
      try {
        localStorage.setItem("pending_invite", code);
      } catch {}
    }

    setBusy(false);
    router.push("/");
    router.refresh();
    return;
  }

  const result = await supabase.auth.signInWithPassword({ email, password });

  if (result.error) {
    setBusy(false);
    setError(result.error.message);
    return;
  }

  try {
    const pending = localStorage.getItem("pending_invite");
    if (pending) {
      await supabase.rpc("redeem_invite", { p_code: pending });
      localStorage.removeItem("pending_invite");
    }
  } catch {}

  setBusy(false);
  router.push("/");
  router.refresh();
}
