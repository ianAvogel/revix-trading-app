"use client"

import { useTimeStore } from "@/stores/timeStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export function TimeTravelControls() {
  const { replayTimestamp, setReplayTimestamp } = useTimeStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(replayTimestamp || new Date());

  const handleSetReplayTime = () => {
    if (selectedDate) {
      setReplayTimestamp(selectedDate);
    }
  };

  const handleResetTime = () => {
    setReplayTimestamp(null);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">Replay Mode</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select a date to view the market and your portfolio as it was at that time.
        </p>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border mb-4"
        />
        <div className="flex gap-2">
          <Button onClick={handleSetReplayTime} className="w-full">Set Replay Time</Button>
          {replayTimestamp && (
            <Button onClick={handleResetTime} variant="outline" className="w-full">
              Reset to Live
            </Button>
          )}
        </div>
        {replayTimestamp && (
          <p className="text-xs text-center mt-2 text-green-500">
            Replay active: {replayTimestamp.toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
