import { useState } from "react";

export default function useAgentFlow() {
  const [status] = useState("idle");
  const [output] = useState("");

  return { status, output };
}

