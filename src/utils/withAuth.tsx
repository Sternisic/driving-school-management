"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/"); // Umleitung zur Login-Seite
      }
    }, [status, router]);

    if (status === "loading") {
      return <div>Loading...</div>; // Optionale Ladeanzeige
    }

    return <WrappedComponent {...props} />;
  };
}
