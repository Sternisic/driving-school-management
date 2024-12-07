'use client';

import React, { useEffect, useState } from "react";
import SessionAttendancePage from "@/components/SessionAttendancePage";

const SessionPage = ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Auflösen des Promises `params`
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setSessionId(resolvedParams.sessionId);
    };
    resolveParams();
  }, [params]);

  if (!sessionId) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-700">Lädt Unterrichtseinheit...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded">
        <header className="p-4 bg-primary text-white rounded-t">
          <h1 className="text-2xl font-bold">Unterrichtseinheit {sessionId}</h1>
        </header>
        <div className="p-4">
          <SessionAttendancePage sessionId={sessionId} />
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
