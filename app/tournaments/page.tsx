"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ErrorDisplay } from "@/components/ui/error-display";
import { Badge } from "@/components/ui/badge";

// Define the Tournament type based on your Prisma schema
interface Tournament {
  id: string;
  name: string;
  description: string | null;
  startTime: string;
  endTime: string;
  prizePool: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/tournaments");
        const data = await response.json();
        if (data.success) {
          setTournaments(data.tournaments);
        } else {
          setError(data.message || "Failed to load tournaments.");
        }
      } catch (error) {
        console.error("Failed to fetch tournaments", error);
        setError("An unexpected error occurred while fetching tournaments.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const isTournamentActive = (startTime: string, endTime: string) => {
    const now = new Date();
    return new Date(startTime) <= now && new Date(endTime) >= now;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
        <span className="ml-2">Loading tournaments...</span>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay title="Could not load tournaments" message={error} />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tournaments</h1>
        <p className="text-muted-foreground mt-1">
          Compete with other traders and win prizes.
        </p>
      </div>

      {tournaments.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tournaments.map((tournament) => (
            <motion.div key={tournament.id} variants={itemVariants}>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{tournament.name}</CardTitle>
                    {isTournamentActive(tournament.startTime, tournament.endTime) && (
                      <Badge variant="destructive">Live</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-sm text-muted-foreground mb-4">
                    {tournament.description}
                  </p>
                  <div className="mt-auto space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Starts</span>
                      <span className="text-sm font-semibold">
                        {new Date(tournament.startTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Ends</span>
                      <span className="text-sm font-semibold">
                        {new Date(tournament.endTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Prize Pool</span>
                      <span className="text-lg font-bold text-green-500">
                        ${Number(tournament.prizePool).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Link href={`/tournaments/${tournament.id}`} passHref>
                    <Button className="w-full mt-4">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No Tournaments Available</h2>
          <p className="text-muted-foreground mt-2">
            Check back later for new and upcoming tournaments.
          </p>
        </div>
      )}
    </div>
  );
}
