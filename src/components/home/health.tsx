"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function Health() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkHealth = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error("Environment variable NEXT_PUBLIC_API_URL is not set.");
        setIsModalOpen(true);
        return;
      }

      const res = await fetch(`${apiUrl}/health`);

      if (!res.ok) {
        throw new Error(`Health check failed with status: ${res.status}`);
      }

      console.log("Backend connection established successfully.");
    } catch (error) {
      console.error("Failed to connect to the backend:", error);
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Backend Service Notice</DialogTitle>
          <DialogDescription>
            The backend server is not running to conserve resources. This is
            expected behavior.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
